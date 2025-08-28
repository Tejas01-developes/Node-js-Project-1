import Document from '../model/documentschema.js';
import dotenv from 'dotenv';
import fs from 'fs'
import path from 'path'

dotenv.config();

export const uploaddocument=(req,resp)=>{
try{
    if(!req.files){
        resp.status(400).send("no file uploaded")
    }

    const documents=new Document({
        user:req.user.id,
        fileName:req.file.orignalname,
        filePath:req.file.path
        })

documents.save();
}catch(err){
    console.log(err)
   return resp.status(400).send("upload document failed")
}

}


export const viewfiles=(req,resp)=>{
    try{
        const doc=Document.find({user:req.user.id})
        if(!doc){

         return   resp.status(400).send("user id does not exist")
}

   return  resp.status(200).json(doc)

    }catch(err){

        return resp.status(400).send("cannot view documents")
    }
    }

export const deletedocuments=async(req,resp)=>{
try{
const find=Document.find({_id:req.params.id,user:req.user.id});

if(!find){
return resp.status(400).send("unable to find documents")

}
fs.unlink(path.resolve(req.filepath))
await find.deleteOne();
return resp.status(200).send("deletation successfull")
}catch(err){

console.log(err)
resp.status(400).json({message:"document can not be deleted"})

}





}

