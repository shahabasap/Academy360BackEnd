import  Teacher  from "../models/Teacher";
import { CustomError,CustomErrorClass } from '../types/CustomError';
import {ITeacher} from '../models/Teacher'



class teacherRepository {

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
    return Teacher.updateOne({ _id: id }, data);
  }

}

export default new teacherRepository();
