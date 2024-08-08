import mongoose, { Document, Schema } from 'mongoose';

interface IClassroom extends Document {
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClassroomSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Classroom = mongoose.model<IClassroom>('Classroom', ClassroomSchema);
export default Classroom;
