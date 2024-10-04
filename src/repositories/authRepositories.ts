import Teacher from '../models/Teacher';
import Student from '../models/Student';
import {IStudent} from '../types/CommonTypes'
import { CustomError,CustomErrorClass } from '../types/CustomError';
import Admin from '../models/admin';
import nodemailer from 'nodemailer'
import crypto from 'crypto';
import AuthUtilities from '../utils/AuthUtilities';
import { trusted } from 'mongoose';
import Otp from '../models/Otp';
import IAuthRepository from '../interfaces/repository/IauthRepo';


class AuthRepository implements IAuthRepository {
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
    async TeacherIsBlocked(studentid:string){
        const student=await Teacher.findOne({ _id:studentid,Is_verified:true,Is_block:false }).exec();
        return student
    }


    async TeacherLogin(data: { username: string; password: string }) {
        try {
            const isBlock= await Teacher.findOne({username:data.username,Is_block:true})
            if(isBlock)
            {
                throw new CustomErrorClass("Your account is blocked", 403);
            }
            
            const user = await Teacher.findOne({ username: data.username,Is_verified:true,Is_block:false }).exec();
            return user;
          
        } catch (error) {
            const customError=error as CustomError
             throw new CustomErrorClass(customError.message, 500)
        }
    }
    async AddNewTeacher(data: { name: string; username: string; password: string }) {
        try {
            await Teacher.deleteOne({username:data.username,Is_verified:false})
            await Otp.deleteMany({email:data.username})
            
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
    async StudentIsBlocked(studentid:string){
        const student=await Student.findOne({_id:studentid,Is_block:false,is_verified:true}).exec();
        return student
    }
    
    async AddNewStudent(data: { name: string; username: string; password: string }) {
        try {

            await Student.deleteOne({username:data.username,is_verified:false})
            await Otp.deleteMany({email:data.username})

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
            
            const isBlock= await Student.findOne({username:data.username,Is_block:true})
            if(isBlock)
            {
                throw new CustomErrorClass("Your account is blocked", 403);
            }

    
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
      
    async AddUser(data: any) {
        try {
         
      
          if (data.role === "Student") {
            const iSbolock = await Student.findOne({ username: data.data.username, is_verified: true,Is_block:true});
            if (iSbolock) {
                throw new CustomErrorClass("User is blocked", 403);
            }

            const isCreated = await Student.findOne({ username: data.data.username, is_verified: true });
      
            if (isCreated) {
              return isCreated; // If the student already exists and is verified, return the existing student.
            } else {
              await Student.deleteOne({ username: data.data.username, is_verified: false }); // Remove unverified student entries.
      
              const createNewUser = await Student.create({
                username: data.data.username,
                name: data.data.name,
                is_verified: true,
                isGoogleSign:true
              });
      
              return createNewUser; // Return the newly created and verified student.
            }
          } else if (data.role === "Teacher") {
           
           const isBlocked=await Teacher.findOne({ username: data.data.username, Is_verified: true,Is_block:true });
           if (isBlocked) {
            throw new CustomErrorClass("User is blocked", 403);
           }
            const isCreated = await Teacher.findOne({ username: data.data.username, Is_verified: true });
      
            if (isCreated) {
              return isCreated; // If the teacher already exists and is verified, return the existing teacher.
            } else {
              await Teacher.deleteOne({ username: data.data.username, Is_verified: false }); // Remove unverified teacher entries.
      
              const createNewUser = await Teacher.create({
                username: data.data.username,
                name: data.data.name,
                Is_verified: true,
                isGoogleSign:true
              });
      
              return createNewUser; // Return the newly created and verified teacher.
            }
          } else {
            throw new Error("Invalid role specified");
          }
        } catch (error) {
          console.error("Error in AddUser:", error);
          throw error; // Re-throw the error so it can be handled by the caller.
        }
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
    let resetLink
  if(role=="Teacher")
  {
     resetLink = `http://localhost:5173/teacher/resetpassword/${token}`;
  }
  else
  {
     resetLink = `http://localhost:5173/resetpassword/${token}`;
  }
    
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
