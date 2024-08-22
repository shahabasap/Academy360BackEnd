import { Request, Response } from 'express';
import { trusted } from 'mongoose';
import { CustomError } from '../types/CustomError';
import teacherService from '../services/teacherService';
import {CustomRequest} from '../types/CustomRequest'
import {ITeacher} from '../types/CommonTypes'


class teacherController{
 
  async home(req:Request,res:Response)
  {
    try {
        const HomeData= await teacherService.home(req.user as ITeacher)
        res.status(200).json(HomeData)
        
    } catch (error) {
        const customError=error as CustomError
        res.status(customError.status || 500).json({ error: customError.message });
    }
   

  }
  async profile(req:Request,res:Response)
  {
    try {
         const id=req.params.id
        const ProfileData= await teacherService.profile(id)
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
      const result = await teacherService.updateProfile(id, body, file?.path);
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


export default new teacherController();
