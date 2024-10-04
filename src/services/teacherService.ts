import ITeacherRepository from "../interfaces/repository/IteacherRepo";
import IFileRepository from "../interfaces/repository/IfileRepo";
import { CustomErrorClass } from "../types/CustomError";
import { ITeacher } from '../types/CommonTypes';
import { uploadImage, uploadQualification } from "../utils/cloudinary";
import TeacherRepository from '../repositories/teacherRepository'
import FileRepository from '../repositories/fileRepository'


class TeacherService {
  private teacherRepository: ITeacherRepository;
  private fileRepository: IFileRepository;

  constructor(
  
  ) {
    this.teacherRepository = TeacherRepository;
    this.fileRepository = FileRepository;
  }

  async home(data: ITeacher) {
    return await this.teacherRepository.home(data);
  }

  // Profile services------------------
  async profile(id: string) {
    const profile: any = await this.teacherRepository.findProfileDetails(id);
    return profile;
  }

  // Update Profile pic----------------------------
  async updateProfilePic(teacherId: string, profilePic: string) {
    if (!profilePic) {
      throw new CustomErrorClass('Profile picture file is required and was not provided.', 400);
    }

    try {
      // Upload the profile picture
      const profilePicUrl = await this.fileRepository.uploadProfilePicture(profilePic);

      // Prepare the update data
      const data = { photo: profilePicUrl };

      // Update the teacher profile
      const updatedProfile = await this.teacherRepository.updateProfile(teacherId, data);

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

  // Update all profile details ------------------------
  async updateProfile(id: string, data: any, profilePic?: string | null, ug_Certificate?: string, pg_Certificate?: string) {
    try {
      if (profilePic) {
        const UploadPic = await uploadImage(profilePic);
        data.photo = UploadPic.secure_url;
      } else if (data.photourl) {
        data.photo = data.photourl;
        delete data['photourl'];
      }

      if (ug_Certificate) {
        const UploadPic = await uploadQualification(ug_Certificate);
        data.ugCertificate = UploadPic.secure_url;
      } else if (data.ugurl) {
        data.ugCertificate = data?.ugurl;
        delete data['ugurl'];
      }

      if (pg_Certificate) {
        const UploadPic = await uploadQualification(pg_Certificate);
        data.pgCertificate = UploadPic.secure_url;
      } else if (data.pgurl) {
        data.pgCertificate = data.pgurl;
        delete data['pgurl'];
      }

      data.Is_submit = true;

      console.log("data set", data);
      const updateProfile = await this.teacherRepository.updateProfile(id, data);

      return updateProfile;
    } catch (error: any) {
      if (error instanceof CustomErrorClass) {
        throw error;
      } else {
        throw new CustomErrorClass(`An unexpected error occurred: ${error.message}`, 500);
      }
    }
  }
}

export default new TeacherService;
