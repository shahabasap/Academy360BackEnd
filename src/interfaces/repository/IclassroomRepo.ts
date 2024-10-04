import mongoose from 'mongoose';
import { IClassroom, StudentData, ClassCreating, PaginatedResult } from '../../types/CommonTypes';

interface IClassroomRepository {
  createClassroom(data: ClassCreating): Promise<IClassroom>;
  findTeacherClassrooms(teacherid: string): Promise<IClassroom[]>;
  classroomFindById(id: mongoose.Types.ObjectId): Promise<IClassroom | null>;
  findByClassId(classroomId: string): Promise<IClassroom | null>;
  fetchClassrooms(page: number, pageSize: number): Promise<PaginatedResult<any>>;
  blockClassroom(classroomid: string): Promise<any>;
  unblockClassroom(classroomid: string): Promise<any>;
  findIsValidStudentObjectId(classroomid: string, studentid: string): Promise<IClassroom | null>;
  findIsValidStudentClassId(classroomid: string, studentid: string): Promise<IClassroom | null>;
  findStudentById(classroomid: string, studentid: string): Promise<IClassroom | null>;
  // findIsBlockedForStudent(classroomid: string): Promise<IClassroom | null>;
  findClassroomById(classroomid: string, studentid: string): Promise<IClassroom | null>;
  findClassroomWithStudent(classroomid: mongoose.Types.ObjectId, studentid: mongoose.Types.ObjectId): Promise<IClassroom | null>;
  findClassroom(classroomid: mongoose.Types.ObjectId): Promise<IClassroom | null>;
  addStudentToClassroom(classroomid: mongoose.Types.ObjectId, studentData: StudentData): Promise<any>;
  findClassroomByTeacherAndId(data: { classroomid: mongoose.Types.ObjectId, teacherid: mongoose.Types.ObjectId }): Promise<IClassroom | null>;
  findIsBlocked(classroomid: mongoose.Types.ObjectId): Promise<IClassroom | null>;
  getStudentIdsByClassroomId(classroomid: mongoose.Types.ObjectId): Promise<string[] | null>;
  searchStudents(
    data: { username: string | null; classroomid: mongoose.Types.ObjectId },
    Students: null | string[],
    page: number,
    limit: number
  ): Promise<{ Students: any[]; StudentCount: number }>;
}

export default IClassroomRepository;
