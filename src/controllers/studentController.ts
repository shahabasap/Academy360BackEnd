import { Response, NextFunction, Request } from 'express';
import studentService from '../services/studentService';
import { CustomError } from '../types/CustomError';
import { IStudent } from '../types/CommonTypes';

class StudentController {
  async home(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'No user found' });
        return;
      }

      const home = await studentService.home(req.user as IStudent);
      res.status(200).json(home);
    } catch (error) {
      next(error); // Pass the error to the error-handling middleware
    }
  }

  // Profile controllers-----
  async profile(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const profileData = await studentService.profile(id);
      res.status(200).json(profileData);
    } catch (error) {
      next(error); // Pass the error to the error-handling middleware
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
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
      console.log("Error Right here", error);
      next(error); // Pass the error to the error-handling middleware
    }
  }

  async updateProfilepic(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { file } = req;

    try {
      const result = await studentService.updateProfilePic(id, file?.path);
      return res.status(200).json({
        success: true,
        message: 'Profile picture updated successfully',
        data: result,
      });
    } catch (error) {
      console.log("Error Right here", error);
      next(error); // Pass the error to the error-handling middleware
    }
  }
}

export default new StudentController();
