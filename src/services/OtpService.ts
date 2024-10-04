import IOtpRepository from '../interfaces/repository/IotpRepo';
import { generateOtp, sendEmail } from '../utils/email';
import { CustomErrorClass } from "../types/CustomError";
import OtpRepositoy from '../repositories/OtpRepositoy';

class OtpService {
  private otpRepository: IOtpRepository
    constructor() {
      this.otpRepository=OtpRepositoy
    }

    async sendOtp(email: string) {
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes
        await this.otpRepository.createOtp(email, otp, expiresAt);
        await sendEmail(email, otp);

        return otp;
    }

    async verifyOtp(email: string, otp: string) {
        const record = await this.otpRepository.findOtp(email, otp);

        if (!record || record.expiresAt < new Date()) {
            throw new CustomErrorClass('OTP is invalid or expired', 403);
        }
        if (record) {
            const verifyStudent = await this.otpRepository.verifyUser(email);
            await this.otpRepository.deleteOtp(email); // Move delete here to ensure it's deleted after successful verification
            return verifyStudent;
        }
    }

    async teacherSendOtp(email: string) {
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes
        await this.otpRepository.createOtp(email, otp, expiresAt);
        await sendEmail(email, otp);

        return otp;
    }

    async teacherVerifyOtp(email: string, otp: string) {
        const record = await this.otpRepository.findOtp(email, otp);

        if (!record || record.expiresAt < new Date()) {
            throw new CustomErrorClass('OTP is invalid or expired', 403);
        }
        if (record) {
            const verifyTeacher = await this.otpRepository.verifyTeacher(email);
            await this.otpRepository.deleteOtp(email); // Move delete here to ensure it's deleted after successful verification
            return verifyTeacher;
        }
    }
}

export default new OtpService();
