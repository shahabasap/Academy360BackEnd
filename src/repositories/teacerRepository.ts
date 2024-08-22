import  Teacher  from "../models/Teacher";
import { CustomError,CustomErrorClass } from '../types/CustomError';
import {ITeacher} from '../types/CommonTypes'
import {IClassroom} from '../types/CommonTypes'
import Classroom from "../models/Classroom";
import mongoose from 'mongoose'



class teacherRepository {

  async home(data:ITeacher) {
    return data
  }
  
  // classroom Repo------------------------
  
  async createClassroom(data:IClassroom,user:ITeacher) {
    try {
        
      const { subject } = data;
      const Teacherid=user._id  as mongoose.Types.ObjectId
      if (Teacherid) {
        data.teacherid=Teacherid
      }
      
   
      const subjectRegex = new RegExp(`^${subject}$`, 'i');
      const existingClassroom = await Classroom.findOne({ subject:subjectRegex, teacherid:Teacherid });
  
      if (existingClassroom) {
        throw new CustomErrorClass('A classroom with this subject already exists for the you.', 409);
      }
  
      const newClassroom = await Classroom.create(data);

      return { message: 'Classroom created successfully', classroom: newClassroom };
    } catch (error) {
      // You might want to log the error here
      if (error instanceof CustomErrorClass) {
        throw error;
      } else {
        throw new CustomErrorClass('Failed to create classroom', 500);
      }
    }
  }
  

  // Profile Repo---------------------------
  async findProfileDetails(id:string) {
    const Profile=await Teacher.findOne({_id:id})
    if(!Profile)
      {
       throw new CustomErrorClass("User not found",404)
      }
    return Profile
  }

  
  async updateProfile(id: string, data: Partial<ITeacher>) {
    return Teacher.updateOne({ _id: id }, data);
  }

}

export default new teacherRepository();
