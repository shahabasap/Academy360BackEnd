import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import connectDB from './config/database';
import studentRoutes from './routes/studentRoutes';
import teacherRoutes from './routes/teacherRoutes';
import authRoutes from './routes/authRoutes';
import morgan from 'morgan';
import adminRoutes from './routes/adminRountes';
import cors from 'cors';

const app = express();

connectDB();

const corsOptions = {
    origin: 'http://localhost:5173', // Your frontend's address
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'PUT', 'PATCH', 'POST'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};

app.use(cors(corsOptions));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(session({
    secret: process.env.Session_Secret as string,
    resave: false,
    saveUninitialized: false
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));


app.use('/auth', authRoutes);

// Student routes-------------------
app.use('/', studentRoutes);
// Teacher routes-------------------
app.use('/teacher', teacherRoutes);
// Admin routes---------------------
app.use('/admin', adminRoutes);

export default app;
