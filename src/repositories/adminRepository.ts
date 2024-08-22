import Teacher from '../models/Teacher';
import Student from '../models/Student';
import { CustomError,CustomErrorClass } from '../types/CustomError';

interface PaginatedResult<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

class adminRepository {
  async dashboard() {
    const currentDate = new Date();
    const fourMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 4));
  
    // Calculate the count of students who joined in the past 4 months
    const studentData = await Student.aggregate([
      { $match: { is_verified: true, Joined: { $gte: fourMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: "$Joined" }, year: { $year: "$Joined" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
  
    // Calculate the count of teachers who joined in the past 4 months
    const teacherData = await Teacher.aggregate([
      { $match: { Is_verified: true, JoinedDate: { $gte: fourMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: "$JoinedDate" }, year: { $year: "$JoinedDate" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
  

  
    const data: { name: string; Students: number; Teachers: number }[] = [];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Populate the data array
for (let i = 0; i < 4; i++) {
  const studentMonthData = studentData[i] || { count: 0, _id: { month: (new Date().getMonth() + 1) - i } };
  const teacherMonthData = teacherData[i] || { count: 0, _id: { month: (new Date().getMonth() + 1) - i } };
  data.push({
    name: months[studentMonthData._id.month - 1],
    Students: studentMonthData.count,
    Teachers: teacherMonthData.count
  });
}

// Sort the data array by month in ascending order
data.sort((a, b) => {
  const monthIndexA = months.indexOf(a.name);
  const monthIndexB = months.indexOf(b.name);
  return monthIndexA - monthIndexB;
});



  
 
    return {
      StudentsCount:studentData,
      TeacherCount:teacherData,
      CharData:data
    }
  }
  
  // student repo part------------------------

  async getVerifiedStudents(page: number, pageSize: number): Promise<PaginatedResult<any>> {
    try {
      const skip = (page - 1) * pageSize;
      const totalItems = await Student.countDocuments({ is_verified: true }).exec();
      const totalPages = Math.ceil(totalItems / pageSize);

      const students = await Student.find({ is_verified: true })
        .skip(skip)
        .limit(pageSize)
        .exec();

      return {
        data: students,
        currentPage: page,
        totalPages,
        totalItems,
      };
    } catch (error) {
      const customError = error as CustomError;
      throw new CustomErrorClass(customError.message, 500);
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

  async getVerifiedTeachers(page: number, pageSize: number): Promise<PaginatedResult<any>> {
    try {
      const skip=(page-1) *pageSize
      const totalItems= await Teacher.countDocuments({Is_verified:true}).exec();
      const totalPages=Math.ceil(totalItems/pageSize)

      const teacher=await Teacher.find({Is_verified:true})
      .skip(skip).
      limit(pageSize)
      .exec()

      return { data:teacher,
      currentPage:page,
      totalPages,
      totalItems
     }

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
