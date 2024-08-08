import mongoose, { Document, Schema } from "mongoose";

export interface ITeacher extends Document {
    username: string;
    name: string;
    gender ?: 'Male' | 'Female';
    phone ?: number;
    password : string;
    JoinedDate?: Date;
    classrooms ?: mongoose.Schema.Types.ObjectId[];
    LastUpdation ?: Date;
    Is_block : boolean;
    photo ?: string;
    qualification ?: string;
    ExperiencedInstitute ?: string;
    yearOfExperiencefrom ?: Date;
    yearOfExperienceTo ?: Date;
    Is_verified: boolean;
}

const TeacherSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required:false },
    phone: { type: Number, required: false },
    password: { type: String, required: true },
    JoinedDate: { type: Date, default: Date.now },
    classrooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' }],
    LastUpdation: { type: Date, default: Date.now },
    Is_block: { type: Boolean, default: false },
    photo: { type: String,required: false},
    qualification: { type: String, required: false },
    ExperiencedInstitute: { type: String, required: false },
    yearOfExperiencefrom: { type: Date, required: false },
    yearOfExperienceTo: { type: Date, required: false },
    Is_verified: { type: Boolean, default: false }
});

 const Teacher = mongoose.model<ITeacher>('Teacher', TeacherSchema);

 export default Teacher
