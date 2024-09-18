import { Request, Response } from 'express';
import ClassroomService from '../services/ClassroomService';
import mongoose from 'mongoose';
import { CustomError, CustomErrorClass } from '../types/CustomError';
import AuthUtilities from '../utils/AuthUtilities';

class ClassroomController {
  // Create a new classroom
  async createClassroom(req: Request, res: Response) {
    try {
 
      const classroomData = await ClassroomService.createClassroom(req.body.data);
      res.status(200).json(classroomData);
    } catch (error) {
      const customError = error as CustomError;
      res.status(customError.status || 500).json({ error: customError.message });
    }
  }
  async isLocked(req: Request, res: Response) {
    try {
      const classroomId = req.query.classroomId;
  const studentId = req.query.studentId;

  // Ensure you are checking for these query parameters
  if (!classroomId || !studentId) {
    return res.status(400).send('Missing classroomId or studentId');
  }
      const classroomData = await ClassroomService.isLocked(classroomId as string,studentId as string);
      res.status(200).json(classroomData);
    } catch (error) {
      const customError = error as CustomError;
      res.status(customError.status || 500).json({ error: customError.message });
    }
  }

  // Fetch classrooms for a specific teacher
  async fetchTeacherClassrooms(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new CustomErrorClass('Teacher ID is required', 400);
      }
      const classroomData = await ClassroomService.fetchTeacherClassrooms(id);
      res.status(200).json(classroomData);
    } catch (error) {
      const customError = error as CustomError;
      res.status(customError.status || 500).json({ error: customError.message });
    }
  }
  // Fetch classrooms for a specific teacher
  async ClasroomLogout(req: Request, res: Response) {
    try {
      res.cookie('refresh-token-teacher-class','',{
        httpOnly:true,
        expires:new Date(0)
       })
       res.cookie('access-token-teacher-class','',{
        httpOnly:true,
        expires:new Date(0)
       })
       res.status(200).json({message:"admin Loged out"})
    } catch (error) {
      const customError = error as CustomError;
      res.status(customError.status || 500).json({ error: customError.message });
    }
  }
  // Fetch classrooms for a specific student
  async fetchStudentsClassrooms(req: Request, res: Response) {
    try {
      const { id } = req.params;
 
      if (!id) {
        throw new CustomErrorClass('Student ID is required', 400);
      }
    
      const classroomData = await ClassroomService.fetchStudentClassrooms(id);
      res.status(200).json(classroomData);
    } catch (error) {
      const customError = error as CustomError;
      res.status(customError.status || 500).json({ error: customError.message });
    }
  }
  // Fetch classroom using id
  async fetchClassroom(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new CustomErrorClass('Student ID is required', 400);
      }
      const classroomData = await ClassroomService.fetchClassroom(id);
      res.status(200).json(classroomData);
    } catch (error) {
      const customError = error as CustomError;
      res.status(customError.status || 500).json({ error: customError.message });
    }
  }

  // Add a student to a classroom
  async addStudent(req: Request, res: Response) {
    try {
      const { classroomid, studentid } = req.query;
      if (!classroomid || !studentid) {
        throw new CustomErrorClass('Classroom ID and Student ID are required', 400);
      }
      const studentObjectId = new mongoose.Types.ObjectId(studentid as string);
      const classObjectId = new mongoose.Types.ObjectId(classroomid as string);
      const classroomData = await ClassroomService.addStudent(classObjectId, studentObjectId);
      res.status(200).json(classroomData);
    } catch (error) {
      const customError = error as CustomError;
      res.status(customError.status || 500).json({ error: customError.message });
    }
  }

  // Teacher joins a classroom
  async teacherJoinToClassroom(req: Request, res: Response) {
    try {
      const classroomData = await ClassroomService.teacherJoin(req.body);
      const role=process.env.Teacher_Role+"-class"
      const{accessToken, refreshToken }=await AuthUtilities.CreateJwtToken(classroomData._id as string,role as string)
      res.cookie(`access-token-${role}`, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000  // expires in 15 minutes
        
      })
  
      res.cookie(`refresh-token-${role}`, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000  // expires in 30days
        
      })
  
      res.status(200).json(classroomData);
    } catch (error) {
      const customError = error as CustomError;
      res.status(customError.status || 500).json({ error: customError.message });
    }
  }
  async searchStudents(req: Request, res: Response) {
    try {
    
      const { username, classroomid, page = 1, limit = 10 } = req.body; 
      const classroomData = await ClassroomService.searchStudents({ username, classroomid }, page, limit);

      res.status(200).json(classroomData);
    } catch (error) {
      const customError = error as CustomError;
      res.status(customError.status || 500).json({ error: customError.message });
    }
  }
  async classroomData
  (req: Request, res: Response) {
    try {
     
      const {id}=req.params
      const classroomData = await ClassroomService.fetchClassroom(id);
      res.status(200).json(classroomData);
    } catch (error) {
      const customError = error as CustomError;
      res.status(customError.status || 500).json({ error: customError.message });
    }
  }
  

  // Add classrooms into students bucket list
  async addClassroom(req: Request, res: Response) {
    try {
      const { classroomid,studentid } = req.body;
    
      if (!classroomid) {
        throw new CustomErrorClass('Classroom ID is required', 400);
      }
      const classroomData = await ClassroomService.addClassroom({ classroomid,studentid });
      res.status(200).json(classroomData);
    } catch (error) {
      const customError = error as CustomError;
      res.status(customError.status || 500).json({ error: customError.message });
    }
  }
  async studentJoinToClassroom(req: Request, res: Response) {
    try {
      const { classroomid,studentid } = req.body;
      const role=process.env.Student_Role+"-class"
      if (!classroomid) {
        throw new CustomErrorClass('Classroom ID is required', 400);
      }
      const classroomData = await ClassroomService.studentJoinToClassroom({ classroomid,studentid });
      const{accessToken, refreshToken }=await AuthUtilities.CreateJwtToken(classroomData._id as string,role as string)
      res.cookie(`access-token-${role}`, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000  // expires in 15 minutes
        
      })
  
      res.cookie(`refresh-token-${role}`, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000  // expires in 30days
        
      })
      res.status(200).json(classroomData);
    } catch (error) {
      const customError = error as CustomError;
      res.status(customError.status || 500).json({ error: customError.message });
    }
  }

   // Fetch classrooms for a specific teacher
   async classroomLogout(req: Request, res: Response) {
    try {
      res.cookie('refresh-token-student-class','',{
        httpOnly:true,
        expires:new Date(0)
       })
       res.cookie('access-token-student-class','',{
        httpOnly:true,
        expires:new Date(0)
       })
       res.status(200).json({message:"admin Loged out"})
    } catch (error) {
      const customError = error as CustomError;
      res.status(customError.status || 500).json({ error: customError.message });
    }
  }

}

export default new ClassroomController();
