import { IStudent,IClassroom } from "../../types/CommonTypes";
import mongoose from "mongoose";


interface IStudentRepository {
  home(data: IStudent): Promise<IStudent>;  
  isBlockeById(id:string):Promise<IStudent | null>                                  // Returns the student data as received
  findProfileDetails(id: string): Promise<IStudent | null>;                        // Finds the student profile by ID
  updateProfile(id: string, data: Partial<IStudent>): Promise<void>;               // Updates student profile fields
  updateProfilePic(id: string, data: { photo: string }): Promise<void>;            // Updates student profile picture
  classroomAlreadyExists(classroomid: string, studentid: string): Promise<boolean>; // Checks if a student is already in a locked classroom
  addClassroomToBucket(classroomid: string, studentid: string): Promise<any>;     // Adds a classroom to the student's list
  updateStudentProfile(classroomid: string, studentid: string): Promise<any>;     // Updates a classroom's lock status in the student's profile
  findClassroomIsLocked(studentId: string, classroomId: string): Promise<any>;     // Finds if a classroom is locked for a student
  findStudentClassrooms(studentId: string): Promise<any>;                 // Finds all unlocked classrooms for a student
  findStudentById(studentid: mongoose.Types.ObjectId): Promise<IStudent | null>;   // Finds a student by their ID and checks if verified
}

export default IStudentRepository;
