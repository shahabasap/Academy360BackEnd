import ClassroomRepository from '../repositories/ClassroomRepository';
import { CustomErrorClass } from "../types/CustomError";
import { IClassroom, StudentData ,ClassCreating} from '../types/CommonTypes';
import mongoose from 'mongoose';
import generateClassroomId from '../utils/classroomid';
import { studentInvitationMail } from '../utils/email';
import studentRepository from '../repositories/studentRepository';


class ClassroomService {
  async createClassroom(data: ClassCreating) {
    const randomClassroomId = await generateClassroomId();
  
    data.classroomid = randomClassroomId;

    const classroom = await ClassroomRepository.createClassroom(data);
    return classroom
  }

  async fetchTeacherClassrooms(id: string) {
    const classrooms = await ClassroomRepository.findTeacherClassrooms(id);
    return classrooms;
  }
  
  async fetchStudentClassrooms(id: string) {
    const classrooms = await studentRepository.findStudentClassrooms(id);
    return classrooms;
  }
  async fetchClassroom(id: string) {
    const classrooms = await ClassroomRepository.findByid(id as any);
    if (!classrooms) {

        throw new CustomErrorClass("Such classroom not found", 404);
    }
    return classrooms;
  }


  async isLocked(classroomId:string,studentId:string) {
    const classrooms = await ClassroomRepository.findByid(classroomId as any);
    if (!classrooms) {

        throw new CustomErrorClass("Such classroom not found", 404);
    }
    const student =await studentRepository.findStudentById(studentId as any)
    if (!student) {

      throw new CustomErrorClass("user not found", 404);
  }
    const studentData = await studentRepository.findClassroomIsLocked(studentId as string,classroomId as string)
    console.log("data",studentData)
    return studentData.classrooms[0].IsLocked
  }

//  Teacher adding student to classroomm--------------

  async  addStudent(classroomid: mongoose.Types.ObjectId, studentid: mongoose.Types.ObjectId) {
    const student = await studentRepository.findStudentById(studentid);
    if (!student) {
        throw new CustomErrorClass("Such student data not found", 404);
    }

    const isInClassroom = await ClassroomRepository.findClassroomWithStudent(classroomid, studentid);
    if (isInClassroom) {
        throw new CustomErrorClass("Student is already in your classroom", 409);
    }

    const studentIdWithStatus: StudentData = { studentid, isVerified: true };
    const updateResult = await ClassroomRepository.addStudentToClassroom(classroomid, studentIdWithStatus);

    if (updateResult.modifiedCount > 0) {
        const classroom = await ClassroomRepository.findClassroom(classroomid);
        if (classroom) {
            // Type guard to ensure teacherid is populated
            const teacherName = classroom.teacherid && 'name' in classroom.teacherid
                ? classroom.teacherid.name
                : 'Unknown';

            const data = {
                studentId:student._id,
                studentname: student.name,
                email: student.username,
                classroomId: classroom._id,
                subject: classroom.subject, // Assuming subject is used for this
                teacherName
            };
            const updateStudentClassroomBucket= await studentRepository.addClaroomToBucket(classroom._id as string,student._id as string) 
            if (updateStudentClassroomBucket.modifiedCount <= 0)
            {
                 throw new CustomErrorClass("Student bucket is not updated",204)
            }

            await studentInvitationMail(data);
        }

        return { message: `${student.name} added to your classroom ,Invitation Sented to ${student.username}` };
    } else {
        throw new CustomErrorClass("Classroom not found or student already in classroom", 404);
    }
}

// Serching student for adding and inviting to classroom-----------------
async searchStudents(data:{username:string,classroomid:mongoose.Types.ObjectId},page:number,limit:number){
     const JoinedStudents=await ClassroomRepository.getStudentIdsByClassroomId (data.classroomid)
     const students= await ClassroomRepository.searchStudents(data,JoinedStudents,page,limit)
     return students
}

  async teacherJoin(data: { classroomid: mongoose.Types.ObjectId, teacherid: mongoose.Types.ObjectId }) {
    const isBlock=await ClassroomRepository.findIsBocked(data.classroomid);
    if(isBlock)
    {
      throw new CustomErrorClass('Classroom is blocked by admin', 404);
    }
    const classroom = await ClassroomRepository.findClassroomByTeacherAndId(data);

    if (!classroom) {
      throw new CustomErrorClass('Classroom not found.', 404);
    }

    if (classroom.Is_blocked) {
      throw new CustomErrorClass('Teacher is blocked by the admin.', 403);
    }

    return classroom;
  }
  // Add classrooms to students bucket list---------

  async addClassroom(data: { classroomid: string, studentid: string }) {
    try {
        let { classroomid, studentid } = data;
         const firstChar=classroomid.slice(0,1)
         if(firstChar !=="#" && firstChar)
         {
          const classroom = await ClassroomRepository.findByid(classroomid as any);
          if(!classroom)
          {
            throw new CustomErrorClass('Classroom not found.', 404);  // Classroom does not exist
          }
          classroomid=classroom?.classroomid
         }
         // Check if classroom exists
         const classroom = await ClassroomRepository.findByClassId(classroomid as any);
         if (!classroom) {
             throw new CustomErrorClass('Classroom not found.', 404);  // Classroom does not exist
         }
        // Check if the student is suspended or does not have access to the classroom
        const isVerified = await ClassroomRepository.findIsValidStudentClassId(classroomid, studentid);
        if (!isVerified) {
            throw new CustomErrorClass('You are suspended or do not have access to the classroom.', 403);  // Forbidden action
        }

        // Check if classroom is already in the student's list
        const IsLocked = await studentRepository.classroomAlreadyExist(classroom._id as string, studentid);
        if (!IsLocked) {
            throw new CustomErrorClass('This classroom is already in your list.', 409);  // Conflict
        }
 
        // Update the student's profile with the new classroom
        const updateResult = await studentRepository.UpdateStudentProfile(classroom._id as string, studentid);
        // Check if the update was successful
        if (!updateResult || updateResult.nModified <= 0) {
            throw new CustomErrorClass('Failed to update the classroom in your profile.', 500);  // Internal server error
        }

        // Return success message
        return { message: "Classroom added to your list" };

    } catch (error) {
        // Catch any unexpected errors and handle them properly
        if (error instanceof CustomErrorClass) {
          console.log(error)
            throw error;  // Re-throw custom error
        }
        console.log(error)
        // Handle any other unexpected errors (e.g., database or network errors)
        throw new CustomErrorClass('An unexpected error occurred.', 500);
    }
}

  
  async studentJoinToClassroom(data: { classroomid: string,studentid: string }) {
    const { classroomid, studentid } = data;
    const isBlock=await ClassroomRepository.findIsBockedForStudent(data.classroomid);
    if(isBlock)
    {
      throw new CustomErrorClass('Classroom is blocked by admin');
    }

    // Check if the student is suspended or does not have access to the classroom
    const student = await ClassroomRepository.findStudentById(classroomid, studentid);
    if (!student) {
        throw new CustomErrorClass('You are suspended or do not have access to the classroom.', 403); // 403 is typically used for forbidden actions
    }

    // Check if the classroom is in the student's classroom list
    const isExist = await studentRepository.classroomAlreadyExist(classroomid, studentid);
    if (isExist) {
        throw new CustomErrorClass('This classroom is not yet unlocked.', 409); // 409 Conflict is suitable here
    }

   

    return student;
}
  

}

export default new ClassroomService();
