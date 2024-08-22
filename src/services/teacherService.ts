import teacherRepository from "../repositories/teacerRepository";
import { CustomErrorClass } from "../types/CustomError";
import {ITeacher} from '../types/CommonTypes'
import fileRepository from "../repositories/fileRepository";




class teacherService {

  async home(data:ITeacher) {
     const home=teacherRepository.home(data)
       return home
  }

  async profile(id:string) {
     const profile:any=teacherRepository.findProfileDetails(id)
     
       return profile
  }
  
  async updateProfile(id: string, data: Partial<ITeacher>, profilePic?: string) {
    
    if (profilePic) {
      const imageUrl = await fileRepository.uploadProfilePicture(profilePic);
      data.photo = imageUrl;
    }

    return teacherRepository.updateProfile(id, data);
  }
}

export default new teacherService();