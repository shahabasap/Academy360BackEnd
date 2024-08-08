import { Request, Response } from 'express';
import { trusted } from 'mongoose';
import { CustomError } from '../types/CustomError';
import teacherService from '../services/teacherService';
import {CustomRequest} from '../types/CustomRequest'
import {ITeacher} from '../models/Teacher'


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
}


export default new teacherController();
