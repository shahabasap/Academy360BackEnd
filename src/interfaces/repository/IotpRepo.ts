interface IOtpRepository {
    createOtp(email: string, otp: number, expiresAt: Date): Promise<any>;  // Creates and returns OTP data
    findOtp(email: string, otp: string): Promise<any | null>;              // Finds and returns OTP if found, or null
    deleteOtp(email: string): Promise<any>;                                // Deletes OTP(s) for the given email
    verifyUser(email: string): Promise<any>;                               // Verifies the student and returns updated user
    verifyTeacher(email: string): Promise<any>;                            // Verifies the teacher and returns updated teacher
  }
  
  export default IOtpRepository;
  