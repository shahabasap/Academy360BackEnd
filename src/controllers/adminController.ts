import { Request, Response,NextFunction } from 'express';
import { CustomError,CustomErrorClass } from '../types/CustomError';
import adminServices from '../services/adminServices';
import Admin from '../models/admin';
import AuthUtilities from "../utils/AuthUtilities";



class adminController{

  async createAdmin(req:Request,res:Response,next: NextFunction)
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
       next(error)
        
    }
   

  }
  // Classroom Controllers----------
  async fetchClassrooms(req: Request, res: Response,next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const students = await adminServices.fetchClassrooms(page, pageSize);
      return res.status(200).json(students);
    } catch (error) {
      next(error)
    }
  }
  async classroomBlock(req:Request,res:Response,next: NextFunction)
  {
    try {
        const StudentsData= await adminServices.classroomBlock(req.params.id)
        res.status(200).json(StudentsData)
        
    } catch (error) {
      next(error)
    }
   

  }
  async classroomUnblock(req:Request,res:Response,next: NextFunction)
  {
    try {
        const StudentsData= await adminServices.classroomUnblock(req.params.id)
        res.status(200).json(StudentsData)
        
    } catch (error) {
      next(error)
    }
   

  }
   

  // Student controllers--------------------------
  async getStudents(req: Request, res: Response,next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const students = await adminServices.getVerifiedStudents(page, pageSize);
      return res.status(200).json(students);
    } catch (error) {
      next(error)
    }
  }
   

  
  async StudentBlock(req:Request,res:Response,next: NextFunction)
  {
    try {
        const StudentsData= await adminServices.block(req.params.id)
        res.status(200).json(StudentsData)
        
    } catch (error) {
      next(error)
    }
   

  }
  async StudentUnblock(req:Request,res:Response,next: NextFunction)
  {
    try {
        const StudentsData= await adminServices.unblock(req.params.id)
        res.status(200).json(StudentsData)
        
    } catch (error) {
      next(error)
    }
   

  }
  // Teacher Controllers-------------------------

  async FetchTeachersDetails(req:Request,res:Response,next: NextFunction)
  {
    try {
       const page= parseInt(req.query.page as string) || 1;
       const pageSize=parseInt(req.query.limit as string) || 10;
        const TeacherData= await adminServices.getVerifiedTeachers(page,pageSize)
        res.status(200).json(TeacherData)
        
    } catch (error) {
      next(error)
    }
   

  }

async TeacherBlock(req:Request,res:Response,next: NextFunction)
{
  try {
      const StudentsData= await adminServices.teacherBlock(req.params.id)
      res.status(200).json(StudentsData)
      
  } catch (error) {
    next(error)
  }
 

}

async TeacherUnblock(req:Request,res:Response,next: NextFunction)
{
  try {
      const StudentsData= await adminServices.teacherUnblock(req.params.id)
      res.status(200).json(StudentsData)
      
  } catch (error) {
    next(error)
  }
 

}
async rejectTeacher(req:Request,res:Response,next: NextFunction)
{
  try {
       const {id}=req.params
       const {rejectionReason}=req.body
      const teacher= await adminServices.rejectTeacher(id,rejectionReason)
      res.status(200).json(teacher)
      
  } catch (error) {
    next(error)
  }
 

}
async approveTeacher(req:Request,res:Response,next: NextFunction)
{
  try {
    const {id}=req.params
      const teacher= await adminServices.approveTeacher(id)
      res.status(200).json(teacher)
      
  } catch (error) {
    next(error)
  }
 

}
async dashboardData(req:Request,res:Response,next: NextFunction)
{
  try {
      const Dashboard= await adminServices.dashboardData()
      res.status(200).json(Dashboard)
      
  } catch (error) {
    next(error)
  }
 

}
}

export default new adminController();
