import Teacher from '../models/Teacher';
import Student from '../models/Student';
import { CustomError,CustomErrorClass } from '../types/CustomError';


class adminRepository {
  // student repo part------------------------

  async Students() {
    try {

        const StudentsData=await Student.find({is_verified:true}).exec()
        return StudentsData
    } catch (error) {
        const customError=error as CustomError
        throw new CustomErrorClass(customError.message, 500)
    }

  }
  async blockUser(id:string) {
    try {

        const StudentsData=await Student.updateOne({_id:id},{Is_block:true})
        return StudentsData
    } catch (error) {
        const customError=error as CustomError
        throw new CustomErrorClass(customError.message, 500)
    }

  }
  async unblockUser(id:string) {
    try {

      const StudentsData=await Student.updateOne({_id:id},{Is_block:false})
        return StudentsData
    } catch (error) {
        const customError=error as CustomError
        throw new CustomErrorClass(customError.message, 500)
    }

  }

  // Teacher repo part------------------------

  async Teachers() {
    try {

        const TeacherData=await Teacher.find({Is_verified:true}).exec()
        return TeacherData
    } catch (error) {
        const customError=error as CustomError
        throw new CustomErrorClass(customError.message, 500)
    }
  }

  async blockTeacher(id:string) {
    try {

        const TeacherData=await Teacher.updateOne({_id:id},{Is_block:true})
        return TeacherData
    } catch (error) {
        const customError=error as CustomError
        throw new CustomErrorClass(customError.message, 500)
    }

  }
  async unblockTeacher(id:string) {
    try {

      const TeacherData=await Teacher.updateOne({_id:id},{Is_block:false})
        return TeacherData
    } catch (error) {
        const customError=error as CustomError
        throw new CustomErrorClass(customError.message, 500)
    }

  }
}

export default new adminRepository();
