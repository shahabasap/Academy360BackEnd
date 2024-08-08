import Teacher from '../models/Teacher';
import Student from '../models/Student';
import { CustomError,CustomErrorClass } from '../types/CustomError';


class adminRepository {
  async Students() {
    try {

        const StudentsData=await Student.find({is_verified:true}).exec()
        return StudentsData
    } catch (error) {
        const customError=error as CustomError
        throw new CustomErrorClass(customError.message, 500)
    }

  }
  async Teachers() {
    try {

        const TeacherData=await Teacher.find({Is_verified:true}).exec()
        return TeacherData
    } catch (error) {
        const customError=error as CustomError
        throw new CustomErrorClass(customError.message, 500)
    }
  }
}

export default new adminRepository();
