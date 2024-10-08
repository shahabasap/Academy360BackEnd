import IFileRepository from '../interfaces/repository/IfileRepo';
import { uploadImage,uploadQualification } from '../utils/cloudinary';



class FileRepository  implements IFileRepository {
  async uploadProfilePicture(filePath: string) {
    const result = await uploadImage(filePath);
    
    return result.secure_url; // Return the URL of the uploaded image
  }
  async uploadQualification(filePath: string) {
    const result = await uploadQualification(filePath);
    
    return result.secure_url; // Return the URL of the uploaded image
  }
}

export default new FileRepository();
