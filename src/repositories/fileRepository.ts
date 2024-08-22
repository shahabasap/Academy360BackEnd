import { uploadImage } from '../utils/cloudinary';

class FileRepository {
  async uploadProfilePicture(filePath: string) {
    const result = await uploadImage(filePath);
    
    return result.secure_url; // Return the URL of the uploaded image
  }
}

export default new FileRepository();
