  import express from 'express';
  import cors from 'cors';
  import helmet from 'helmet';
  import compression from 'compression';
  import morgan from 'morgan';
  import cookieParser from 'cookie-parser';
  import rateLimit from 'express-rate-limit';
  import dotenv from 'dotenv';
  import path from 'path';
  import { fileURLToPath } from 'url';

  // Import routes
  import authRoutes from './routes/auth.js';
  import userRoutes from './routes/users.js';
  import creditRoutes from './routes/credits.js';
  import marketplaceRoutes from './routes/marketplace.js';
  import auditRoutes from './routes/audit.js';
  import transactionRoutes from './routes/transactions.js';

  // Import middleware
  import { errorHandler } from './middleware/errorHandler.js';
  import { notFound } from './middleware/notFound.js';
  import { auditLogger } from './middleware/userMiddleware.js';

  // Import database connection
  import { connectDB } from './config/database.js';
  import mongoose from 'mongoose';

  // Load environment variables
  dotenv.config();

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const app = express();
  const PORT = process.env.PORT || 4000;

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));

  // CORS configuration
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://yourdomain.com'] 
      : ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }));

  // Rate limiting - More lenient for development
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || (process.env.NODE_ENV === 'development' ? 1000 : 100), // More lenient in development
    message: {
      error: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for health checks and auth endpoints in development
      if (process.env.NODE_ENV === 'development') {
        return req.path === '/api/health' || 
               req.path === '/api/debug' || 
               req.path === '/api/test' ||
               req.path.startsWith('/api/auth/');
      }
      return false;
    }
  });

  app.use('/api/', limiter);

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Cookie parser
  const cookieSecret = process.env.COOKIE_SECRET || 'fallback-cookie-secret';
  if (cookieSecret === 'your-cookie-secret-key-here-change-this-in-production') {
    console.warn('⚠️  COOKIE_SECRET not properly configured, using fallback');
  }
  app.use(cookieParser(cookieSecret));

  // Compression middleware
  app.use(compression());

  // Logging middleware
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  // Static files (for production build)
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
  }

  // Apply audit logging middleware to all routes (temporarily disabled)
  // app.use(auditLogger);

  app.get('/api', (req, res) => {
    res.status(200).json({
      message: 'API is running. Available routes: /auth, /users, /credits, /marketplace, /audit, /transactions'
    });
  });

  // Test endpoint to check if server is working
  app.get('/api/test', (req, res) => {
    res.status(200).json({
      message: 'Test endpoint working',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  });

  // Simple test endpoint for debugging
  app.get('/api/debug', (req, res) => {
    res.status(200).json({
      message: 'Debug endpoint working',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
      jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not set',
      cookieSecret: process.env.COOKIE_SECRET ? 'Set' : 'Not set'
    });
  });


  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/credits', creditRoutes);
  app.use('/api/marketplace', marketplaceRoutes);
  app.use('/api/audit', auditRoutes);
  app.use('/api/transactions', transactionRoutes);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
      database: dbStatus,
      databaseHost: mongoose.connection.host || 'Not connected',
    });
  });

  // Serve frontend for all other routes (SPA)
  if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
    });
  }

  // Error handling middleware
  app.use(notFound);
  app.use(errorHandler);

  // Start server function
  const startServer = async () => {
    try {
      // Try to connect to database
      try {
        await connectDB();
      } catch (dbError) {
        console.log('⚠️  Database connection failed, but server will continue...');
      }
      
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
        console.log(`🔗 API URL: http://localhost:${PORT}/api`);
        console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`📱 Frontend: http://localhost:3000`);
        }
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  };

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', err);
    process.exit(1);
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
  });

  startServer();
