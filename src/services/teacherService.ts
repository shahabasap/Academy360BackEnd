import teacherRepository from "../repositories/teacerRepository";
import { CustomErrorClass } from "../types/CustomError";
import {ITeacher} from '../types/CommonTypes'
import fileRepository from "../repositories/fileRepository";
import {uploadImage,uploadQualification} from "../utils/cloudinary"





class teacherService {

  async home(data:ITeacher) {
     const home=teacherRepository.home(data)
       return home
  }

 

// Profile services------------------
  async profile(id:string) {
     const profile:any=teacherRepository.findProfileDetails(id)
     
       return profile
  }
  // update Profile pic----------------------------
  
  async  updateProfilePic(teacherId: string, profilePic: string) {
    if (!profilePic) {
      throw new CustomErrorClass('Profile picture file is required and was not provided.', 400);
    }
  
    try {
      // Upload the profile picture
      const profilePicUrl = await fileRepository.uploadProfilePicture(profilePic);
  
      // Prepare the update data
      const data = { photo: profilePicUrl };
  
      // Update the teacher profile
      const updatedProfile = await teacherRepository.updateProfile(teacherId, data);
  
      // Check if the profile was actually modified
      if (updatedProfile.modifiedCount > 0) {
        return updatedProfile;
      } else {
        throw new CustomErrorClass('Profile picture update failed.', 400);
      }
  
     
    } catch (error) {
      console.error('Error updating profile picture:', error);
      throw new CustomErrorClass('An error occurred while updating the profile.', 500);
    }
  }
  
  // update your all profile details ------------------------
  async updateProfile(id: string, data: Partial<ITeacher>, profilePic?: string | null,ug_Certificate?:string,pg_Certificate?:string) {
    try {
     


      if(profilePic)
      {
          const UploadPic=await uploadImage(profilePic)
          data.photo=UploadPic.secure_url
      }

      if(ug_Certificate)
      {
          const UploadPic=await uploadQualification(ug_Certificate)
          data.ugCertificate=UploadPic.secure_url
      }

      if(pg_Certificate)
      {
          const UploadPic=await uploadQualification(pg_Certificate)
          data.pgCertificate=UploadPic.secure_url
      }

      const  updateProfile= await teacherRepository.updateProfile(id,data)
      
     
  
   return updateProfile
    } catch (error:any) {
      if (error instanceof CustomErrorClass) {
        // Re-throw the custom error to be handled in the controller
        throw error;
      } else {
        // Handle any other unforeseen errors
        throw new CustomErrorClass(`An unexpected error occurred: ${error.message}`, 500);
      }
    }
  }
  
}

export default new teacherService();