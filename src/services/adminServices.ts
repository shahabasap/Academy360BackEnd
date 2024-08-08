import adminRepository from "../repositories/adminRepository";

import { CustomErrorClass } from "../types/CustomError";





class teacherService {
 
  async Students() {
    const students = await adminRepository.Students();
    if(!students)
        {
            throw new CustomErrorClass("Students Not Found",400);
            
        }
      else if(students.length==0)  
      {
        throw new CustomErrorClass("Data Not Found",204);
      }

    return students

  }
  async Teachers() {
    const teachers = await adminRepository.Teachers();
    if(!teachers)
        {
            throw new CustomErrorClass("Teachers Not Found",400);
            
        }else if(teachers.length==0)  
            {
              throw new CustomErrorClass("Data Not Found",204);
            }
      
    return teachers

  }
}

export default new teacherService();