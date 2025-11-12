import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import logger from './config/logger';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

class App {
  public app: Application;
  public server: any;
  public io: Server;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: env.FRONTEND_URL,
        methods: ['GET', 'POST'],
      },
    });

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeWebSocket();
  }

  private initializeMiddlewares() {
    // Security
    this.app.use(helmet());

    // CORS
    this.app.use(
      cors({
        origin: env.FRONTEND_URL,
        credentials: true,
      })
    );

    // Compression
    this.app.use(compression());

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging
    if (env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined', {
        stream: { write: (message) => logger.info(message.trim()) }
      }));
    }

    // Rate limiting
    const limiter = rateLimit({
      windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS),
      max: parseInt(env.RATE_LIMIT_MAX_REQUESTS),
      message: {
        success: false,
        message: 'Trop de requêtes, veuillez réessayer plus tard',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api', limiter);

    // Static files
    this.app.use('/uploads', express.static(env.UPLOAD_DIR));
  }

  private initializeRoutes() {
    // API routes
    this.app.use('/api/v1', routes);

    // Root route
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Welcome to GlobalChek API',
        version: '2.0.0',
        documentation: '/api/v1/docs',
      });
    });
  }

  private initializeErrorHandling() {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  private initializeWebSocket() {
    this.io.on('connection', (socket) => {
      logger.info(`WebSocket client connected: ${socket.id}`);

      socket.on('join-room', (userId: string) => {
        socket.join(`user:${userId}`);
        logger.info(`User ${userId} joined their room`);
      });

      socket.on('disconnect', () => {
        logger.info(`WebSocket client disconnected: ${socket.id}`);
      });
    });

    // Make io accessible to other parts of the app
    this.app.set('io', this.io);
  }

  public async start() {
    try {
      // Connect to database
      await connectDatabase();

      // Create required directories
      const fs = require('fs');
      const path = require('path');

      const dirs = ['uploads', 'logs'];
      dirs.forEach(dir => {
        const dirPath = path.join(process.cwd(), dir);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
      });

      // Start server
      const PORT = parseInt(env.PORT);
      this.server.listen(PORT, () => {
        logger.info(`
╔════════════════════════════════════════════════╗
║                                                ║
║           🚀 GlobalChek API Server            ║
║                                                ║
║  Status: Running                               ║
║  Port: ${PORT}                                    ║
║  Environment: ${env.NODE_ENV}                   ║
║  URL: http://localhost:${PORT}                   ║
║                                                ║
╚════════════════════════════════════════════════╝
        `);
      });

      // Graceful shutdown
      process.on('SIGTERM', this.shutdown.bind(this));
      process.on('SIGINT', this.shutdown.bind(this));

    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private async shutdown() {
    logger.info('Shutting down gracefully...');

    this.server.close(() => {
      logger.info('HTTP server closed');
    });

    await disconnectDatabase();
    process.exit(0);
  }
}

// Start the application
const app = new App();
app.start();

export default app;
