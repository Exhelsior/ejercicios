import { apiClient } from "./API_rest.js";
let vista = new Vista();

const arrayEmail = []

export const createUser = async () => {

    const path = "register"

    const fullName = document.getElementById("full-name").value.trim();
    const email = document.getElementById("email-register").value.trim();
    const typeDocument = document.getElementById("type-document").value.trim();
    const docNumber = document.getElementById("document").value.trim();
    const password = document.getElementById("password-register").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    const rol = document.getElementById("rol-usurio").value.trim();
    const rolId = parseInt(rol)

    if (!fullName || !email || !typeDocument || !docNumber || !password || !rolId) {
        alert("todos los campos son requeridos");
        return;
    };

    if (password != confirmPassword) {
        alert("Las contraseñas no coinciden...")
        return
    }
    
    const newUser = {
        full_name: fullName,
        email,
        password_hash: password,
        document_type: typeDocument,
        document_number: docNumber,
        id_rol: rolId
    };

    console.log(newUser);
    try {
        const response = await apiClient.createUser(newUser, path);
        console.log(response);
        if (!response) {
            throw new Error("Error al crear el usuario");
        }

        alert("Usuario registrado exitosamente");
        console.log("Usuario registrado:", response);

    } catch (error) {
        console.error(error.message);
        alert(`Error al registrar usuario: ${error.message}`);
    }
};

export const tokenSend = async () => {
    const path = "sendToken";

    const email = document.getElementById("email-recovery").value.trim();

    if (!email) {
        alert("Ingrese el correo");
        return;
    }

    const sendEmail = { email };

    try {
        const response = await apiClient.sendToken(sendEmail, path);
        console.log(response);

        if (!response.success) {
            alert(response.message); 
            return;
        }

        alert("Token enviado correctamente");

        arrayEmail.push(email)
        console.log(arrayEmail)

        vista.mostrarPlantilla("template-token", "box-temp");

    } catch (error) {
        console.error("Error al enviar el token:", error);
        alert("Error al enviar el token. Intente nuevamente.");
    }
};

export const tokenValidate = async () => {

    const path = 'validateToken'
    const token = document.getElementById("token").value.trim();

    if (!token) {
        alert("Ingrese el codigo");
        return;
    }

    const validate = {
        email: arrayEmail[0],
        reset_code: token
    }

    try {
        const response = await apiClient.sendToken(validate, path);
        console.log(response);
        if (!response.success) {
            alert(response.message);
            return;
        }

        alert("El token es correcto");

        vista.mostrarPlantilla("template-resset", "box-temp");
    } catch (error) {
        
    }
};

export const newPassword = async () => {
    const path = 'changePassword'

    const newPassword = document.getElementById("new-password").value.trim();
    const confirmNewPassword = document.getElementById("confirm-new-password").value.trim();

    if(!newPassword || !confirmNewPassword) {
        alert("Todos los campos son requeridos");
        return;
    }

    if (newPassword != confirmNewPassword) {
        alert("Las contraseñas no coinciden...")
        return
    }

    const resetPassword = {
        email: arrayEmail[0],
        new_password: newPassword
    };

    try {
       const response = await apiClient.passwordChange(resetPassword, path);
       console.log(response);
       
       if(!response.success) {
        alert(response.message);
        return;
       }

       alert("Contraseña actualizada");

       vista.mostrarPlantilla("template-login", "box-temp");

    } catch (error) {
        console.error("Error al cambiar la contraseña:", error);
        alert("Error al cambiar la contraseña.");
    }
}

export const inLog = async () => {
    const path = 'login';

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert('Todos los campos son requeridos');
        return;
    }

    const log = { email, password };

    try {
        const response = await apiClient.logIn(log, path);
        console.log("Respuesta del servidor:", response);

        if (!response.success) {
            alert(response.message);
            return;
        }

        alert("Bienvenido");
        vista.mostrarPlantilla("template-log-content", "box-temp");

    } catch (error) {
        console.error("Error en logIn:", error);
        alert(`Error inesperado: ${error.message || "No se pudo procesar la solicitud"}`);
    }
};
