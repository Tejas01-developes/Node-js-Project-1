import bcrypt from 'bcrypt';
import schema from '../model/schema.js';
import dotenv from 'dotenv';
import sendemails from '../email/email.js';
import json from 'jsonwebtoken';
import {randomUUID} from 'crypto';

dotenv.config();

export const renderregister=(req,resp)=>{

 return resp.render('register')

}




export const renderlogin=(req,resp)=>{

   return resp.render('login')
    
    }



    export const renderhome=(req,resp)=>{

       return resp.render('home')
        
        }




export const register=async(req,resp)=>{
try{
const {username,email ,password}=req.body

if(!username || !email || !password){

    console.log("every filed should be filled compulsary")
}
const exist =await schema.findOne({email});

if(exist){
    return  resp.status(400).send("email is already registered")
}

const hash=await bcrypt.hash(password,10);
const createuser=await schema.create({username,email,password:hash});
createuser.save();
resp.redirect('/login')

 await sendemails.sendmail(email,"welcome to our page be connected")


}catch(err){

    return resp.status(400).send("entire registration process failed");
}
}






export const login=async(req,resp)=>{
    try{
    const{email,password}=req.body;

    const exist=await schema.findOne({email});
    if  (!exist ||  !await bcrypt.compare(password,exist.password)){

        return   resp.status(400).send("provided credincials are not correct")

    }
const accesstoken=json.sign({id:exist._id},process.env.ACCESSSECRET,{expiresIn:"15m"});
exist.access=accesstoken
const refreshtoken=json.sign({id:exist._id},process.env.REFRESHSECRET,{expiresIn:"7d"})
exist.refreshtoken=refreshtoken;

resp.cookie("token",accesstoken,{
httpOnly:true,
secure:true,
sameSite:"strict"
})

resp.cookie("refreshtoken",refreshtoken,{
    httpOnly:true,
    secure:true,
    sameSite:"strict"   



})

return resp.status(200).send("login succesfull")


    }catch(err){
        console.log(err);
       return resp.status(400).send("login process failed")
    }

}







export const logout=(req,resp)=>{
    try{
resp.cookie("token"," ",{
    httpOnly:true,
    secure:true,
    sameSite:"strict" 
})
 resp.status(200).json({message:"logout succesfull"})
return resp.redirect('/login')

    }catch(err){
return resp.status(400).json({message:"logout failed"})
}
}






export const resettoken=async(req,resp)=>{
    try{
const {email}=req.body;

const exist =await schema.findOne({email});

if(!exist){
    return resp.status(400).json({message:"email is not registered"})
}
const token=randomUUID();
exist.resettoken=await bcrypt.hash(token,10);
exist.resetExpiry=Date.now() + 3600000
 await exist.save();
 resp.redirect("/login")

const resetlink=`http://${req.headers.host}/reset/${token}`;
await sendemails.sendmail(email,`reset link has been sent to your email ${resetlink}` )
}catch(err){
console.log(err)
return resp.status(400).send("resent token generetion failed") 
}
}








// export const forgotpassword=async(req,resp)=>{
//     try{
// const {token}=req.params
// const check=await schema.findOne({resettoken:token,tokenExpiry:{$gt:Date.now()}})
// if(!check){
// return resp.status(400).json({message:"token is not orignal"})
// }
// return resp.redirect('reset',token);


// }catch(err){

// console.log(err)
// return resp.status(400).json({message:"reset failed"})

// }
// }

export const resetpage=async(req,resp)=>{
    try{
const {token}=req.params;

const user=await schema.findOne({resetExpiry:{$gt:Date.now()}});

if(!user || !bcrypt.compare(token, resettoken)){
    return resp.status(400).send( "Invalid or expired token" );
}
resp.render('reset',{token});


}catch (err) {
    console.log(err);
    return resp.status(400).json({ message: "Reset failed" });
  }

}















export const forgotpassword=async(req,resp)=>{
    try{
const{token}=req.params;
const{password}=req.body;
const check=await schema.findOne({resettoken:token,tokenExpiry:{$gt:Date.now()}});
if(!check){
   return  resp.status(400).send("token is not orignal")
    }
    const newpass=await bcrypt.hash(password,10);
    check.password=newpass;
    check.resettoken=undefined;
    check.tokenExpiry=undefined;
   await check.save();
    resp.redirect("/login")
    }catch(err){
console.log(err)
return resp.status(400).send("forgot password failed")

    }


}














