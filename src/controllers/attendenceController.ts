import mongoose from "mongoose";
import attedenceServices from "../services/attedenceServices";
import { CustomError } from "../types/CustomError";
import { Request, Response, NextFunction } from "express";
import ClassroomService from "../services/ClassroomService";

class AttendenceController {
  async DayAttendence(req: Request, res: Response, next: NextFunction) {
    try {
      const classroomData = await attedenceServices.DayAttendence(req.body);
      res.status(200).json(classroomData);
    } catch (error) {
      next(error); 
    }
  }

  async MarkAttendence(req: Request, res: Response, next: NextFunction) {
    try {
      const classroomData = await attedenceServices.MarkAttendence(req.body);
      res.status(200).json(classroomData);
    } catch (error) {
      next(error); 
    }
  }

  async AttendenceHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { classroomId, date } = req.query;
      const classroomData = await attedenceServices.AttendanceHistory(classroomId as string, date as string);
      res.status(200).json(classroomData);
    } catch (error) {
      next(error); 
    }
  }
}

export default new AttendenceController();
