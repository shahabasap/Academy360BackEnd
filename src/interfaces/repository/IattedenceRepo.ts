import mongoose from "mongoose";
import { IAttendance }   from '../../types/CommonTypes'

interface IAttendanceRepository {
  getAttendenceByClassId(classroomId: mongoose.Types.ObjectId): Promise<IAttendance | null>;
  updateNewJoinees(classroomId: mongoose.Types.ObjectId, Students: string[]): Promise<any[]>;
  createAttendenceList(classroomId: mongoose.Types.ObjectId, Students: string[]): Promise<IAttendance>;
  updateStudentAttendence(attendenceListId: mongoose.Types.ObjectId, studentId: mongoose.Types.ObjectId, Status: string): Promise<any>;
  findByIdStudentId(attendenceListId: mongoose.Types.ObjectId, studentId: mongoose.Types.ObjectId): Promise<IAttendance | null>;
  findByClassroomIdAndDate(classroomId: string, date: Date): Promise<IAttendance | null>;
}

export default IAttendanceRepository;
