import { Request, Response } from 'express';
import classroomService from '../services/ClassroomService';
import mongoose, { trusted } from 'mongoose';
import { CustomError, CustomErrorClass } from '../types/CustomError';
import ClassroomService from '../services/ClassroomService';
import {IStudent, ITeacher} from '../types/CommonTypes'

class ClassroomController {
  // Teacher------------------------------
  // creating classroom---------------------------

  async classroom(req:Request,res:Response)
  {
    try {

        const classroomData= await ClassroomService.classroom(req.body)
        res.status(200).json(classroomData)
        ClassroomService
        
    } catch (error) {
        const customError=error as CustomError
        res.status(customError.status || 500).json({ error: customError.message });
    }
   

  }
// addStudent into classrom-------------------------

  async AddStudent(req:Request,res:Response)
  {
    try {
       const {classroomid,studentid}=req.query
       if (!classroomid || !studentid) {
        throw new CustomErrorClass('Classroom ID and Student ID are required', 400);
      }
      const studentObjectId = new mongoose.Types.ObjectId(studentid as string);
      const classObjectId = new mongoose.Types.ObjectId(classroomid as string);

        const classroomData= await ClassroomService.addStudent(classObjectId ,studentObjectId ) 
        res.status(200).json(classroomData) 
        ClassroomService
        
    } catch (error) {
        const customError=error as CustomError
        res.status(customError.status || 500).json({ error: customError.message });
    }
   

  }
//  Stundete controller ----------------------

async joinClassroom(req:Request,res:Response)

  {
    try {

        const classroom= await ClassroomService.joinClassroom(req.body)
        res.status(200).json(classroom)
        ClassroomService
        
    } catch (error) {
        const customError=error as CustomError
        res.status(customError.status || 500).json({ error: customError.message });
    }
   

  }
}


export default new ClassroomController();
