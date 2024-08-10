import Teacher from '../models/Teacher';
import Student,{IStudent} from '../models/Student';
import { CustomError,CustomErrorClass } from '../types/CustomError';
import Admin from '../models/admin';
import nodemailer from 'nodemailer'
import crypto from 'crypto';
import AuthUtilities from '../utils/AuthUtilities';


class AuthRepository {
    // admin login----------
    async Adminlogin(data: { username: string; password: string }) {
        try {
             const admin=await Admin.findOne({username:data.username})
             return admin
        } catch (error) {
            const customError=error as CustomError
            throw new CustomErrorClass(customError.message, 500)
        }
    }
    // Teacher Repo-------

    async TeacherLogin(data: { username: string; password: string }) {
        try {
            
            const user = await Teacher.findOne({ username: data.username,Is_verified:true,Is_block:false }).exec();
            return user;
          
        } catch (error) {
            const customError=error as CustomError
             throw new CustomErrorClass(customError.message, 500)
        }
    }
    async AddNewTeacher(data: { name: string; username: string; password: string }) {
        try {
            const TeacherExist= await Teacher.findOne({username:data.username})
            if(TeacherExist)
            {
                throw new CustomErrorClass("Username is already exists",409);
                
            }
            const newTeacher = new Teacher(data);
            await newTeacher.save();
            return newTeacher;
        } catch (error) {
            const customError=error as CustomError
            throw new CustomErrorClass(customError.message, 500)
        }
    }
     // Generate and send password reset token for Teacher
     async sendTeacherResetPasswordEmail(username: string) {
        try {
            const teacher = await Teacher.findOne({ username });
            if (!teacher) throw new CustomErrorClass("Teacher not found", 404);

            const resetToken = this.generateResetToken();
            teacher.resetPasswordToken = resetToken.token;
            teacher.resetPasswordExpires = resetToken.expires;
            await teacher.save();

            await this.sendResetEmail(teacher.username, resetToken.token, 'Teacher');

        } catch (error) {
            const customError = error as CustomError;
            throw new CustomErrorClass(customError.message, 500);
        }
    }
    // Reset password for Teacher
    async resetTeacherPassword(token: string, newPassword: string) {
        try {
            const updatedPassword=await AuthUtilities.getHashedPassword(newPassword)
            const teacher = await Teacher.findOne({ 
                resetPasswordToken: token, 
                resetPasswordExpires: { $gt: Date.now() } 
            });
            if (!teacher) throw new CustomErrorClass("Token is invalid or has expired", 400);

            teacher.password = updatedPassword;  
            teacher.resetPasswordToken = undefined;
            teacher.resetPasswordExpires = undefined;
            await teacher.save();

        } catch (error) {
            const customError = error as CustomError;
            throw new CustomErrorClass(customError.message, 500);
        }
    }


    // Student repo---------------------

    async AddNewStudent(data: { name: string; username: string; password: string }) {
        try {
            const StudentExist= await Student.findOne({username:data.username})
            if(StudentExist)
            {
                throw new CustomErrorClass("Username is already exists",409);
                
            }
            const newStudent = new Student(data);
            await newStudent.save();
            return newStudent;
        } catch (error) {
            const customError=error as CustomError
            throw new CustomErrorClass(customError.message, 500)
        }
    }
    async login(data: { username: string; password: string }) {
        try {
    
           const user=await Student.findOne({username:data.username,Is_block:false,is_verified:true}).exec();
           return user
          
        } catch (error) {
            const customError=error as CustomError
            throw new CustomErrorClass(customError.message, 500)
        }
    }

    // Generate and send password reset token for Student
    async sendStudentResetPasswordEmail(username: string) {
        try {
            const student = await Student.findOne({ username });
            if (!student) throw new CustomErrorClass("Student not found", 404);

            const resetToken = this.generateResetToken();
            student.resetPasswordToken = resetToken.token;
            student.resetPasswordExpires = resetToken.expires;
            await student.save();

            await this.sendResetEmail(student.username, resetToken.token, 'Student');

        } catch (error) {
            const customError = error as CustomError;
            throw new CustomErrorClass(customError.message, 500);
        }
    }
    // Reset password for Student
    async resetStudentPassword(token: string, newPassword: string) {
        try {
            const updatedPassword=await AuthUtilities.getHashedPassword(newPassword)
            const student = await Student.findOne({ 
                resetPasswordToken: token, 
                resetPasswordExpires: { $gt: Date.now() } 
            });
            if (!student) throw new CustomErrorClass("Token is invalid or has expired", 400);
           
            student.password = updatedPassword;  
            student.resetPasswordToken = undefined;
            student.resetPasswordExpires = undefined;
            await student.save();

        } catch (error) {
            const customError = error as CustomError;
            throw new CustomErrorClass(customError.message, 500);
        }
    }


    // google user Auth----------------------
    async findByGoogleId(googleId: string): Promise<IStudent | null> {
        return Student.findOne({ googleId });
      }
    
      async create(user: Partial<IStudent>): Promise<IStudent> {
        return Student.create(user);
      }
    
      async findById(id: string): Promise<IStudent | null> {
        return Student.findById(id);
      }
   
    



private generateResetToken() {
    const token = crypto.randomBytes(20).toString('hex');
    const expires = Date.now() + 3600000; // 1 hour
    return { token, expires };
}

private async sendResetEmail(username: string, token: string, role: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    const resetLink = `http://yourfrontend.com/reset-password/${token}`;
    const mailOptions = {
        to: username,
        from: 'no-reply@yourapp.com',
        subject: `Password Reset for ${role}`,
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetLink}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
}
}
export default new AuthRepository();
