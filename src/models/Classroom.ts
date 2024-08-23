import mongoose,{Types , Document, Schema } from 'mongoose';
import {IClassroom} from '../types/CommonTypes'



const ClassroomSchema: Schema = new Schema({
  subject: { type: String, required: true },
  classroomid: { type: String, required: true },
  description: { type: String, required: true },
  teacherid: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  students: [{
    studentid: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: false },
    IsAdded: { type: Boolean, required: false, default: false }
  }],
  examsid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exams', required: false }],
  worksid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Works', required: false }],
  materialsid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Materials', required: false }],
  announcementsid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Announcements', required: false }]
}, { timestamps: true }); 

const Classroom = mongoose.model<IClassroom>('Classroom', ClassroomSchema);
export default Classroom;
