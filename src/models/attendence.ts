import mongoose, { Schema} from 'mongoose';
import { IAttendance }   from '../types/CommonTypes'



const AttendanceSchema: Schema = new Schema({
  classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
  Date: { type: Date, required: true, default:Date.now() },
  AttedenceDataSet: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    status: { type: String, enum: ['Present', 'Absent'], required: true }
  }]
}, { timestamps: true });

// Create a unique index to ensure only one attendance record per day per classroom
AttendanceSchema.index({ classroomId: 1, Date: 1 }, { unique: true });

const Attendance = mongoose.model<IAttendance>('Attendance', AttendanceSchema);
export default Attendance;
