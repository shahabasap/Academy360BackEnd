
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import connectDB from './config/database';
import classroomRoutes from './routes/classroomRoutes';
import studentRoutes from './routes/studentRoutes';
import teacherRoutes from './routes/teacherRoutes';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRountes';
import './config/googleAuth'; // Ensure this is imported to initialize passport

const app = express();

connectDB();

app.use(session({
    secret: process.env.Session_Secret as string,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use('/auth',authRoutes)
// Student rountes-------------------
app.use('/', studentRoutes);   
// Teacher rountes----------------------------
app.use('/teacher',teacherRoutes );   
//Admin routes---------------------------------
app.use('/admin',adminRoutes);   




export default app;
