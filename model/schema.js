import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

 const schema=mongoose.Schema({
username :{type:String,required:true,unique:true,trim: true},
email :{type:String,required:true,unique:true,lowercase: true},
password:{type:String,required:true},
role:{type:String,required:true,enum:["USER","ADMIN"]},
resettoken: { type: String }, 
resetExpiry: { type: Date },
refreshnewtoken:{type:String} 
},{timestamps:true})
export default mongoose.model("adddocuments",schema);