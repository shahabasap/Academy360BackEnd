
import authRepositories from "../repositories/authRepositories";
import AuthUtilities from "../utils/AuthUtilities";
import {ITeacher} from "../models/Teacher";
import {IStudent} from "../models/Student";
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
  async TeacherSignIn(data:{username:string,password:string}) {
    const teacher = await authRepositories.TeacherLogin(data);
    
    if (!teacher || teacher instanceof CustomErrorClass) {
      throw new CustomErrorClass("Email and Password is not match", 401);
    }
      const comparePassword=await AuthUtilities.comparePassword(data.password,teacher.password)
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
    type Datatype = Pick<ITeacher, 'username' | 'password' | 'name'>;
    const updatedData: Datatype = { ...data };
     updatedData.password =await AuthUtilities.getHashedPassword(data.password)
    const teacher = await authRepositories.AddNewTeacher(updatedData);

    if (teacher instanceof CustomErrorClass) {
      throw teacher;
  }
    return teacher

  }

  // Student Service-----------------------------------------

  async SignUp(data:{name:string,username:string,password:string}) {
    type Datatype = Pick<IStudent, 'username' | 'password' | 'name'>;
    const updatedData: Datatype = { ...data };
    updatedData.password =await AuthUtilities.getHashedPassword(data.password)
    const student = await authRepositories.AddNewStudent(updatedData);
    if (student instanceof CustomErrorClass) {
      throw student;
  }
    return student

  }
  async SignIn(data:{username:string,password:string}) {
    const student = await authRepositories.login(data);
    if (student && typeof student !== 'string') {
      const comparePassword=await AuthUtilities.comparePassword(data.password,student.password)
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
  // google authentication-
  async findOrCreateUser(profile: any): Promise<IStudent> {
    let user = await authRepositories.findByGoogleId(profile.id);

    if (!user) {
      const newUser: Partial<IStudent> = {
        googleId: profile.id,
        username: profile.emails[0].value,
        name: profile.displayName,
      };

      user = await authRepositories.create(newUser);
    }

    return user;
  }

  async findUserById(id: string): Promise<IStudent | null> {
    return authRepositories.findById(id);
  }
 
  
}

export default new authService();