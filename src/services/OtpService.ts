import Student from '../models/Student';
import OtpRepository from '../repositories/OtpRepositoy';
import { generateOtp, sendEmail } from '../utils/email';
import { CustomErrorClass } from "../types/CustomError";

class OtpService {
  async sendOtp(email: string) {

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes
    await OtpRepository.createOtp(email, otp, expiresAt);
    await sendEmail(email, otp);

    return otp;
  }

  async verifyOtp(email: string, otp: string) {
    const record = await OtpRepository.findOtp(email, otp);

    if (!record || record.expiresAt < new Date()) {
      throw new CustomErrorClass('OTP is invalid or expired',403);
    }
    if (record) {
        const Verify_Student=await OtpRepository.verifyUser(email);
        return Verify_Student;
      }

    await OtpRepository.deleteOtp(email);

 
  }
  async TeacherSendOtp(email: string) {

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes
    await OtpRepository.createOtp(email, otp, expiresAt);
    await sendEmail(email, otp);

    return otp;
  }

  async TeacherVerifyOtp(email: string, otp: string) {
    const record = await OtpRepository.findOtp(email, otp);

    if (!record || record.expiresAt < new Date()) {
      throw new CustomErrorClass('OTP is invalid or expired',403);
    }
    if (record) {
        const Verify_Teacher=await OtpRepository.verifyTeacher(email);
        return Verify_Teacher;
      }

    await OtpRepository.deleteOtp(email);
 
  }
}

export default new OtpService();
