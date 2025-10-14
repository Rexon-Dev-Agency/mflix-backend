import express from 'express';
import type { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { authRouter } from './routes/authRoutes.js';
import { errorHandler } from './handlers/errorHandlers.js';
import { notFoundHandler } from './handlers/notFoundHandler.js';

dotenv.config();

const app: Application = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(notFoundHandler);
app.use(errorHandler);
app.use('/api/auth', authRouter);

// Sample route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the MFlix Backend!');
}); 

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Something went wrong",
    },
  });
});

export default app;