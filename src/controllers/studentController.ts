import { Response, NextFunction,Request } from 'express';
import studentService from '../services/studentService';
import { CustomError } from '../types/CustomError';
import { IStudent } from '../models/Student';

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

  // Other controller methods...
}

export default new StudentController();
