
import authRepositories from "../repositories/authRepositories";
import AuthUtilities from "../utils/AuthUtilities";
import {ITeacher} from '../types/CommonTypes'
import IStudent from '../types/CommonTypes'
import { CustomErrorClass } from "../types/CustomError";







class authService {
  // admin Services----------------
  async AdminSignIn(data:{username:string,password:string}) {
    const admin = await authRepositories.Adminlogin(data);
    if (!admin || admin instanceof CustomErrorClass) {
      throw new CustomErrorClass("Email and Password is not match", 401);
    }
    const comparePassword=await AuthUtilities.comparePassword(data.password,admin.password)
      if(comparePassword)
      {
        return admin
      }
      else
      {
         throw new CustomErrorClass("Email and Password   is not match",401);
         
      }

  }

  // Teacher Services-----
  async TeacherIsBlocked(studentid:string) {
    const student = await authRepositories.TeacherIsBlocked(studentid)
    if(student)
    {
     return {valid:true}
    }
    else
    {
    return {valid:false,message:"User is blocked"}

    }
}

  async TeacherSignIn(data:{username:string,password:string}) {
    const teacher = await authRepositories.TeacherLogin(data);
    
    if (!teacher || teacher instanceof CustomErrorClass) {
      throw new CustomErrorClass("Email and Password is not match", 401);
    }
      const comparePassword=await AuthUtilities.comparePassword(data.password,teacher.password as string)
      if(comparePassword)
      {
        return teacher
      }
      else
      {
         throw new CustomErrorClass("Email and Password   is not match",401);
         
      }

 

  }
 
  async TeacherSignUp(data:{name:string,username:string,password:string}) {
  
    const updatedData = { ...data };
     updatedData.password =await AuthUtilities.getHashedPassword(data.password)
    const teacher = await authRepositories.AddNewTeacher(updatedData);

    if (teacher instanceof CustomErrorClass) {
      throw teacher;
  }
    return teacher

  }
  async TeacherForgotpassword(username:string) {
    const response=await authRepositories.sendTeacherResetPasswordEmail(username)
    return response
}

async TeacherResetPassword(token: string, newPassword: string) {
    const response=await authRepositories.resetTeacherPassword(token, newPassword)
    return response
}


  // Student Service-----------------------------------------

  async SignUp(data:{name:string, username:string, password:string}) {
   
    
    const updatedData = { ...data};
    updatedData.password =await AuthUtilities.getHashedPassword(data.password)
    const student = await authRepositories.AddNewStudent(updatedData);
    if (student instanceof CustomErrorClass) {
      throw student;
    }
    return student;
  }
  async StudentIsBlocked(studentid:string) {
         const student = await authRepositories.StudentIsBlocked(studentid)
         if(student)
         {
          return {valid:true}
         }
         else
         {
         return {valid:false,message:"User is blocked"}

         }
  }


  
  async SignIn(data:{username:string,password:string}) {
    const student = await authRepositories.login(data);
    if (student && typeof student !== 'string') {
      const comparePassword=await AuthUtilities.comparePassword(data.password,student.password as string)
      if(comparePassword)
      {
        return student
      }
      else
      {
         throw new CustomErrorClass("Email and Passwor   is not match",401 );
         
      }

    }
    else{
      throw new CustomErrorClass("Email and Password  is not match",401 );
      
    }
 

  }
  async forgotpassword(username:string) {
       const response=await authRepositories.sendStudentResetPasswordEmail(username)
       return response
  }

  async resetPassword(token: string, newPassword: string) {
       const response=await authRepositories.resetStudentPassword(token, newPassword)
       return response
  }
  async googleAuth(data:any) {
       const response=await authRepositories.AddUser(data)
       return response
  }


  
 
  
}

export default new authService();