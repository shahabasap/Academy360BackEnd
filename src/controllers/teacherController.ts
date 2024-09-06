import { Request, Response } from 'express';
import { trusted } from 'mongoose';
import { CustomError,CustomErrorClass } from '../types/CustomError';
import teacherService from '../services/teacherService';
import {CustomRequest} from '../types/CustomRequest'
import {ITeacher,FileUpload} from '../types/CommonTypes'
import path from 'path';
import multer from 'multer'; // Assuming you're using multer for file uploads


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
  async profilePic(req:Request,res:Response)
  {
    try {
         const id=req.params.id
         const {file}=req
         if (!file) {
            throw new CustomErrorClass("Profile phot not found",400)
         }
        const ProfileData= await teacherService.updateProfilePic(id,file?.path)
        res.status(200).json(ProfileData)
        
    } catch (error) {
        const customError=error as CustomError
        res.status(customError.status || 500).json({ error: customError.message });
    }
   

  }
  


  async updateProfile(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;
  
    try {
      // Validate 'id'
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
        return;
      }
  
      // Handle file uploads
      const files = req.files as FileUpload;
      
      // Safely retrieve file paths or default to null
      const photo: string | null = files?.photo?.[0]?.path || null;
      const ugCertificate: string  = files?.ugCertificate?.[0]?.path || '';
      const pgCertificate: string  = files?.pgCertificate?.[0]?.path || '';
  
      
  
      // Pass file paths and other data to the service layer
      await teacherService.updateProfile(id, data, photo, ugCertificate,pgCertificate);
  
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error during profile update:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while updating the profile',
      });
    }
  }


}


export default new teacherController();
