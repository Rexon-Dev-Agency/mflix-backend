import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
// Do NOT import firebase or dotenv here. Only import routers and handlers.
import { authRouter } from './routes/authRoutes.js';
import { userRouter } from './routes/userRoutes.js';
import { errorHandler } from './handlers/errorHandlers.js';
import { notFoundHandler } from './handlers/notFoundHandler.js';
const app = express();
// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
// Handler Routes
app.use(notFoundHandler);
app.use(errorHandler);
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