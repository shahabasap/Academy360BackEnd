import Student from "../models/Student";
import { CustomErrorClass } from '../types/CustomError';
import { IStudent, IClassroom } from '../types/CommonTypes';
import mongoose from "mongoose";
import IStudentRepository from "../interfaces/repository/IstudentRepo";

class StudentRepository implements IStudentRepository {
  async home(data: IStudent) {
    return data;
  }

  // Profile repository
  async findProfileDetails(id: string): Promise<IStudent | null> {
    const profile = await Student.findOne({ _id: id });
    if (!profile) {
      throw new CustomErrorClass("User not found", 404);
    }
    return profile;
  }

  async updateProfile(id: string, data: Partial<IStudent>): Promise<void> {
    await Student.updateOne({ _id: id }, data);
  }

  async updateProfilePic(id: string, data: { photo: string }): Promise<void> {
    await Student.updateOne({ _id: id }, data);
  }

  async classroomAlreadyExists(classroomid: string, studentid: string): Promise<boolean> {
    const classroomObjectId = new mongoose.Types.ObjectId(classroomid);
    const student = await Student.findOne({
      _id: studentid,
      'classrooms.classroomId': classroomObjectId,
      'classrooms.IsLocked': true
    });
    return !!student; // Return true or false based on existence
  }

  async addClassroomToBucket(classroomid: string, studentid: string): Promise<any> {
    const classroom = { classroomId: classroomid, IsLocked: true };
    return await Student.updateOne({ _id: studentid }, { $push: { classrooms: classroom } });
  }

  async updateStudentProfile(classroomid: string, studentid: string): Promise<any> {
    return await Student.updateOne({ _id: studentid, 'classrooms.classroomId': classroomid }, { $set: { 'classrooms.$.IsLocked': false } });
  }

  async findClassroomIsLocked(studentId: string, classroomId: string): Promise<any> {
    return await Student.findOne({ _id: studentId, 'classrooms.classroomId': classroomId }).exec();
  }

  async findStudentClassrooms(studentId: string): Promise<any> {
    const student = await Student.findOne({ _id: studentId, 'classrooms.IsLocked': false }).populate('classrooms.classroomId').exec();
    
    if (!student) {
      throw new CustomErrorClass('Student not found', 404);
    }

    return student?.classrooms ? student.classrooms.filter(classroom => !classroom.IsLocked) : null; // Return only the unlocked classrooms
  }

  async findStudentById(studentid: mongoose.Types.ObjectId): Promise<IStudent | null> {
    return await Student.findById({ _id: studentid, is_verified: true });
  }
  async isBlockeById(id:string):Promise<IStudent | null> 
  {
    return await Student.findOne({_id:id,Is_block:true})
  }
  
}

export default new StudentRepository();
