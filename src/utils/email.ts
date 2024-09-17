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
        const {studentId,studentname, email, classroomId, subject, teacherName } = data;

        // Define the email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Invitation to Join Classroom',
            html: `
                <p>Hello ${studentname},</p>
        
                <p>You have been invited to join a new classroom.</p>
        
                <p><strong>Classroom Subject:</strong> ${subject}</p>
                <p><strong>Teacher:</strong> ${teacherName}</p>
        
                <p>Your classroom Id is ${classroomId}.</p>
                <p><a href="http://localhost:5173/unlock-classroom/?classroomid=${classroomId}&studentid=${studentId}">Click here</a> to unlock the classroom.</p>
        
                <p><strong style="font-size: 1.2em;">Important:</strong> Please login to your account before using the link.</p>
                <p>Please use this classroom id to join the classroom, and never miss it.</p>
        
                <p>Best regards,</p>
                <p>The Classroom Team</p>
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