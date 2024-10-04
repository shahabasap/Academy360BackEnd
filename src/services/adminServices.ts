import IAdminRepository from '../interfaces/repository/IadminRepo';
import IClassroomRepository from '../interfaces/repository/IclassroomRepo';
import adminRepository from "../repositories/adminRepository";
import ClassroomRepository from "../repositories/ClassroomRepository";

class AdminServices {
  // Private members for repository interfaces
  private adminRepo: IAdminRepository;
  private classroomRepo: IClassroomRepository;

  constructor() {
    // Initialize private repository members
    this.adminRepo = adminRepository;
    this.classroomRepo = ClassroomRepository;
  }

  // Admin Services
  async dashboardData() {
    const dashboard = await this.adminRepo.dashboard();
    return dashboard;
  }

  // Classroom Services
  async fetchClassrooms(page: number, pageSize: number) {
    return await this.classroomRepo.fetchClassrooms(page, pageSize);
  }

  async classroomBlock(id: string) {
    const result = await this.classroomRepo.blockClassroom(id);

    if (result.modifiedCount > 0) {
      return true;
    } else {
      throw new Error("Failed to block the classroom.");
    }
  }

  async classroomUnblock(id: string) {
    const result = await this.classroomRepo.unblockClassroom(id);

    if (result.modifiedCount > 0) {
      return true;
    } else {
      throw new Error("Failed to unblock the classroom.");
    }
  }

  // Student Services
  async getVerifiedStudents(page: number, pageSize: number) {
    return await this.adminRepo.getVerifiedStudents(page, pageSize);
  }

  async block(id: string) {
    return await this.adminRepo.blockUser(id);
  }

  async unblock(id: string) {
    return await this.adminRepo.unblockUser(id);
  }

  // Teacher Services
  async getVerifiedTeachers(page: number, pageSize: number) {
    return await this.adminRepo.getVerifiedTeachers(page, pageSize);
  }

  async rejectTeacher(id: string, reason: string) {
    const result = await this.adminRepo.rejectTeacher(id, reason);

    if (result.modifiedCount < 1) {
      throw new Error(`Failed to reject teacher with ID ${id}. No documents were updated.`);
    }

    return result;
  }

  async approveTeacher(id: string) {
    const result = await this.adminRepo.approveTeacher(id);

    if (result.modifiedCount < 1) {
      throw new Error(`Failed to approve teacher with ID ${id}. No documents were updated.`);
    }

    return result;
  }

  async teacherBlock(id: string) {
    return await this.adminRepo.blockTeacher(id);
  }

  async teacherUnblock(id: string) {
    return await this.adminRepo.unblockTeacher(id);
  }
}

export default new AdminServices();
