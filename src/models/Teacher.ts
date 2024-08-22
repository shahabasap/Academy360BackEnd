import mongoose, { Document, Schema } from "mongoose";

export interface ITeacher extends Document {
    username: string;
    name: string;
    gender?: 'Male' | 'Female';
    phone?: number;
    password?: string;
    JoinedDate?: Date;
    classrooms?: mongoose.Schema.Types.ObjectId[];
    LastUpdation?: Date;
    Is_block: boolean;
    photo?: string;
    qualification?: string;
    Experience?: Experience[];
    Is_verified: boolean;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: number | null;
    isGoogleSign?: boolean;  // Updated type to boolean
    role: string;
    
}

type Experience = {
    ExperiencedInstitute?: string;
    yearOfExperiencefrom?: Date;
    yearOfExperienceTo?: Date;
}


const TeacherSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: false },
    phone: { type: Number, required: false },
    password: { type: String, required: false },
    JoinedDate: { type: Date, default: Date.now },
    classrooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' }],
    LastUpdation: { type: Date, default: Date.now },
    Is_block: { type: Boolean, default: false },
    photo: { type: String, required: false },
    qualification: { type: String, required: false },
    Experience: [
        {
            ExperiencedInstitute: { type: String, required: false },
            yearOfExperiencefrom: { type: Date, required: false },
            yearOfExperienceTo: { type: Date, required: false }
        }
    ],
    Is_verified: { type: Boolean, default: false },
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpires: { type: Date, required: false },
    isGoogleSign: { type: Boolean, default: false },  // Updated type to boolean
    role: { type: String, default: "Teacher" }
});

const Teacher = mongoose.model<ITeacher>('Teacher', TeacherSchema);

export default Teacher;
