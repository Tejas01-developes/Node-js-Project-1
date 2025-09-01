import path, { join,dirname } from 'path';
import { fileURLToPath } from "url";
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import ratelimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import rout from './routs/routs.js';
import cors from 'cors';



dotenv.config()
const app=express();



const __filename=fileURLToPath(import.meta.url);
const __dirname=dirname(__filename);


app.use(cookieParser());




app.use(helmet())


app.use(cors({origin:"",credentials:true}));
const limiter=ratelimit({
    windowMs:15 * 60 * 1000,
    max:100,
    message:"to many request from this ip please try again later"
})
app.use(limiter);




app.use(express.static(path.resolve(__dirname,'public')))
app.set('view engine','ejs')
app.set('views',path.resolve('views'));

app.use(express.urlencoded({extended:true}));
app.use(express.json());




app.use('/',rout);





 mongoose.connect(process.env.MONGO)
.then(()=>{


    app.listen(3000,()=>{


        console.log("serverstarted on port")

    })

})
.catch((err)=>{

    console.error("databse failed to connect",err);
})


