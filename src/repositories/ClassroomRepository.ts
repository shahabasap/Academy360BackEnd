import Classroom from '../models/Classroom';

class ClassroomRepository {
  async createClassroom(data: { name: string; description: string }) {

    const classroom = new Classroom(data);
    await classroom.save();
    return classroom;
  }

  async findClassroomById(id: string) {
    return Classroom.findById(id);
  }

  async findAllClassrooms() {
    return Classroom.find();
  }

  async deleteClassroom(id: string) {
    return Classroom.findByIdAndDelete(id);
  }

  // Other repository methods...
}

export default new ClassroomRepository();
