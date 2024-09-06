import studentRepository from "../repositories/studentRepository";
// import { CustomErrorClass } from "../types/CustomError";
import {IStudent} from '../types/CommonTypes'
import fileRepository from "../repositories/fileRepository";
import { uploadImage } from "../utils/cloudinary";



class studentService {
 
  async home(data:IStudent) {
    const home = await studentRepository.home(data);
    return home

  }
  // profile services--------
  // update profile details----------
  async updateProfile(id: string, data: Partial<IStudent>, profilePic?: string) {
    
     
        if(profilePic)
        {
          const uploadProfile=await uploadImage(profilePic)
          data.photo=uploadProfile.secure_url
        }
    return studentRepository.updateProfile(id, data);
  }
  // update profile pic--------------
  async updateProfilePic(id: string, profilePic?: string) {
    
    if (profilePic) {
      const imageUrl = await fileRepository.uploadProfilePicture(profilePic);
      const data={photo:imageUrl}
     
      return studentRepository.updateProfilePic(id, data);
    }

  
  }
// fetch profile data------------
  async profile(id:string) {
    const profile:any=studentRepository.findProfileDetails(id)
    
      return profile
 }
}

export default new studentService();
