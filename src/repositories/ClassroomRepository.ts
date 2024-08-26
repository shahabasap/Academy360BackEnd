import mongoose from 'mongoose';
import Classroom from '../models/Classroom';
import Student from '../models/Student';
import { CustomErrorClass } from '../types/CustomError';
import { IClassroom, StudentData,IStudent,ClassCreating} from '../types/CommonTypes';

class ClassroomRepository {
  async createClassroom(data: ClassCreating): Promise<IClassroom> {
    const { subject, teacherid } = data;
    const subjectRegex = new RegExp(`^${subject}$`, 'i');
    const existingClassroom = await Classroom.findOne({ subject: subjectRegex, teacherid });

    if (existingClassroom) {

      throw new CustomErrorClass('A classroom with this subject already exists for you.', 409);
    }

    const newClassroom = await Classroom.create(data);
    return newClassroom;
  }

  async findTeacherClassrooms(id: string): Promise<IClassroom[]> {
    const classrooms = await Classroom.find({ teacherid: id }).exec();
    return classrooms;
  }

  async findStudentById(studentid: mongoose.Types.ObjectId): Promise<IStudent | null> {
    const student = await Student.findById(studentid);
    return student;
  }

  async findClassroomById(classroomid: mongoose.Types.ObjectId): Promise<IClassroom | null> {
    const classroom = await Classroom.findById(classroomid);
    return classroom;
  }

  async findClassroomWithStudent(classroomid: mongoose.Types.ObjectId, studentid: mongoose.Types.ObjectId): Promise<IClassroom | null> {
    const classroom = await Classroom.findOne({ _id: classroomid, 'students.studentid': studentid });
    return classroom;
  }

  async findClassroom(classroomid: mongoose.Types.ObjectId): Promise<IClassroom | null> {
    const classroom = await Classroom.findOne({ _id: classroomid}).populate('teacherid');
    return classroom;
  }

  async addStudentToClassroom(classroomid: mongoose.Types.ObjectId, studentData: StudentData): Promise<any> {
    const updateResult = await Classroom.updateOne(
      { _id: classroomid },
      { $addToSet: { students: studentData } }
    );
    return updateResult;
  }

  async findClassroomByTeacherAndId(data: { classroomid: mongoose.Types.ObjectId, teacherid: mongoose.Types.ObjectId }): Promise<IClassroom | null> {
    const { classroomid, teacherid } = data;
    const classroom = await Classroom.findOne({ _id: classroomid, teacherid });
    return classroom;
  }
  
   async getStudentIdsByClassroomId (classroomid: string): Promise<string[] | null>  {

      // Find the classroom by classroomid
      const classroom = await Classroom.findOne({ _id:classroomid }).exec();
      
      // Map to get only the student IDs
      const studentIds =classroom && classroom.students ? (classroom.students.map(student => student.studentid.toString())) :null
  
      return studentIds;
    
  };
 
  
  

// Searching students by username-----------
async searchStudents(
  data: { username: string | null; classroomid: string },
  Students: null | string[],
  page: number,
  limit: number
): Promise<{ Students: any[]; StudentCount: number }> {
  const { username, classroomid } = data;

  // Initialize the query object
  const query: any = {  }; // Assuming you want to filter by classroomid

  // If username is not null, add partial match condition
  if (username) {
    query.username = { $regex: username, $options: 'i' }; // Case-insensitive partial match
  }

  // Add condition to exclude students whose IDs are in the Students array
  if (Students && Students.length > 0) {
    query._id = { $nin: Students };
  }

  // Pagination logic
  const skip = (page - 1) * limit;


  // Count the total number of students matching the query
  const studentCount = await Student.countDocuments(query);

  // Fetch the matching students from the database
  const studentsData = await Student.find(query, { _id: 0, username: 1, name: 1 })
    .skip(skip)
    .limit(limit)
    .exec();

  return { Students: studentsData, StudentCount: studentCount };
}

  
  
}

export default new ClassroomRepository();
