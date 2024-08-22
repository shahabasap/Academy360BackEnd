import adminRepository from "../repositories/adminRepository";

import { CustomErrorClass } from "../types/CustomError";





class adminServices {
  // admin--------------------
  
  async dashboardData() {
    const dashboard = await adminRepository.dashboard();
  return dashboard

  }
//  Student Services------------------

async getVerifiedStudents(page: number, pageSize: number) {
  return await adminRepository.getVerifiedStudents(page, pageSize);
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

  async getVerifiedTeachers(page:number,pageSize:number) {
  
    return  await adminRepository.getVerifiedTeachers(page,pageSize)

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
export default new adminServices();