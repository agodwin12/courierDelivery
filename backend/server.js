const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import models
const { sequelize, syncDatabase } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make sequelize available in routes
app.locals.sequelize = sequelize;

// Initialize Database
const initializeDatabase = async () => {
    try {
        // Sync models (don't use force: true in production!)
        await syncDatabase({ alter: false });
        console.log('✅ Database initialized successfully!');
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        process.exit(1);
    }
};

// Health Check Route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'MovingCargo API is running',
        timestamp: new Date().toISOString()
    });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const deliveryRoutes = require('./routes/Deliveryroutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/deliveries', deliveryRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start Server
const startServer = async () => {
    try {
        await initializeDatabase();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 API endpoint: http://localhost:${PORT}/api`);
            console.log(`🗄️  Database: ${process.env.DB_NAME || 'MovingCargo_db'}`);
            console.log('\n📍 Available Routes:');
            console.log('   AUTH: /api/auth/*');
            console.log('   DELIVERIES: /api/deliveries/*');
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();

module.exports = app;