import mongoose from "mongoose";
import attendenceRepositories from "../repositories/attendenceRepositories";
import attendence from "../repositories/attendenceRepositories";
import ClassroomRepository from "../repositories/ClassroomRepository";
import { CustomErrorClass } from "../types/CustomError";
import studentRepository from "../repositories/studentRepository";


class AttendenceServices{

      async DayAttendence(data:{classroomid:mongoose.Types.ObjectId}) {
         const{classroomid}=data
        const StudentsInClassroom=await ClassroomRepository.getStudentIdsByClassroomId(classroomid)
        if(!StudentsInClassroom)
        {
          throw new CustomErrorClass("No Students in your classroom",404)
        }
         
        const attedenceList=await attendenceRepositories.getAttendenceByClassId(classroomid)
     
        if (!attedenceList) {
          
          const createAttendenceList=await attendenceRepositories.createAttendenceList(classroomid,StudentsInClassroom)
          if (createAttendenceList) {
               return createAttendenceList
          }
        }
        else
        {
          if(attedenceList.AttedenceDataSet.length !== StudentsInClassroom.length)
          {
              const updateAttendenceList=await attendenceRepositories.updateNewJoinees(classroomid,StudentsInClassroom)
          }
          throw new CustomErrorClass("attendence list already creted ",409)
        }
      }

      // Marking Attendence----------------------

      async MarkAttendence(data:{classroomid:mongoose.Types.ObjectId,attendenceListId:mongoose.Types.ObjectId,studentid:mongoose.Types.ObjectId}) {
        const {classroomid,attendenceListId,studentid}=data
        const student =await   studentRepository.findStudentById(studentid as mongoose.Types.ObjectId)
        
        if(!student)
        {
            throw new CustomErrorClass("User is not found",404)
        }
        
        const classroom= await ClassroomRepository.findByid(classroomid)

        if(!classroom)
        {
          throw new CustomErrorClass("Classroom is not found",404)
        }
         
        const attendanceRecord=await attendenceRepositories.findByIdStudentId(attendenceListId,studentid)
        if (!attendanceRecord) {
          throw new Error('Attendance record not found');
      }
      const currentStatus = attendanceRecord?.AttedenceDataSet[0].status;

      // Determine the new status
      const newStatus = currentStatus === 'Present' ? 'Absent' : 'Present';


        const updatedResult=await attendenceRepositories.updateStudentAttendence(attendenceListId,studentid,newStatus)

        return updatedResult
       
      }

      async AttendanceHistory(claroomId :string,date:string)
      {
      
        const classroomObjectId = new mongoose.Types.ObjectId(claroomId);
        const dateObject = new Date(date);
          const currentDate= new Date()
          if(dateObject==currentDate)
          {
            throw new Error('Today attendace canot be accessible');
          }
          const attendanceRecord=await attendenceRepositories.findByClassroomIdAndDate(classroomObjectId,dateObject)
          if (!attendanceRecord) {
            throw new Error('Attendance record not found');
        }

        return attendanceRecord
      }
}

export default new AttendenceServices()