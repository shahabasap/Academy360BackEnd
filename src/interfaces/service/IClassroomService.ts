// interfaces/IClassroomService.ts
import { ClassCreating } from '../../types/CommonTypes';
import mongoose from 'mongoose';

export default interface IClassroomService {
    createClassroom(data: ClassCreating): Promise<any>;
    fetchTeacherClassrooms(id: string): Promise<any[]>;
    fetchStudentClassrooms(id: string): Promise<any[]>;
    fetchClassroom(id: string): Promise<any>;
    isLocked(classroomId: string, studentId: string): Promise<boolean>;
    addStudent(classroomid: mongoose.Types.ObjectId, studentid: mongoose.Types.ObjectId): Promise<any>;
    searchStudents(data: { username: string; classroomid: mongoose.Types.ObjectId }, page: number, limit: number): Promise<any[]>;
    teacherJoin(data: { classroomid: mongoose.Types.ObjectId, teacherid: mongoose.Types.ObjectId }): Promise<any>;
    addClassroom(data: { classroomid: string, studentid: string }): Promise<any>;
    studentJoinToClassroom(data: { classroomid: string, studentid: string }): Promise<any>;
}
