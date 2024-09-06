import { Response, NextFunction,Request } from 'express';
import studentService from '../services/studentService';
import { CustomError } from '../types/CustomError';
import {IStudent} from '../types/CommonTypes'

class StudentController {
  async home(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'No user found' });
        return;
      }

      const home = await studentService.home(req.user as IStudent);
      res.status(200).json(home);
    } catch (error) {
      const customError = error as CustomError;
      res.status(customError.status || 500).json({ message: customError.message });
    }
  }
  

  // Profile controllers-----
  async profile(req:Request,res:Response)
  {
    try {
         const id=req.params.id
        const ProfileData= await studentService.profile(id)
        res.status(200).json(ProfileData)
        
    } catch (error) {
        const customError=error as CustomError
        res.status(customError.status || 500).json({ error: customError.message });
    }
   

  }
  async updateProfile(req: Request, res: Response) {
    const { id } = req.params;
    const { body, file } = req;

    try {
      const result = await studentService.updateProfile(id, body, file?.path);
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: result,
      });
    } catch (error) {
      console.log("Error Right here",error)
      return res.status(500).json({
        success: false,
        message: 'An error occurred while updating the profile',
      });
      
    }
  }
  async updateProfilepic(req: Request, res: Response) {
    const { id } = req.params;
    const { file } = req;

    try {
      const result = await studentService.updateProfilePic(id,file?.path);
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: result,
      });
    } catch (error) {
      console.log("Error Right here",error)
      return res.status(500).json({
        success: false,
        message: 'An error occurred while updating the profile',
      });
      
    }
  }
}

export default new StudentController();
