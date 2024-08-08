import { Request, Response } from 'express';
import { CustomError } from '../types/CustomError';
import adminServices from '../services/adminServices';



class adminController{
  async FetchStudentsDetails(req:Request,res:Response)
  {
    try {
        const StudentsData= await adminServices.Students()
        res.status(200).json(StudentsData)
        
    } catch (error) {
        const customError=error as CustomError
        res.status(customError.status || 500).json({ error: customError.message });
    }
   

  }
  async FetchTeachersDetails(req:Request,res:Response)
  {
    try {
        const TeacherData= await adminServices.Teachers()
        res.status(200).json(TeacherData)
        
    } catch (error) {
        const customError=error as CustomError
        res.status(customError.status || 500).json({ error: customError.message });
    }
   

  }
}


export default new adminController();
