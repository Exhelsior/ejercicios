const { pool } = require("../database/data_base");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require('crypto');
require('dotenv').config();

const transporter = nodemailer.createTransport ({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            success: false,
            message: 'Todos los campos son requeridos...' 
        });
    }

    try {
        const [user] = await pool.query(
            `SELECT u.*, r.id_rol, r.name_rol 
            FROM users u 
            INNER JOIN users_roles ur ON u.id_user = ur.user_id 
            INNER JOIN roles r ON ur.rol_id = r.id_rol 
            WHERE u.email = ?`, 
            [email]
        );

        if (user.length === 0) {
            return res.status(401).json({ 
                success: false,
                message: 'Correo electrónico no encontrado...' 
            });
        }

        console.log('Usuario encontrado:', user[0]);

        const match = await bcrypt.compare(password, user[0].password_hash);
        if (!match) {
            return res.status(401).json({ 
                success: false,
                message: 'Contraseña incorrecta...' 
            });
        }

        // Registrar sesión
        await pool.query(
            "INSERT INTO sessions (user_id, ip_address, started_at, finish_at) VALUES (?, ?, NOW(), NULL)",
            [user[0].id_user, req.ip]
        );

        res.json({
            success: true,
            message: "Inicio de sesión exitoso...",
            user: {
                id: user[0].id_user,
                name: user[0].full_name,
                email: user[0].email,
                rol: user[0].name_rol
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error en el servidor...' });
    }
}


async function sendToken(req, res) {
    const { email } = req.body;

    if (!email) {
        return res  
            .status(400)
            .json({message: 'Ingrese el email...'})
    }
    
    try {
        const [user] = await pool.query(
            'SELECT id_user FROM users WHERE email = ?', 
            [email]
        );

        if (user.length === 0) {
            return res
                .json({ 
                    success:false,
                    message: 'Correo electrónico no registrado...' 
                });
        }

        //Generamos el codigo y lo guaramos
        const resetCode = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await pool.query(
            'INSERT INTO password_resets (user_id, reset_code, expires_at) VALUES (?, ?, ?)',
            [user[0].id_user, resetCode, expiresAt]
        );

        await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to: email,
            subject: 'Codigo de recuperacion',
            text: `Tu codigo de recuperacion es: ${resetCode}. Expirara en 10 minutos`
        });

        res.json({
            success: true,
            message: 'Codigo enviado al correo'
        })
    } catch (error){
        console.error('Error enviado codigo:', error);
        res.status(500).json({
            message: 'Error en el servidor'
        })
    }
} 

const createUser = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const {
            full_name, email,
            password_hash, document_type,
            document_number, create_at, id_rol
        } = req.body;

        //Encriptamos la contraseña usando bcrypt
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password_hash, saltRounds);

        const [existEmail] = await connection.query(
            "SELECT id_user FROM users WHERE email = ?", [email]
        );

        if (existEmail.length > 0) {
            await connection.rollback();
            return res.status(409).json({
                message: 'El correo ya existe...' 
            });
        }

        const [result] = await connection.query(
            "INSERT INTO users (full_name, email, password_hash, document_type, document_number, create_at) VALUES (?, ?, ?, ?, ?, NOW())",
            [
                full_name, 
                email, 
                hashPassword, 
                document_type, 
                document_number, 
                create_at
            ]
        );

        const newUserId = result.insertId;

        await connection.query(
            "INSERT INTO users_roles (`user_id`, `rol_id`) VALUES (?, ?)",
            [newUserId, id_rol]
        );

        await connection.commit();
        
        res.status(201).json({
            id: newUserId,
            mensaje: "Usuario creado y rol asignado correctamente...",
        });
    } catch (error) {
        await connection.rollback();
        console.error("Error al crear usuario:", error);
        res.status(500).json({
            error: "Error al crear usuario...",
            detalles: error.message,
        })
    } finally {
        connection.release();
    }
};

async function validateToken (req, res) {
    const { email, reset_code } =req.body;

    if (!email || !reset_code) {
        return res.status(400).json({
            success: false,
            message: 'correo y codigo son requeridos'
        })
    }

    try {
        const [user] = await pool.query(
            'SELECT id_user FROM users WHERE email = ?', [email]
        );

        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no registrado'
            });
        }

        const userId = user[0].id_user;

        //Buscar el token en la base de datos
        const [token] = await pool.query(
            'SELECT * FROM password_resets WHERE user_id = ? AND reset_code= ? AND expires_at > NOW()',
            [userId, reset_code]
        );

        if (token.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Código inválido o expirado' 
            });
        }

        //Si es valido...
        await pool.query('DELETE FROM password_resets WHERE user_id = ?', [userId]);

        res.json({ 
            success: true, 
            message: 'Código validado correctamente' 
        });
    } catch  {
        console.error('Error validando código:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}

async function changePassword (req, res) {
    const  { email, new_password } = req.body;

    if(!email || !new_password) {
        return res.status(400).json({
            menssage: 'Todos los campos son requeridos'
        });
    }

    try {
        const [user]  = await pool.query(
            'SELECT id_user FROM users WHERE email = ?',[email]
        );

        if (user.length === 0) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            })
        }

        const userId = user[0].id_user;

        //Encriptar la nueva contraseña
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(new_password, saltRounds);

        //Actualizar la contraseña en la base de datos
        await pool.query(
            'UPDATE users SET password_hash = ? WHERE id_user = ?',
            [hashPassword, userId]
        );
        res.json({
            success: true, message:'Contraseña cambiada correctamente'
        });

    } catch (error) {
        console.error('Error cambiando contraseña:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}

module.exports = {
    login,
    createUser,
    sendToken,
    validateToken,
    changePassword
}