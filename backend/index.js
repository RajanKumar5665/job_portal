import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoutes from "./routes/user.route.js";
import companyRoutes from "./routes/compnay.route.js";
import jobRoutes from "./routes/job.route.js";
import applicationRoutes from "./routes/application.route.js";
import path from "path";
import rateLimit from "express-rate-limit";

dotenv.config({});

const app = express();

const __dirname = path.resolve();

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter rate limit for authentication routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login/register attempts per windowMs
    message: "Too many authentication attempts, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: [
        process.env.FRONTEND_URL || 'https://job-portal-4haa.onrender.com',
    ],
    credentials: true
};
app.use(cors(corsOptions));

// Apply general rate limiter to all routes
app.use('/api/', limiter);

// app.get('/', (req, res) => {
//     return res.status(200).json({
//         message: "API is working"
//     });
// });

//api routes
app.use('/api/v1/user', authLimiter, userRoutes); // Apply auth limiter to user routes
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/job', jobRoutes);
app.use('/api/v1/application', applicationRoutes);

app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

app.get("*",(_, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 4000;    

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});

    
