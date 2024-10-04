import { ITeacher } from '../../types/CommonTypes';
import mongoose from 'mongoose';

interface ITeacherRepository {
  home(data: ITeacher): Promise<ITeacher>;  
  isBlockeById(id:string):Promise<ITeacher | null>                              // Returns the teacher data as received
  findProfileDetails(id: string): Promise<ITeacher | null>;                 // Finds the teacher profile by ID
  updateProfile(id: string, data: Partial<ITeacher>): Promise<any>;         // Updates teacher profile fields
  updateProfilePic(id: string, data: { photo: string }): Promise<any>;      // Updates teacher profile picture
}

export default ITeacherRepository;
