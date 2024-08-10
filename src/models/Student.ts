import mongoose,{Document,Schema} from 'mongoose'

export interface IStudent extends Document{
name:string,
username:string,
gender ?:string,
password :string,
Phone ?:number,
Joined:Date,
Is_block:boolean,
photo ?:string,
is_verified:boolean,
class_id ?:mongoose.Schema.Types.ObjectId,
googleId?:string,
resetPasswordToken?:string | null,
resetPasswordExpires?:number |null


}
const StudentSchema:Schema=new Schema({
    name:{type:String,require:true},
    password:{type:String,required:true},
    username:{type:String,require:true},
    gender:{type:String,require:false},
    Phone:{type:Number,require:false},
    Joined: { type: Date, default: Date.now },
    Is_block:{type:Boolean,default:false},
    photo:{type:String,require:false},
    is_verified:{type:Boolean,default:false},
    class_id:{type:mongoose.Schema.Types.ObjectId,ref:'Classroom',required:false},
    googleId: {type:String,require:false},
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpires: { type: Date, required: false },
})

const Student=mongoose.model<IStudent>('Student',StudentSchema)
export default Student;