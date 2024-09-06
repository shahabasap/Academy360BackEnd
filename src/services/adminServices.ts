import adminRepository from "../repositories/adminRepository";
import ClassroomRepository from "../repositories/ClassroomRepository";

import { CustomErrorClass } from "../types/CustomError";





class adminServices {
  // admin--------------------
  
  async dashboardData() {
    const dashboard = await adminRepository.dashboard();
  return dashboard

  }
  // classroom Services-------------------
  async fetchClassrooms(page: number, pageSize: number) {
    return await ClassroomRepository.fetchClassrooms(page, pageSize);
  }
  
  async classroomBlock(id: string) {
    const result = await ClassroomRepository.blockClassroom(id);
  
    if (result.modifiedCount > 0) {
      return true;
    } else {
      throw new Error("Failed to block the classroom.");
    }
  }
  
  async classroomUnblock(id: string) {
    const result = await ClassroomRepository.unblockClassroom(id);
  
    if (result.modifiedCount > 0) {
      return true;
    } else {
      throw new Error("Failed to unblock the classroom.");
    }
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
  
  async rejectTeacher(id: string, reason: string) {
    const result = await adminRepository.rejectTeacher(id, reason);

    if (result.modifiedCount < 1) {  // Checking if no documents were modified
        throw new Error(`Failed to reject teacher with ID ${id}. No documents were updated.`);
    }

    return result;
}

async approveTeacher(id: string) {
    const result = await adminRepository.approveTeacher(id);

    if (result.modifiedCount < 1) {  // Checking if no documents were modified
        throw new Error(`Failed to approve teacher with ID ${id}. No documents were updated.`);
    }

    return result;
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