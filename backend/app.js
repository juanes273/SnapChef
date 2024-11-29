const express = require('express');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const iaRoutes = require('./routes/iaRoutes')
const cors = require("cors");
const errorMiddleware = require('./middleware/errorMiddleware');
const { port } = require('./config/config');

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
}));


// Middleware
app.use(express.json());

// Rutas
app.use('/api', userRoutes); // Esta línea
app.use('/api', noteRoutes); // Esta línea para las notas
app.use('/api', iaRoutes) // Esta linea para la IA

// Error Handling Middleware
app.use(errorMiddleware);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
