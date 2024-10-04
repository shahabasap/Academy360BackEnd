import { Request, Response, NextFunction } from 'express';
import { CustomError, CustomErrorClass } from '../types/CustomError';
import teacherService from '../services/teacherService';
import { CustomRequest } from '../types/CustomRequest';
import { ITeacher, FileUpload } from '../types/CommonTypes';

class TeacherController {
  async home(req: Request, res: Response, next: NextFunction) {
    try {
      const homeData = await teacherService.home(req.user as ITeacher);
      res.status(200).json(homeData);
    } catch (error) {
      next(error); // Pass the error to the error-handling middleware
    }
  }

  async profile(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const profileData = await teacherService.profile(id);
      res.status(200).json(profileData);
    } catch (error) {
      next(error); // Pass the error to the error-handling middleware
    }
  }

  async profilePic(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const { file } = req;

      if (!file) {
        throw new CustomErrorClass("Profile photo not found", 400);
      }

      const profileData = await teacherService.updateProfilePic(id, file?.path);
      res.status(200).json(profileData);
    } catch (error) {
      next(error); // Pass the error to the error-handling middleware
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const data = req.body;

    try {
      // Validate 'id'
      if (!id) {
        throw new CustomErrorClass('User ID is required', 400);
      }

      // Handle file uploads
      const files = req.files as FileUpload;

      // Safely retrieve file paths or default to null
      const photo: string | null = files?.photo?.[0]?.path || null;
      const ugCertificate: string = files?.ugCertificate?.[0]?.path || '';
      const pgCertificate: string = files?.pgCertificate?.[0]?.path || '';

      // Pass file paths and other data to the service layer
      await teacherService.updateProfile(id, data, photo, ugCertificate, pgCertificate);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error during profile update:', error);
      next(error); // Pass the error to the error-handling middleware
    }
  }
}

export default new TeacherController();
