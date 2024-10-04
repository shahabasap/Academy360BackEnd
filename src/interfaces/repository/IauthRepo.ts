import { IStudent } from '../../types/CommonTypes';
import mongoose from 'mongoose';

interface IAuthRepository {
  // Admin methods
  Adminlogin(data: { username: string; password: string }): Promise<any>;

  // Teacher methods
  TeacherIsBlocked(teacherId: string): Promise<any>;
  TeacherLogin(data: { username: string; password: string }): Promise<any>;
  AddNewTeacher(data: { name: string; username: string; password: string }): Promise<any>;
  sendTeacherResetPasswordEmail(username: string): Promise<void>;
  resetTeacherPassword(token: string, newPassword: string): Promise<void>;

  // Student methods
  StudentIsBlocked(studentId: string): Promise<any>;
  AddNewStudent(data: { name: string; username: string; password: string }): Promise<any>;
  login(data: { username: string; password: string }): Promise<any>;
  sendStudentResetPasswordEmail(username: string): Promise<void>;
  resetStudentPassword(token: string, newPassword: string): Promise<void>;

  // Common method for adding users (Teachers or Students)
  AddUser(data: any): Promise<any>;
}

export default IAuthRepository;
