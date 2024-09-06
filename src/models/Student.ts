import mongoose,{Schema} from 'mongoose'
import {IStudent} from '../types/CommonTypes'


const StudentSchema:Schema=new Schema({
    name:{type:String,require:true},
    password:{type:String,required:false},
    username:{type:String,require:true},
    gender:{type:String,require:false},
    phone:{type:Number,require:false},
    Joined: { type: Date, default: Date.now },
    Is_block:{type:Boolean,default:false},
    photo:{type:String,require:false},
    is_verified:{type:Boolean,default:false},
    classrooms:[{type:mongoose.Schema.Types.ObjectId,ref:'Classroom'}],
    isGoogleSign: {type:String,default:false,require:false},
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpires: { type: Date, required: false },
    role:{type:String,default:"Student"}
    
})

const Student=mongoose.model<IStudent>('Student',StudentSchema)
export default Student;