import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
dotenv.config();
const app = express();
// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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