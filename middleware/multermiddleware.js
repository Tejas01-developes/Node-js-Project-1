import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';


dotenv.config();


const storage=multer.diskStorage({
destination:(req,file,cb)=>cb(null,'upload/'),
filename:(req,file,cb)=>
    cb(Date.now() + path.extname(file.originalname))
})

const filefilter=(req,file,cb)=>{
const allowed=/pdf|jpg|jpeg|png/;
const ext=allowed.test(path.extname(file.originalname).toLowerCase);
if(ext) cb(null,true);
else cb("file is not among the allowed types")
}

const uploadfile=multer({
storage,
limits:(5 * 1024 * 1024),
filefilter


})
export default uploadfile;