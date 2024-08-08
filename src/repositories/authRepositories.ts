import Teacher from '../models/Teacher';
import Student,{IStudent} from '../models/Student';
import { CustomError,CustomErrorClass } from '../types/CustomError';


class AuthRepository {
    // admin login----------
    async Adminlogin(data: { username: string; password: string }) {
        try {
             const username=process.env.AdminMail
             const password=process.env.Password
             const AdminKey=process.env.AdminKey
          
           if(data.username==username && data.password==password)
           {
            console.log("skdfksdjf")
            return {username:username,secretKey:AdminKey}
           }
           
           throw new CustomErrorClass("Email and Password  is not match",401);
           
          
        } catch (error) {
            const customError=error as CustomError
            throw new CustomErrorClass(customError.message, 500)
        }
    }
    // Teacher Repo-------

    async TeacherLogin(data: { username: string; password: string }) {
        try {
            
            const user = await Teacher.findOne({ username: data.username }).exec();
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
    
           const user=await Student.findOne({username:data.username}).exec();
           return user
          
        } catch (error) {
            const customError=error as CustomError
            throw new CustomErrorClass(customError.message, 500)
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
   
    
}


export default new AuthRepository();
