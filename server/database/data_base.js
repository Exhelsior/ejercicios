require("dotenv").config()
const mysql = require('mysql2/promise');


//Configuracion de la base de datos
const pool = mysql.createPool({
    host: process.env.DB_MAIN_HOST,
    user: process.env.DB_MAIN_USER,
    password: process.env.DB_MAIN_PASSWORD,
    database: process.env.DB_MAIN_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

//Funcion para probar la base de datos
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Conexion exitosa con la base de datos');
        connection.release();
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error)
    }
};

module.exports = {
    pool,
    testConnection
};
