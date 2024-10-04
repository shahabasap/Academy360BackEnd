import { PaginatedResult } from '../../types/CommonTypes';

interface IAdminRepository {
  // Dashboard
  dashboard(): Promise<{
    StudentsCount: any; 
    TeacherCount: any; 
    CharData: { name: string; Students: number; Teachers: number }[];
  }>;

  // Student-related methods
  getVerifiedStudents(page: number, pageSize: number): Promise<PaginatedResult<any>>;
  blockUser(id: string): Promise<any>;
  unblockUser(id: string): Promise<any>;

  // Teacher-related methods
  getVerifiedTeachers(page: number, pageSize: number): Promise<PaginatedResult<any>>;
  rejectTeacher(id: string, reason: string): Promise<any>;
  approveTeacher(id: string): Promise<any>;
  blockTeacher(id: string): Promise<any>;
  unblockTeacher(id: string): Promise<any>;
}

export default IAdminRepository;
