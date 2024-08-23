import mongoose,{Document,Types} from 'mongoose'
import Otp from '../models/Otp';

// Admin Types--
export default interface IAdmin extends Document{

    username:string,
    password :string,
    
    
    }
// Student Types--------
    export interface IStudent extends Document{
        name:string,
        username:string,
        gender ?:string,
        password ? :string ,
        Phone ?:number,
        Joined:Date,
        Is_block:boolean,
        photo ?:string,
        is_verified:boolean,
        class_id ?:mongoose.Schema.Types.ObjectId,
        isGoogleSign?:boolean,
        resetPasswordToken?:string | null,
        resetPasswordExpires?:number |null,
        role: string
        
        
        }   

//  Teacher types-----------------------------------------

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


// classroom-------------------------------
export interface IClassroom extends Document {
    subject: string;
    classroomid:string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    teacherid ? :mongoose.Types.ObjectId;
    students ?:StudentData[];
    examsid ?:mongoose.Types.ObjectId[];
    materialsid ?:mongoose.Types.ObjectId[];
    worksid ?:mongoose.Types.ObjectId[];
    announcementsid ?:mongoose.Types.ObjectId[];
  
  }

  export type StudentData={
    studentid:mongoose.Types.ObjectId;
    IsAdded:boolean
  }

//   Otp-------------------------
export interface Iotp extends Document {
    email: string;
    otp: number;
    expiresAt: Date;
}
