import  Teacher  from "../models/Teacher";
import { CustomError,CustomErrorClass } from '../types/CustomError';
import {ITeacher} from '../types/CommonTypes'
import {IClassroom} from '../types/CommonTypes'
import Classroom from "../models/Classroom";
import mongoose from 'mongoose'
import ITeacherRepository from "../interfaces/repository/IteacherRepo";



class teacherRepository implements ITeacherRepository{

  async home(data:ITeacher) {
    return data
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
   
    return await Teacher.updateOne({ _id: id }, data);
  }
  async updateProfilePic(id: string, data: {photo:string}) {
    return await Teacher.updateOne({ _id: id }, {$set:{data}});
  }
  async isBlockeById(id:string):Promise<ITeacher | null> 
  {
    return await Teacher.findOne({_id:id,Is_block:true})
  }
  

}

export default new teacherRepository();
