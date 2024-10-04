// models/Group.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  members: Schema.Types.ObjectId[];
  createdAt: Date;
}

const GroupSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    admin:{ type: Schema.Types.ObjectId, ref: 'Teacher' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IGroup>('Group', GroupSchema);
