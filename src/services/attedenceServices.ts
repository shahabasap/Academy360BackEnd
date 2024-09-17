import mongoose from "mongoose";
import attendenceRepositories from "../repositories/attendenceRepositories";
import attendence from "../repositories/attendenceRepositories";
import ClassroomRepository from "../repositories/ClassroomRepository";
import { CustomErrorClass } from "../types/CustomError";
import studentRepository from "../repositories/studentRepository";

class AttendenceServices {
  async DayAttendence(data: { classroomid: mongoose.Types.ObjectId }) {
    const { classroomid } = data;

    const StudentsInClassroom =
      await ClassroomRepository.getStudentIdsByClassroomId(classroomid);
    if (!StudentsInClassroom) {
      throw new CustomErrorClass("No Students in your classroom", 404);
    }

    const attedenceList = await attendenceRepositories.getAttendenceByClassId(
      classroomid
    );

    if (!attedenceList) {
     
      const createAttendenceList =
        await attendenceRepositories.createAttendenceList(
          classroomid,
          StudentsInClassroom
        );
      if (createAttendenceList) {
        return createAttendenceList;
      }
    } else {
      if (
        attedenceList.AttedenceDataSet.length !== StudentsInClassroom.length
      ) {
        const updateAttendenceList =
          await attendenceRepositories.updateNewJoinees(
            classroomid,
            StudentsInClassroom
          );
      }
    }
    const attendance = await attendenceRepositories.getAttendenceByClassId(
      classroomid
    );
    return attendance;
  }

  // Marking Attendence----------------------

  async MarkAttendence(data: {
    classroomid: mongoose.Types.ObjectId;
    attendenceListId: mongoose.Types.ObjectId;
    studentid: mongoose.Types.ObjectId;
  }) {
    const { classroomid, attendenceListId, studentid } = data;
    console.log("data", data);
    const student = await studentRepository.findStudentById(
      studentid as mongoose.Types.ObjectId
    );

    if (!student) {
      throw new CustomErrorClass("User is not found", 404);
    }

    const classroom = await ClassroomRepository.findByid(classroomid);

    if (!classroom) {
      throw new CustomErrorClass("Classroom is not found", 404);
    }

    const attendanceRecord = await attendenceRepositories.findByIdStudentId(
      attendenceListId,
      studentid
    );
    if (!attendanceRecord) {
      throw new Error("Attendance record not found");
    }
    const currentStatus = attendanceRecord?.AttedenceDataSet[0].status;

    // Determine the new status
    const newStatus = currentStatus === "Present" ? "Absent" : "Present";

    const updatedResult = await attendenceRepositories.updateStudentAttendence(
      attendenceListId,
      studentid,
      newStatus
    );

    return updatedResult;
  }

  async AttendanceHistory(classroomId: string, date: string) {
    try {

      const dateObject = new Date(date);
      if (isNaN(dateObject.getTime())) {
        throw new Error("Invalid Date format");
      }
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Set current date to midnight

      // Set the dateObject to midnight for accurate comparison
      const comparisonDate = new Date(dateObject);
      comparisonDate.setHours(0, 0, 0, 0); // Normalize the time to 00:00:00
      // Prevent accessing today's attendance
      if (comparisonDate.getTime() === currentDate.getTime()) {
        throw new Error("Today's attendance cannot be accessed.");
      }

      // Convert classroomId to a MongoDB ObjectId
      const classroomObjectId = new mongoose.Types.ObjectId(classroomId);

      // Fetch attendance record by classroomId and date
      const attendanceRecord =
        await attendenceRepositories.findByClassroomIdAndDate(
          classroomId,
          comparisonDate
        );

      // Check if attendance record exists
      if (!attendanceRecord) {
        throw new Error("Attendance record not found");
      }

      return attendanceRecord;
    } catch (error) {
      // Assert that the error is of type `Error`
      if (error instanceof Error) {
        throw new Error(`1Failed to fetch data: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }
}

export default new AttendenceServices();
