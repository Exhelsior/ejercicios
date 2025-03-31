const API_URL = 'http://localhost:3000/api/';

export const apiClient = {

    async createUser(data, path) {
        try{
            const response = await fetch(`${API_URL}${path}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Error al crear el usuario');
            return await response.json();
            
        } catch(error) {
            console.error(error);
            return null;
        }
    },

    async sendToken(data, path) {
        try {
            const response = await fetch(`${API_URL}${path}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
    
            const result = await response.json();
            console.log("Respuesta del servidor:", result);
    
            if (!response.ok) {
                throw new Error(result.message || 'Error al enviar el token');
            }
    
            return result;
    
        } catch (error) {
            alert("Token incorrecto");
            return null;
        }
    },

    async validToken(data, path) {
        try {
            const response = await fetch(`${API_URL}${path}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log("Respuesta del servidor:", result);

            if (!response.ok) {
                throw new Error(result.message || 'Error al validar el token');
            }

            return result;

        }catch (error) {
            console.error("Error en sendToken:", error.message);
            return null;
        }
    },

    async passwordChange(data, path) {
        try {
            const response = await fetch(`${API_URL}${path}`,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log("Respuesta del servidor:", result);

            if (!response.ok) {
                throw new Error(result.message || 'Error al enviar la nueva contraseña');
            }

            return result;

        } catch (error) {
            console.error("Error en passwordChange:", error.message);
            return null;
        }
    },

    async logIn(data, path) {
        try {
            const response = await fetch(`${API_URL}${path}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
    
            const result = await response.json();
            console.log("Respuesta del servidor:", result);
    
            if (!response.ok) {
                return result; 
            }
    
            return result;
    
        } catch (error) {
            console.error("Error en logIn:", error.message);
            return { success: false, message: "Error de conexión con el servidor" };  
        }
    }
    
}