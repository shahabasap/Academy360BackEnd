import mongoose from "mongoose"
import Attendance from "../models/attendence"
import { CustomErrorClass } from "../types/CustomError"
import Classroom from "../models/Classroom";


class AttendenceRepository{
  async getAttendenceByClassId(classroomId: mongoose.Types.ObjectId) {
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
    const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 0, 0, 0);
  
    const attendance = await Attendance.findOne({
      classroomId: classroomId,
      Date: { $gte: startOfDay, $lt: endOfDay } // Querying within the entire day
    }).exec();
  
    return attendance;
  }
  
    async updateNewJoinees(classroomId:mongoose.Types.ObjectId,Students:string[]) {
     
      // Map over the Students array and return an array of promises
  const updatePromises = Students.map(async (studentId) => {
    return Attendance.updateOne(
      { classroomId: classroomId, 'AttedenceDataSet.studentId': { $ne: studentId } },  // Only update if the student is not already present
      { $push: { AttedenceDataSet: { studentId, status: 'Absent' } } }         // Use $push to add to the array
    );
  });

  // Wait for all promises to resolve
  const results = await Promise.all(updatePromises);

  return results;
      }
      
    async createAttendenceList(classroomId:mongoose.Types.ObjectId,Students:string[]) {
          
          const StudentsList=Students.map((value)=>{return{studentId:value,status:"Absent"}})
          const CreateList=await Attendance.create({classroomId,AttedenceDataSet:StudentsList})
          return CreateList
      }

      

      async updateStudentAttendence(attendenceListId:mongoose.Types.ObjectId,studentId:mongoose.Types.ObjectId,Status:string) {
          
        const attendence= await Attendance.updateOne(
          {_id:attendenceListId, 'AttedenceDataSet.studentId':studentId},
          {$set:{'AttedenceDataSet.$.status':Status}}
        )
        return attendence
}

      async findByIdStudentId(attendenceListId:mongoose.Types.ObjectId,studentId:mongoose.Types.ObjectId) {
          
        const attendanceRecord = await Attendance.findOne(
          { _id: attendenceListId, 'AttedenceDataSet.studentId': studentId },
          { 'AttedenceDataSet.$': 1 } // Only return the matched subdocument
      );
      return attendanceRecord
}
      async findByClassroomIdAndDate(classroomId:mongoose.Types.ObjectId,date:Date) {

      
       const attendance=await Attendance.findOne({classroomId:classroomId,Date:date})
       return attendance
}


}

export default new AttendenceRepository()