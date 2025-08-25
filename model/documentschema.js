import mongoose from 'mongoose';



const documentschema= new mongoose.Schema({
user:{type:mongoose.Schema.Types.ObjectId,ref:"adddocuments",required:true},
fileName: { type: String, required: true },
filePath: { type: String, required: true },
originalName: { type: String, required: true },
uploadedAt: { type: Date, default: Date.now }
})

export default mongoose.model("documents",documentschema);