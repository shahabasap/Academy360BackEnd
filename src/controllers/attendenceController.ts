import mongoose from "mongoose";
import attedenceServices from "../services/attedenceServices";
import { CustomError } from "../types/CustomError";
import { Request, Response } from "express";


class AttendenceController{
    async DayAttendence(req: Request, res: Response) {
        try {
     
          const classroomData = await attedenceServices.DayAttendence(req.body);
          res.status(200).json(classroomData);
        } catch (error) {
          const customError = error as CustomError;
          res.status(customError.status || 500).json({ error: customError.message });
        }
      }
    async MarkAttendence(req: Request, res: Response) {
        try {
     
          const classroomData = await attedenceServices.MarkAttendence(req.body);
          res.status(200).json(classroomData);
        } catch (error) {
          const customError = error as CustomError;
          res.status(customError.status || 500).json({ error: customError.message });
        }
      }
    async AttendenceHistory(req: Request, res: Response) {
        try {
          const {claroomId,date}=req.query
           
          const classroomData = await attedenceServices.AttendanceHistory(claroomId as string,date as string);
          res.status(200).json(classroomData);
        } catch (error) {
          const customError = error as CustomError;
          res.status(customError.status || 500).json({ error: customError.message });
        }
      }
}

export default  new AttendenceController()