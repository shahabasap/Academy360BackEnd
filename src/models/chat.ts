import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  message: string;
  sender: mongoose.Types.ObjectId; // User reference (now an ObjectId)
  group: mongoose.Types.ObjectId;  // Group reference (now an ObjectId)
  createdAt: Date;
}

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
