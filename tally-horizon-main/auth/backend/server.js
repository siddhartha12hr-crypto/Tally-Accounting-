/**
 * ============================================
 * TALLY AUTHENTICATION SERVER
 * Production-Ready Express Server
 * ============================================
 */

require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const xss = require('xss-clean');
const path = require('path');

// Import configurations
const { testDatabaseConnection } = require('./config/database');
const passport = require('./config/passport');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/authRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { globalRateLimiter } = require('./middleware/rateLimiter');

// Initialize Express app
const app = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Set security HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Enable CORS with credentials
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Data sanitization against XSS
app.use(xss());

// ============================================
// GENERAL MIDDLEWARE
// ============================================

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET));

// HTTP request logger (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Initialize Passport
app.use(passport.initialize());

// Apply rate limiting to all routes
app.use(globalRateLimiter);

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    otpEnabled: process.env.OTP_ENABLED === 'true',
    googleAuthEnabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  });
});

// API routes
app.use('/api/auth', authRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, process.env.FRONTEND_BUILD_PATH || '../frontend/dist');
  app.use(express.static(frontendPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// ============================================
// ERROR HANDLING
// ============================================

app.use(errorHandler);

// ============================================
// SERVER STARTUP
// ============================================

const PORT = process.env.PORT || 5000;

// Create HTTP server
const http = require('http');
const server = http.createServer(app);

// Initialize Socket.IO
const { initializeSocket } = require('./services/socketService');
initializeSocket(server);

// Test database connection before starting server
testDatabaseConnection()
  .then(() => {
    server.listen(PORT, () => {
      logger.info(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║    🔐 TALLY AUTHENTICATION SERVER                         ║
║                                                           ║
║    Environment: ${process.env.NODE_ENV?.toUpperCase().padEnd(42)}║
║    Port: ${PORT.toString().padEnd(50)}║
║    OTP Enabled: ${(process.env.OTP_ENABLED === 'true' ? 'Yes' : 'No').padEnd(44)}║
║    Google Auth: ${(process.env.GOOGLE_CLIENT_ID ? 'Yes' : 'No').padEnd(44)}║
║    WebSockets: Enabled                                    ║
║                                                           ║
║    Server running at: http://localhost:${PORT}             ║
║    Socket.IO ready for real-time updates                 ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
      
      if (process.env.OTP_ENABLED === 'true' && !process.env.EMAIL_SERVICE_KEY) {
        logger.warn('⚠️  OTP is enabled but EMAIL_SERVICE_KEY is not configured. OTP will be skipped gracefully.');
      }
      
      if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        logger.warn('⚠️  Google OAuth credentials not configured. Google authentication will be disabled.');
      }
    });
  })
  .catch((error) => {
    logger.error('Failed to start server:', error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('👋 SIGINT RECEIVED. Shutting down gracefully...');
  process.exit(0);
});

module.exports = app;
