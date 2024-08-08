import Otp from '../models/Otp';
import Student from '../models/Student';
import  Teacher  from '../models/Teacher';
import { CustomError,CustomErrorClass } from '../types/CustomError';


class OtpRepository {
  async createOtp(email: string, otp: number, expiresAt: Date) {
    try {
         return await Otp.create({ email, otp, expiresAt });
    } catch (error) {

      throw new CustomErrorClass('Error creating OTP',500);
    }
  }
  

  async findOtp(email: string, otp: string) {
    try {
      const otpCheck= await Otp.findOne({ email, otp });
      return otpCheck
    } catch (error) {

      throw new CustomErrorClass('Error finding OTP',404);
    }
  }

  async deleteOtp(email: string) {
    try {
      return await Otp.deleteMany({ email });
    } catch (error) {

      throw new CustomErrorClass('Error deleting OTP',500);
    }
  }
  // verify user----------
  async verifyUser(email: string) {
    try {
      const user = await Student.findOne({ username: email });
  
      if (!user) {
        throw new CustomErrorClass('User not found', 404);
      }
  
      const updateResult = await Student.updateOne(
        { username: email },
        { $set: { is_verified: true } }
      );
  
      if (updateResult.modifiedCount === 0) {
        throw new CustomErrorClass('Error in updating verification status', 500);
      }
  
      const updatedUser = await Student.findOne({ username: email });
  
      if (!updatedUser) {
        throw new CustomErrorClass('Error in fetching updated user details', 500);
      }
  
      return updatedUser;
    } catch (error) {
      throw new CustomErrorClass('Error in verifying user', 500);
    }
  }
  // verify teacher----------------------------
  
  async verifyTeacher(email: string) {
    try {
      const teacher = await Teacher.findOne({ username: email });
      
      if (!teacher) {
        throw new CustomErrorClass('Teacher not found', 404);
      }
  
      const updateResult = await Teacher.updateOne(
        { username: email },
        { $set: { Is_verified: true } }
      );
  
      if (updateResult.modifiedCount === 0) {
        throw new CustomErrorClass('Error in updating verification status', 500);
      }
  
      const updatedTeacher = await Teacher.findOne({ username: email });
      
      if (!updatedTeacher) {
        throw new CustomErrorClass('Error in fetching updated teacher details', 500);
      }
  
      return updatedTeacher;
    } catch (error) {
      throw new CustomErrorClass('Error in verifying user', 500);
    }
  }
  
 
}

export default new OtpRepository();
