import IStudentRepository from '../interfaces/repository/IstudentRepo'; // Import the interface
import { IStudent } from '../types/CommonTypes';
import fileRepository from "../repositories/fileRepository";
import { uploadImage } from "../utils/cloudinary";
import studentRepository from '../repositories/studentRepository';



class StudentService {

    private studentRepository: IStudentRepository;
    constructor() {
      // Initialize private repository members
      this.studentRepository =studentRepository;
    }

    async home(data: IStudent) {
        const home = await this.studentRepository.home(data);
        return home;
    }

    // Profile services
    // Update profile details
    async updateProfile(id: string, data: Partial<IStudent>, profilePic?: string) {
        if (profilePic) {
            const uploadProfile = await uploadImage(profilePic);
            data.photo = uploadProfile.secure_url;
        }
        return this.studentRepository.updateProfile(id, data);
    }

    // Update profile picture
    async updateProfilePic(id: string, profilePic?: string) {
        if (profilePic) {
            const imageUrl = await fileRepository.uploadProfilePicture(profilePic);
            const data = { photo: imageUrl };
            return this.studentRepository.updateProfilePic(id, data);
        }
    }

    // Fetch profile data
    async profile(id: string) {
        const profile = await this.studentRepository.findProfileDetails(id);
        return profile;
    }
}

export default new StudentService(); // Instantiate the service with the repository
