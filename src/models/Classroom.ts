import mongoose,{Types , Document, Schema } from 'mongoose';

interface IClassroom extends Document {
  subject: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  teacher:string;
  studentsid ?:Types.ObjectId[];
  examsid ?:Types.ObjectId[];
  materialsid ?:Types.ObjectId[];
  worksid ?:Types.ObjectId[];
  announcementsid ?:Types.ObjectId[];

}






const ClassroomSchema: Schema = new Schema({
  subject: { type: String, required: true },
  description: { type: String, required: true },
  teacher: { type: String, required: true },
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
