import mongoose, { Document, Schema } from "mongoose";
import { ITeacher } from '../types/CommonTypes';

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
    proof: { type: String, required: false },
    qualification: { type: String, required: false },
    experiences: [
        {
            institute: { type: String, required: false },
            yearFrom: { type: Date, required: false },
            yearTo: { type: Date, required: false }
        }
    ],
    graduation: {
        college: { type: String, required: false },
        course: { type: String, required: false },
        yearFrom: { type: Date, required: false },
        yearTo: { type: Date, required: false },
    },
    postGraduation: {
        college: { type: String, required: false },
        course: { type: String, required: false },
        yearFrom: { type: Date, required: false },
        yearTo: { type: Date, required: false },
    },
    ugCertificate: { type: String, required: false },
    pgCertificate: { type: String, required: false },
    Is_verified: { type: Boolean, default: false },
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpires: { type: Date, required: false },
    isGoogleSign: { type: Boolean, default: false },  
    Approvel: {
        isApproved: { type: Boolean, default: false },
        message: { type: String,default: null},
    },
    role: { type: String, default: "teacher" },
});

const Teacher = mongoose.model<ITeacher>('Teacher', TeacherSchema);

export default Teacher;
