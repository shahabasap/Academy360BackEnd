import mongoose,{Document,Types} from 'mongoose'
import Otp from '../models/Otp';
import Attendance from '../models/attendence';


export interface FileUpload {
  photo?: Express.Multer.File[];
  ugCertificate?: Express.Multer.File[];
  pgCertificate?: Express.Multer.File[];
}
// Admin Types--
export default interface IAdmin extends Document{

    username:string,
    password :string,
    role:string
    
    
    }
   type StudentClassrooms={
      classroomId:string,
      IsLocked:boolean
   } 
// Student Types--------
    export interface IStudent extends Document{
      _id ?:string,
        name:string,
        username:string,
        gender ?:string,
        password ? :string ,
        Phone ?:number,
        Joined:Date,
        Is_block:boolean,
        photo ?:string,
        is_verified:boolean,
        classrooms ?:StudentClassrooms[],
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
    proof?: string;
    graduation?: Graduation;
    postGraduation?: Graduation;
    experiences?: Experience[];
    Is_verified: boolean;
    ugCertificate?: string;
    pgCertificate?: string;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: number | null;
    isGoogleSign?: boolean;  
    role: string;
    Approval: ApprovelType;
    
}
type ApprovelType={
  isApproved:boolean,
  message:String |null
}

type Experience = {
  institute?: string;
  yearFrom?: Date;
  yearTo?: Date;
}

type Graduation = {
  college?: string;
  course?: string;
  yearFrom?: Date;
  yearTo?: Date;

}


// classroom-------------------------------
export interface PaginatedResult<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}
export interface IClassroom extends Document {
    subject: string;
    classroomid: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    teacherid?: ITeacher | mongoose.Types.ObjectId; // Can be an ITeacher object or an ID
    students?: StudentData[];
    examsid?: mongoose.Types.ObjectId[];
    materialsid?: mongoose.Types.ObjectId[];
    worksid?: mongoose.Types.ObjectId[];
    announcementsid?: mongoose.Types.ObjectId[];
    Is_blocked: boolean;
}
  export interface ClassCreating{
    subject: string;
    description: string;
    teacherid?: string; // Make it optional in case it's not always present
    classroomid?:string;
  }

  export type StudentData={
    studentid:mongoose.Types.ObjectId;
    isVerified:boolean
  }

//   Otp-------------------------
export interface Iotp extends Document {
    email: string;
    otp: number;
    expiresAt: Date;
}

// Attendance-------------------
export interface IAttendance extends Document {
  classroomId: Types.ObjectId;
  Date: Date;
  AttedenceDataSet: {
    studentId: Types.ObjectId;
    status: 'Present' | 'Absent';
  }[];
}
