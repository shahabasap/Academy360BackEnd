import { Request, Response } from 'express';
import { CustomError,CustomErrorClass } from '../types/CustomError';
import adminServices from '../services/adminServices';
import Admin from '../models/admin';
import AuthUtilities from "../utils/AuthUtilities";



class adminController{
  async createAdmin(req:Request,res:Response)
  {
    try {
      let username=process.env.AdminMail
      let password=process.env.Password
      let hashedPassword=await AuthUtilities.getHashedPassword(password as string)
       const IsCreated=await Admin.findOne({username:username as string})
      if(!IsCreated)
      {
          const admin= await Admin.create({username:username,password:hashedPassword})
          res.status(200).json(admin)
        }

       
      throw new CustomErrorClass("Admin is already exists",409)
        
    } catch (error) {
        const customError=error as CustomError
        res.status(customError.status || 500).json({ error: customError.message });
    }
   

  }
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
