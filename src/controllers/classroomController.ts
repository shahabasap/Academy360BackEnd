import { Request, Response } from 'express';
import classroomService from '../services/ClassroomService';
import { trusted } from 'mongoose';
import { CustomError } from '../types/CustomError';

class ClassroomController {
  async createClassroom(req: Request, res: Response) {
    try {
        console.log("controller",req.body)
      const classroom = await classroomService.createClassroom(req.body);
      res.status(201).json(classroom);
    } catch (error) {
      const customError=error as CustomError
        res.status(customError.status || 500).json({ error: customError.message });
    }
  }

  // Other controller methods...
}


export default new ClassroomController();
