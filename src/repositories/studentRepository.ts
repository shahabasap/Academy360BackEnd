import Student from "../models/Student";
import { CustomError,CustomErrorClass } from '../types/CustomError';
import {IStudent,IClassroom} from '../types/CommonTypes'
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;




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
  async updateProfilePic(id: string, data:{photo:string}) {
    return Student.updateOne({ _id: id }, data);
  }

  async classroomAlreadyExist(classroomid: string, studentid: string): Promise<any> {
    const classroomObjectId = new mongoose.Types.ObjectId(classroomid);

    const classroom = await Student.findOne({ _id: studentid, classrooms: { $in: [classroomObjectId] } });
    return classroom;
}

  async UpdateStudentProfile(classroomid:string,studentid:string): Promise<any> {
    const classroomObjectId = new mongoose.Types.ObjectId(classroomid);
   

    const classroom = await Student.updateOne({ _id: studentid},{$addToSet:{classrooms:classroomObjectId}});
    return classroom;
  }
  async findStudentClassrooms(id: string): Promise<any> {
    const student = await Student.findOne({ _id: id }).populate('classrooms').exec();
    
    if (!student) {
        throw new Error('Student not found');
    }

    return student.classrooms;  // This will return the populated classrooms array
}
async findStudentById(studentid: mongoose.Types.ObjectId): Promise<IStudent | null> {
  const student = await Student.findById({_id:studentid,is_verified:true});
  return student;
}

  
}







export default new StudentRepository();
