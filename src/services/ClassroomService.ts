import ClassroomRepository from '../repositories/ClassroomRepository';
import { CustomErrorClass } from "../types/CustomError";
import {IClassroom, IStudent} from '../types/CommonTypes'
import {ITeacher} from '../types/CommonTypes'
import generateClassroomId from '../utils/classroomid';
import mongoose from 'mongoose';

class ClassroomService {
   // Teacher services------------------
   async classroom(data:IClassroom) {
    const randonClassroomId=await generateClassroomId()
    data.classroomid= randonClassroomId
    const classroom=ClassroomRepository.createClassroom(data)
    
      return classroom
 }
// adding student to class------------------

   async addStudent(classroomid:mongoose.Types.ObjectId,studentid:mongoose.Types.ObjectId) {
    
    const classroom=ClassroomRepository.addStudentToClassroom(classroomid,studentid)
      return classroom
 }
  // Student services-------------
  
  async joinClassroom(data:{classroomid:string}) {
    const { classroomid } = data;
        const classroom=ClassroomRepository.CheckClassroomStatus(classroomid)
      return classroom
 }


}

export default new ClassroomService();
