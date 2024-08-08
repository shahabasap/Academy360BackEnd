import { Request } from 'express';
import mongoose from 'mongoose';
import { IStudent } from '../models/Student';
import { ITeacher } from '../models/Teacher';

export interface CustomRequest extends Request {
  user?: IStudent | ITeacher;
}

export interface CustomJwtPayload {
  userdata: string | mongoose.Schema.Types.ObjectId;
}
