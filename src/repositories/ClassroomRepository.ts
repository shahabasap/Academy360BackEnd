import Classroom from '../models/Classroom';
import {IStudent, ITeacher} from '../types/CommonTypes'
import {IClassroom,StudentData} from '../types/CommonTypes'
import mongoose from 'mongoose'
import { CustomErrorClass } from '../types/CustomError';
import Student from '../models/Student';


class ClassroomRepository {
  // teacher Repo------------------------
  
  async createClassroom(data:IClassroom) {
    try {
        
      const { subject,teacherid } = data;
      
      
   
      const subjectRegex = new RegExp(`^${subject}$`, 'i');
      const existingClassroom = await Classroom.findOne({ subject:subjectRegex, teacherid });
  
      if (existingClassroom) {
        throw new CustomErrorClass('A classroom with this subject already exists for  you.', 409);
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


// add new student----------------------------------------------
  async addStudentToClassroom(classroomid:mongoose.Types.ObjectId,studentid:mongoose.Types.ObjectId)
  {
    const student=await Student.findOne({_id:studentid})
    if(!student)
    {
      throw new CustomErrorClass("Such student data not found",404)
    }
    const studentIdWithStatus:StudentData={studentid:studentid ,IsAdded:true}

    const isInClassroom = await Classroom.findOne({
      students: { $elemMatch: { studentid: studentid } }
    });
    if(isInClassroom)
    {
      throw new CustomErrorClass("Student is already exists in your classroom",409)
    } 

    
    
    
  
    const updateResult = await Classroom.updateOne(
      { _id: classroomid },       
      { $addToSet: { students: studentIdWithStatus } }  
    );
  
    if (updateResult.modifiedCount > 0) {
    
      return { message: `${student.name} added to your classroom` };
    } else {
    
      throw new CustomErrorClass("Classroom not found or student already in classroom", 404);
    }
  }
  // Student Repo----------------------
  async CheckClassroomStatus(classroomid:string)
  {
    


  }
}

export default new ClassroomRepository();
