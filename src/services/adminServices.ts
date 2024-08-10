import adminRepository from "../repositories/adminRepository";

import { CustomErrorClass } from "../types/CustomError";





class teacherService {
//  Student Services------------------

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
  async block(id:string) {
    const isBlocked = await adminRepository.blockUser(id);
  return isBlocked

  }
  async unblock(id:string) {
    const isUnblocked = await adminRepository.unblockUser(id);
    

    return isUnblocked

  }
  // Techer Services------------------------

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

async teacherblock(id:string) {
  const isBlocked = await adminRepository.blockTeacher(id);
return isBlocked

}
async teacherunblock(id:string) {
  const isUnblocked = await adminRepository.unblockTeacher(id);
  

  return isUnblocked

}
}
export default new teacherService();