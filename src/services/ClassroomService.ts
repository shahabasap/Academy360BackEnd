import ClassroomRepository from '../repositories/ClassroomRepository';
import { CustomErrorClass } from "../types/CustomError";
import { IClassroom, StudentData ,ClassCreating} from '../types/CommonTypes';
import mongoose from 'mongoose';
import generateClassroomId from '../utils/classroomid';
import { studentInvitationMail } from '../utils/email';
import studentRepository from '../repositories/studentRepository';
import Student from '../models/Student';

class ClassroomService {
  async createClassroom(data: ClassCreating) {
    const randomClassroomId = await generateClassroomId();
  
    data.classroomid = randomClassroomId;

    const classroom = await ClassroomRepository.createClassroom(data);
    return { message: 'Classroom created successfully', classroom };
  }

  async fetchTeacherClassrooms(id: string) {
    const classrooms = await ClassroomRepository.findTeacherClassrooms(id);
    return classrooms;
  }
  
  async fetchStudentClassrooms(id: string) {
    const classrooms = await studentRepository.findStudentClassrooms(id);
    return classrooms;
  }

  async  addStudent(classroomid: mongoose.Types.ObjectId, studentid: mongoose.Types.ObjectId) {
    const student = await ClassroomRepository.findStudentById(studentid);
    if (!student) {
        throw new CustomErrorClass("Such student data not found", 404);
    }

    const isInClassroom = await ClassroomRepository.findClassroomWithStudent(classroomid, studentid);
    if (isInClassroom) {
        throw new CustomErrorClass("Student is already in your classroom", 409);
    }

    const studentIdWithStatus: StudentData = { studentid, IsAdded: true };
    const updateResult = await ClassroomRepository.addStudentToClassroom(classroomid, studentIdWithStatus);

    if (updateResult.modifiedCount > 0) {
        const classroom = await ClassroomRepository.findClassroom(classroomid);
        if (classroom) {
            // Type guard to ensure teacherid is populated
            const teacherName = classroom.teacherid && 'name' in classroom.teacherid
                ? classroom.teacherid.name
                : 'Unknown';

            const data = {
                studentname: student.name,
                email: student.username,
                classroomId: classroom.classroomid,
                subject: classroom.subject, // Assuming subject is used for this
                teacherName
            };

            await studentInvitationMail(data);
        }

        return { message: `${student.name} added to your classroom ,Invitation Sented to ${student.username}` };
    } else {
        throw new CustomErrorClass("Classroom not found or student already in classroom", 404);
    }
}

// Serching student for adding and inviting to classroom-----------------
async searchStudents(data:{username:string,classroomid:string},page:number,limit:number){
     const JoinedStudents=await ClassroomRepository.getStudentIdsByClassroomId (data.classroomid)
     const students= await ClassroomRepository.searchStudents(data,JoinedStudents,page,limit)
     return students
}

  async teacherJoin(data: { classroomid: mongoose.Types.ObjectId, teacherid: mongoose.Types.ObjectId }) {
    const classroom = await ClassroomRepository.findClassroomByTeacherAndId(data);

    if (!classroom) {
      throw new CustomErrorClass('Classroom not found.', 404);
    }

    if (classroom.Is_blocked) {
      throw new CustomErrorClass('Teacher is blocked by the admin.', 403);
    }

    return classroom;
  }

  async joinClassroom(data: { classroomid: string, studentid: string }) {
    const { classroomid, studentid } = data;
  
    // Check if the student is suspended or does not have access to the classroom
    const notAdded = await ClassroomRepository.findIsValidStudent(classroomid, studentid);
    if (notAdded) {
      throw new CustomErrorClass('You are suspended or do not have access to the classroom.', 403);  // 403 is typically used for forbidden actions
    }
  
    // Find the classroom by the generated ID
    const classroom = await ClassroomRepository.findClassroomRandomGenarateId(classroomid, studentid);
    if (!classroom) {
      throw new CustomErrorClass('Classroom not found.', 404);
    }
  
    // Check if the classroom is already in the student's list
    const isExist = await studentRepository.classroomAlreadyExist(classroom._id as string, studentid);
    if (isExist) {
      throw new CustomErrorClass('This classroom is already in your list.', 409);  // 409 Conflict is suitable here
    }
  
    // Update the student's profile to associate them with the classroom
    const student = await studentRepository.UpdateStudentProfile(classroom._id as string, studentid);
    if (!student) {
      throw new CustomErrorClass('Your classroom was not updated.', 500);
    }
  
    // Return a success message
    return { message: "Classroom added to your list" };
  }
  

}

export default new ClassroomService();
