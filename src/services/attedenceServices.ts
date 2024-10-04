import mongoose from "mongoose";
import IAttendenceRepository from "../interfaces/repository/IattedenceRepo";
import IClassroomRepository from "../interfaces/repository/IclassroomRepo";
import IStudentRepository from "../interfaces/repository/IstudentRepo";
import { CustomErrorClass } from "../types/CustomError";
import AttendenceRepositories from '../repositories/attendenceRepositories'
import ClassroomRepository from '../repositories/ClassroomRepository';
import StudentRepository from '../repositories/studentRepository';

class AttendenceServices {
  // Private repository properties
  private attendenceRepositories: IAttendenceRepository;
  private classroomRepository: IClassroomRepository;
  private studentRepository: IStudentRepository;

  constructor(
    
  ) {
    this.attendenceRepositories = AttendenceRepositories;
    this.classroomRepository = ClassroomRepository;
    this.studentRepository = StudentRepository;
  }

  async DayAttendence(data: { classroomid: mongoose.Types.ObjectId }) {
    const { classroomid } = data;

    const studentsInClassroom = await this.classroomRepository.getStudentIdsByClassroomId(classroomid);
    if (!studentsInClassroom || studentsInClassroom.length === 0) {
      throw new CustomErrorClass("No Students in your classroom", 404);
    }

    const attendanceList = await this.attendenceRepositories.getAttendenceByClassId(classroomid);
  
    if (!attendanceList) {
      return await this.attendenceRepositories.createAttendenceList(classroomid, studentsInClassroom);
    } else if (attendanceList.AttedenceDataSet.length !== studentsInClassroom.length) {
      await this.attendenceRepositories.updateNewJoinees(classroomid, studentsInClassroom);
    }

    return await this.attendenceRepositories.getAttendenceByClassId(classroomid);
  }

  // Marking Attendance
  async MarkAttendence(data: {
    classroomid: mongoose.Types.ObjectId;
    attendenceListId: mongoose.Types.ObjectId;
    studentid: mongoose.Types.ObjectId;
  }) {
    const { classroomid, attendenceListId, studentid } = data;

    const student = await this.studentRepository.findStudentById(studentid );
    if (!student) {
      throw new CustomErrorClass("User is not found", 404);
    }

    const classroom = await this.classroomRepository.findById(classroomid);
    if (!classroom) {
      throw new CustomErrorClass("Classroom is not found", 404);
    }

    const attendanceRecord = await this.attendenceRepositories.findByIdStudentId(attendenceListId, studentid);
    if (!attendanceRecord) {
      throw new Error("Attendance record not found");
    }

    const currentStatus = attendanceRecord?.AttedenceDataSet[0].status;
    const newStatus = currentStatus === "Present" ? "Absent" : "Present";

    return await this.attendenceRepositories.updateStudentAttendence(attendenceListId, studentid, newStatus);
  }

  async AttendanceHistory(classroomId: string, date: string) {
    try {
      const dateObject = new Date(date);
      if (isNaN(dateObject.getTime())) {
        throw new Error("Invalid Date format");
      }

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Set current date to midnight

      // Prevent accessing today's attendance
      if (dateObject.setHours(0, 0, 0, 0) === currentDate.getTime()) {
        throw new Error("Today's attendance cannot be accessed.");
      }

      const attendanceRecord = await this.attendenceRepositories.findByClassroomIdAndDate(classroomId, dateObject);
      if (!attendanceRecord) {
        throw new Error("Attendance record not found");
      }

      return attendanceRecord;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch data: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }
}

export default new AttendenceServices();
