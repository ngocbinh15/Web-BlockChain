/**
 * ╔═══════════════════════════════════════════════════════════╗
 * ║   Blockchain Rice Supply Chain Management System          ║
 * ║   Backend API Server                                       ║
 * ║   Author: NNB (Nguyen Ngoc Binh)                         ║
 * ║   Copyright © 2025 NNB. All Rights Reserved.             ║
 * ║   GitHub: https://github.com/ngocbinh15                   ║
 * ╚═══════════════════════════════════════════════════════════╝
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const batchRoutes = require('./routes/batches');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/batches', batchRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Blockchain Rice Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`💚 Health: http://localhost:${PORT}/api/health`);
});

module.exports = app;
