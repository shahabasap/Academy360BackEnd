import ClassroomRepository from '../repositories/ClassroomRepository';
import StudentRepository from '../repositories/studentRepository';
import { CustomErrorClass } from "../types/CustomError";
import { IClassroom, StudentData, ClassCreating } from '../types/CommonTypes';
import mongoose from 'mongoose';
import generateClassroomId from '../utils/classroomid';
import { studentInvitationMail } from '../utils/email';
import IClassroomRepository from '../interfaces/repository/IclassroomRepo';  // Import the interface
import IStudentRepository from '../interfaces/repository/IstudentRepo';      // Import the interface

class ClassroomService {
  private classroomRepository: IClassroomRepository;
  private studentRepository: IStudentRepository;

  constructor(
  ) {
    this.classroomRepository = ClassroomRepository;
    this.studentRepository = StudentRepository;
  }

  async createClassroom(data: ClassCreating) {
    const randomClassroomId = await generateClassroomId();
    data.classroomid = randomClassroomId;
    return await this.classroomRepository.createClassroom(data);
  }

  async fetchTeacherClassrooms(id: string) {
    return await this.classroomRepository.findTeacherClassrooms(id);
  }

  async fetchStudentClassrooms(id: string) {
    return await this.studentRepository.findStudentClassrooms(id);
  }

  async fetchClassroom(id: string) {
    const classroom = await this.classroomRepository.findById(id as any);
    if (!classroom) {
      throw new CustomErrorClass("Such classroom not found", 404);
    }
    return classroom;
  }

  async isLocked(classroomId: string, studentId: string) {
    const classroom = await this.classroomRepository.findById(classroomId as any);
    if (!classroom) {
      throw new CustomErrorClass("Such classroom not found", 404);
    }

    const student = await this.studentRepository.findStudentById(studentId as any);
    if (!student) {
      throw new CustomErrorClass("User not found", 404);
    }

    const studentData = await this.studentRepository.findClassroomIsLocked(studentId, classroomId);
    return studentData.classrooms[0].IsLocked;
  }

  // Teacher adding student to classroom
  async addStudent(classroomid: mongoose.Types.ObjectId, studentid: mongoose.Types.ObjectId) {
 
    const student = await this.studentRepository.findStudentById(studentid );
    if (!student) {
      throw new CustomErrorClass("Such student data not found", 404);
    }

    const isInClassroom = await this.classroomRepository.findClassroomWithStudent(classroomid, studentid);
    if (isInClassroom) {
      throw new CustomErrorClass("Student is already in your classroom", 409);
    }

    const studentIdWithStatus: StudentData = { studentid, isVerified: true };
    const updateResult = await this.classroomRepository.addStudentToClassroom(classroomid, studentIdWithStatus);
      
    if (updateResult.modifiedCount > 0) {
      const classroom = await this.classroomRepository.findClassroom(classroomid);
      if (classroom) {
       
        const teacherName = classroom.teacherid && 'name' in classroom.teacherid
          ? classroom.teacherid.name
          : 'Unknown';

        const data = {
          studentId: student._id,
          studentname: student.name,
          email: student.username,
          classroomId: classroom._id,
          subject: classroom.subject,
          teacherName,
        };

        const updateStudentClassroomBucket = await this.studentRepository.addClassroomToBucket(classroom._id as string, student._id as string);
        console.log("modifies",updateStudentClassroomBucket)
        if (updateStudentClassroomBucket.modifiedCount <= 0) {
          throw new CustomErrorClass("Student bucket is not updated", 204);
        }
        console.log("alwaye working")
        await studentInvitationMail(data);

      }

      return { message: `${student.name} added to your classroom. Invitation sent to ${student.username}` };
    } else {
      throw new CustomErrorClass("Classroom not found or student already in classroom", 404);
    }
  }

  // Searching student for adding and inviting to classroom
  async searchStudents(data: { username: string; classroomid: mongoose.Types.ObjectId }, page: number, limit: number) {
    const JoinedStudents = await this.classroomRepository.getStudentIdsByClassroomId(data.classroomid);
    return await this.classroomRepository.searchStudents(data, JoinedStudents, page, limit);
  }

  async teacherJoin(data: { classroomid: mongoose.Types.ObjectId; teacherid: mongoose.Types.ObjectId }) {
    const isBlock = await this.classroomRepository.findIsBlocked(data.classroomid);
    if (isBlock) {
      throw new CustomErrorClass('Classroom is blocked by admin', 404);
    }

    const classroom = await this.classroomRepository.findClassroomByTeacherAndId(data);
    if (!classroom) {
      throw new CustomErrorClass('Classroom not found.', 404);
    }

    if (classroom.Is_blocked) {
      throw new CustomErrorClass('Teacher is blocked by the admin.', 403);
    }

    return classroom;
  }

  // Add classrooms to students bucket list
  async addClassroom(data: { classroomid: string; studentid: string }) {
    try {
      let { classroomid, studentid } = data;
      const firstChar = classroomid.slice(0, 1);
      if (firstChar !== "#" && firstChar) {
        const classroom = await this.classroomRepository.findById(classroomid as any);
        if (!classroom) {
          throw new CustomErrorClass('Classroom not found.', 404);
        }
        classroomid = classroom.classroomid;
      }

      // Check if classroom exists
      const classroom = await this.classroomRepository.findByClassId(classroomid);
      if (!classroom) {
        throw new CustomErrorClass('Classroom not found.', 404);
      }

      // Check if the student is suspended or does not have access to the classroom
      const isVerified = await this.classroomRepository.findIsValidStudentClassId(classroomid, studentid);
      if (!isVerified) {
        throw new CustomErrorClass('You are suspended or do not have access to the classroom.', 403);
      }

      // Check if classroom is already in the student's list
      const IsLocked = await this.studentRepository.classroomAlreadyExists(classroom._id as string, studentid);
      if (!IsLocked) {
        throw new CustomErrorClass('This classroom is already in your list.', 409);
      }

      // Update the student's profile with the new classroom
      const updateResult = await this.studentRepository.updateStudentProfile(classroom._id as string, studentid);
      if (!updateResult || updateResult.nModified <= 0) {
        throw new CustomErrorClass('Failed to update the classroom in your profile.', 500);
      }

      return { message: "Classroom added to your list" };
    } catch (error) {
      if (error instanceof CustomErrorClass) {
        throw error;
      }
      throw new CustomErrorClass('An unexpected error occurred.', 500);
    }
  }

  async studentJoinToClassroom(data: { classroomid: string; studentid: string }) {
    const { classroomid, studentid } = data;
    const isBlock = await this.classroomRepository.findIsBlocked(classroomid as any);
    if (isBlock) {
      throw new CustomErrorClass('Classroom is blocked by admin');
    }

    const student = await this.classroomRepository.findStudentById(classroomid, studentid);
    if (!student) {
      throw new CustomErrorClass('You are suspended or do not have access to the classroom.', 403);
    }

    const isExist = await this.studentRepository.classroomAlreadyExists(classroomid, studentid);
    if (isExist) {
      throw new CustomErrorClass('This classroom is not yet unlocked.', 409);
    }

    return student;
  }
}

export default new ClassroomService;
