import Student from "../models/Student";
import { CustomError,CustomErrorClass } from '../types/CustomError';
import {IStudent} from '../models/Student'




class StudentRepository {
  async home(data:IStudent) {
  
    return data;
  }
//  Profile repo------------------------
async findProfileDetails(id:string) {

  const Profile=await Student.findOne({_id:id})
  if(!Profile)
    {
     throw new CustomErrorClass("User not found",404)
    }
  return Profile
}

  async updateProfile(id: string, data: Partial<IStudent>) {
    return Student.updateOne({ _id: id }, data);
  }
}

export default new StudentRepository();
