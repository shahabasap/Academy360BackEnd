interface IFileRepository {
    uploadProfilePicture(filePath: string): Promise<string>;  // Returns a promise of the image URL
    uploadQualification(filePath: string): Promise<string>;   // Returns a promise of the qualification URL
  }
  
  export default IFileRepository;
  