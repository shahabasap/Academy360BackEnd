import mongoose,{Document,Schema} from 'mongoose'
import IAdmin from '../types/CommonTypes'




const AdminSchema:Schema=new Schema({
    username:{type:String,require:true},
    password:{type:String,required:true},
    role: { type: String, default: "admin" },
  
    
})

const Admin=mongoose.model<IAdmin>('Admin',AdminSchema)
export default Admin;