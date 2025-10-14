import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { authRouter } from './routes/authRoutes.js';
import { errorHandler } from './handlers/errorHandlers.js';
import { notFoundHandler } from './handlers/notFoundHandler.js';
dotenv.config();
const app = express();
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
app.get('/', (req, res) => {
    res.send('Welcome to the MFlix Backend!');
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || "Something went wrong",
        },
    });
});
export default app;
//# sourceMappingURL=app.js.map