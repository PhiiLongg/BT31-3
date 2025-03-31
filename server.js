const express = require('express');
const connectDB = require('./config/db');
const menuRoutes = require('./routes/menu');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use('/api/menu', menuRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});