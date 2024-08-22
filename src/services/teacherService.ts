import teacherRepository from "../repositories/teacerRepository";
import { CustomErrorClass } from "../types/CustomError";
import {ITeacher} from '../types/CommonTypes'
import fileRepository from "../repositories/fileRepository";
import {IClassroom} from '../types/CommonTypes'




class teacherService {

  async home(data:ITeacher) {
     const home=teacherRepository.home(data)
       return home
  }

  // Classrooms----------
  async classroom(data:IClassroom,user:ITeacher) {
     const home=teacherRepository.createClassroom(data,user)
       return home
  }


// Profile services------------------
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