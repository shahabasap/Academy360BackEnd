import studentRepository from "../repositories/studentRepository";
// import { CustomErrorClass } from "../types/CustomError";
import {IStudent} from '../models/Student'
import fileRepository from "../repositories/fileRepository";



class studentService {
 
  async home(data:IStudent) {
    const home = await studentRepository.home(data);
    return home

  }
  // profile services--------
  async updateProfile(id: string, data: Partial<IStudent>, profilePic?: string) {
    
    if (profilePic) {
      const imageUrl = await fileRepository.uploadProfilePicture(profilePic);
      data.photo = imageUrl;
    }

    return studentRepository.updateProfile(id, data);
  }

  async profile(id:string) {
    const profile:any=studentRepository.findProfileDetails(id)
    
      return profile
 }
}

export default new studentService();
