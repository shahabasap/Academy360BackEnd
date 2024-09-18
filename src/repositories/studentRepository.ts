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

    const student = await Student.findOne({ _id: studentid, 'classrooms.classroomId': classroomObjectId,'classrooms.IsLocked':true });
    return student;
}
  async addClaroomToBucket(classroomid: string, studentid: string): Promise<any> {

     const classroom={classroomId:classroomid,IsLocked:true}
     const student=await Student.updateOne({_id:studentid},{$push:{classrooms:classroom}})
    return student;
}

  async UpdateStudentProfile(classroomid:string,studentid:string): Promise<any> {
   

    const classroom = await Student.updateOne({ _id: studentid ,'classrooms.classroomId':classroomid},  { $set: { 'classrooms.$.IsLocked': false } });
   
    return classroom;
  }
  async findClassroomIsLocked(studentId:string,classroomId:string): Promise<any> {
    const studentClassroom=await  Student.findOne({_id:studentId,'classrooms.classroomId':classroomId}).exec()

    return studentClassroom
  }
  async findStudentClassrooms(studentId: string): Promise<any> {
   
    const student = await Student.findOne({ _id: studentId,'classrooms.IsLocked':false

     }).populate('classrooms.classroomId').exec();
    
    if (!student) {
        throw new Error('Student not found');
    }
    if (!student.classrooms) {
        throw new Error('No classroome Exists');
    }

    // Filter classrooms that are unlocked
    const classroomsUnlocked = student?.classrooms.filter((classroom) => {
     if(classroom.IsLocked==false)
     {
      return classroom.classroomId
     }
  });
 

  return classroomsUnlocked;  // Return only the unlocked classrooms
}
async findStudentById(studentid: mongoose.Types.ObjectId): Promise<IStudent | null> {
  const student = await Student.findById({_id:studentid,is_verified:true});
  return student;
}

  
}







export default new StudentRepository();
