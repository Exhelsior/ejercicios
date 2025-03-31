const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('../server/routes/authRoutes.js') // Importa las rutas
const { testConnection } = require('../server/database/data_base.js');

const app = express();

// Middleware para usar CORS
app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para procesar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Probar la conexión con la base de datos
testConnection();

// Usar las rutas
app.use(authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
    if (error) {
        console.error('Error al iniciar el servidor:', error);
        return;
    }
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
