import nodemailer from 'nodemailer';
import { CustomError } from '../types/CustomError';
import { IStudent } from '../types/CommonTypes';

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
export const studentInvitationMail = async (data: any): Promise<void> => {
    try {
        // Create the transporter object using SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        // Destructure the data object
        const {studentname, email, classroomId, subject, teacherName } = data;

        // Define the email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Invitation to Join Classroom',
            text: `
                Hello ${studentname},

                You have been invited to join a new classroom.

                Classroom Subject: ${subject}
                Teacher: ${teacherName}

                Your classroom Id is ${classroomId}.

                Please use this classroom id to join the session,never missout it.

                Best regards,
                The Classroom Team
            `
        };

        // Send the email
        await transporter.sendMail(mailOptions);

    } catch (error) {
        // Handle any errors
        const customError = error as Error;
        console.error(`Failed to send email: ${customError.message}`);
        throw new Error(`Node Error: ${customError.message}`);
    }
};