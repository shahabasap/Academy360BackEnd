import ClassroomRepository from '../repositories/ClassroomRepository';
import { CustomErrorClass } from "../types/CustomError";

class ClassroomService {
  async createClassroom(data: { name: string; description: string }) {
    console.log("start create in Service",data)
    // Business logic before creating a classroom
    if (!data.name || !data.description) {
      throw new CustomErrorClass('Name and description are required');
    }
 

    const classroom = await ClassroomRepository.createClassroom(data);
    return classroom;
  }

  async getClassroomById(id: string) {
    const classroom = await ClassroomRepository.findClassroomById(id);
    if (!classroom) {
      throw new CustomErrorClass('Classroom not found');
    }
    return classroom;
  }

  async getAllClassrooms() {
    const classrooms = await ClassroomRepository.findAllClassrooms();
    return classrooms;
  }

  async updateClassroom(id: string, data: { name?: string; description?: string }) {
    const classroom = await ClassroomRepository.findClassroomById(id);
    if (!classroom) {
      throw new CustomErrorClass('Classroom not found');
    }

    classroom.name = data.name || classroom.name;
    classroom.description = data.description || classroom.description;
    await classroom.save();

    return classroom;
  }

  async deleteClassroom(id: string) {
    const classroom = await ClassroomRepository.findClassroomById(id);
    if (!classroom) {
      throw new CustomErrorClass('Classroom not found');
    }

    await ClassroomRepository.deleteClassroom(id);
    return { message: 'Classroom deleted successfully' };
  }
}

export default new ClassroomService();
