import mongoose, { Schema, Document } from 'mongoose';
import { IChat }   from '../types/CommonTypes'



const ChatSchema: Schema = new Schema(
  {
    message: { type: String, required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'Student', required: true },  // Refers to the 'User' model
    group: { type: Schema.Types.ObjectId, ref: 'Classroom', required: true },  // Refers to the 'Group' model
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IChat>('Chat', ChatSchema);
