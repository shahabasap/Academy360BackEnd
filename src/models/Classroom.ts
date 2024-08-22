import mongoose,{Types , Document, Schema } from 'mongoose';
import {IClassroom} from '../types/CommonTypes'



const ClassroomSchema: Schema = new Schema({
  subject: { type: String, required: true },
  description: { type: String, required: true },
  teacherid: {type:mongoose.Schema.Types.ObjectId,ref:'Teacher',require:true},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  studentsid:[{type:mongoose.Schema.Types.ObjectId,ref:'Student',require:false}],
  examsid:[{type:mongoose.Schema.Types.ObjectId,ref:'Exams',require:false}],
  worksid:[{type:mongoose.Schema.Types.ObjectId,ref:'Works',require:false}],
  materialsid:[{type:mongoose.Schema.Types.ObjectId,ref:'Materials',require:false}],
  announcementsid:[{type:mongoose.Schema.Types.ObjectId,ref:'Announcements',require:false}],

});

const Classroom = mongoose.model<IClassroom>('Classroom', ClassroomSchema);
export default Classroom;
