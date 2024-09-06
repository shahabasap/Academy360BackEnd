import { Request, Response } from 'express';
import ClassroomService from '../services/ClassroomService';
import mongoose from 'mongoose';
import { CustomError, CustomErrorClass } from '../types/CustomError';

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
      if (!classroomid) {
        throw new CustomErrorClass('Classroom ID is required', 400);
      }
      const classroomData = await ClassroomService.studentJoinToClassroom({ classroomid,studentid });
      res.status(200).json(classroomData);
    } catch (error) {
      const customError = error as CustomError;
      res.status(customError.status || 500).json({ error: customError.message });
    }
  }

}

export default new ClassroomController();
