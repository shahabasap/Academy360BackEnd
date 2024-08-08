import { Request, Response } from 'express';
import mongoose, { trusted } from 'mongoose';
import { CustomError } from '../types/CustomError';
import teacherService from '../services/teacherService';
import AuthService from '../services/AuthService';
import OtpService from '../services/OtpService';
import AuthUtilities from "../utils/AuthUtilities";
import passport from 'passport';


class authController{
  // Admin Auth-------
  async AdminLogin(req: Request, res: Response) {
    try {
  
      const AdminData = await AuthService.AdminSignIn(req.body);
      if (AdminData && typeof AdminData == 'object') {
  
        AuthUtilities.CreateJwtToken(res,AdminData.secretKey as string,"JwtAdmin")
  
      }
      res.status(201).json(AdminData);
    } catch (error) {
      const customError=error as CustomError
      res.status(customError.status || 500).json({ error: customError.message });
    }
  }
    // Teacher side Auth------------------------------
    async TeacherLogin(req: Request, res: Response) {
      try {
    
        const TeacherData = await AuthService.TeacherSignIn(req.body);
        if (TeacherData && typeof TeacherData !== 'string') {
    
          AuthUtilities.CreateJwtToken(res,TeacherData._id as mongoose.Schema.Types.ObjectId,"JwtTeacher")
    
        }
    
    
        res.status(201).json(TeacherData);
      } catch (error) {
        const customError=error as CustomError
        res.status(customError.status || 500).json({ error: customError.message });
      }
    }
    

  async TeacherSignUp(req:Request,res:Response)
  {
    try {
      
        const NewTeacher= await AuthService.TeacherSignUp(req.body)
        res.status(200).json(NewTeacher)
        
    } catch (error) {
        const customError=error as CustomError
        res.status(customError.status || 500).json({ error: customError.message });
    }
   

  }
  async TeacherOtp(req: Request, res: Response) {
    try {
  
        const { email } = req.body;
        await OtpService.TeacherSendOtp(email);
        res.status(200).send('OTP sent successfully');
    } catch (error) {
      const customError=error as CustomError
      res.status(customError.status || 500).json({ error: customError.message });
    }
  }
  async TeacherVerifyOtp(req: Request, res: Response) {
    try {
        const { email, otp } = req.body;
        const TeacherData= await OtpService.TeacherVerifyOtp(email, otp);
        if (TeacherData && typeof TeacherData !== 'string') {
    
          AuthUtilities.CreateJwtToken(res,TeacherData._id as mongoose.Schema.Types.ObjectId,"JwtTeacher")
    
        }
        res.status(200).json(TeacherData);
    } catch (error) {
      const customError=error as CustomError
      res.status(customError.status || 500).json({ error: customError.message });
    }
  }
//   student side auth--------------------------

async login(req: Request, res: Response) {
  try {
    console.log("data",req.body)
    const StudentData = await AuthService.SignIn(req.body);
    if (StudentData && typeof StudentData !== 'string') {

      AuthUtilities.CreateJwtToken(res,StudentData._id as mongoose.Schema.Types.ObjectId,"JwtStudent")

    }
    res.status(201).json(StudentData);
  } catch (error) {
    const customError=error as CustomError
    res.status(customError.status || 500).json({ error: customError.message });
  }
}
  
  async SignUp(req: Request, res: Response) {
    try {

      const Newstudent = await AuthService.SignUp(req.body);
      res.status(201).json(Newstudent);
    } catch (error) {
      const customError=error as CustomError
      res.status(customError.status || 500).json({ error: customError.message });
    }
  }

  async Otp(req: Request, res: Response) {
    try {
        const { email } = req.body;
        await OtpService.sendOtp(email);
        res.status(200).send('OTP sent successfully');
    } catch (error) {
      const customError=error as CustomError
      res.status(customError.status || 500).json({ error: customError.message });
    }
  }
  async VerifyOtp(req: Request, res: Response) {
    try {
        const { email, otp } = req.body;
        const StudentData=await OtpService.verifyOtp(email, otp);
        if (StudentData && typeof StudentData !== 'string') {

          AuthUtilities.CreateJwtToken(res,StudentData._id as mongoose.Schema.Types.ObjectId,"JwtStudent")
    
        }
        res.status(200).json(StudentData);
    } catch (error) {
      const customError=error as CustomError
      res.status(customError.status || 500).json({ error: customError.message });
    }
  }
  async googleAuth(req: Request, res: Response) {
    
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
}

async googleAuthCallback(req: Request, res: Response) {
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login'
    })(req, res);
}

async logout(req: Request, res: Response) {
    req.logout(() => {
        res.redirect('/');
    });
}
  
}



export default new authController();
