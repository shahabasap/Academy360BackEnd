import nodemailer from 'nodemailer';
import { CustomError } from '../types/CustomError';

export const generateOtp = (): number => {
    return Math.floor(1000 + Math.random() * 9000);
}

export const sendEmail = async (email: string, otp: number): Promise<void> => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`
        };

        await transporter.sendMail(mailOptions);

    } catch (error) {
        const customError = error as CustomError;
        console.error(`Failed to send email: ${customError.message}`);
        throw new Error(`Node Error: ${customError.message}`);
    }
}
