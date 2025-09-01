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

        
    export const renderdelete=(req,resp)=>{

        return resp.render('deleteaccount')
         
         }
         
         export const renderreset=(req,resp)=>{

            return resp.render('forgot')
             
             }
         




export const register=async(req,resp)=>{

const {username,email ,role,password}=req.body

if(!username || !email || !password | !role){

    console.log("every filed should be filled compulsary")
}
const exist =await schema.findOne({email});

if(exist){
    return  resp.status(400).send("email is already registered")
}

const hash=await bcrypt.hash(password,10);
const createuser=await schema.create({username,email,role,password:hash});
try{
  

 await sendemails.sendmail(email,"welcome to our page be connected")
}catch(err){



}
  resp.redirect('/login');

}






export const login=async(req,resp)=>{
    try{
    const{email,password}=req.body;

    const exist=await schema.findOne({email});
    if  (!exist ||  !await bcrypt.compare(password,exist.password)){

        return   resp.status(400).send("provided credincials are not correct")

    }
const accesstokens=json.sign({id:exist._id,role:exist.role},process.env.ACCESSSECRET,{expiresIn:"15m"});
exist.accesstoken=accesstokens
const refreshtoken=json.sign({id:exist._id,role:exist.role},process.env.REFRESHSECRET,{expiresIn:"7d"})
exist.refreshnewtoken=refreshtoken;

resp.cookie("accesstoken",accesstokens,{
httpOnly:true,
secure:true,
sameSite:"strict"
})

resp.cookie("refreshtoken",refreshtoken,{
    httpOnly:true,
    secure:true,
    sameSite:"strict"   



})


return resp.redirect('/home')



    }catch(err){
        console.log(err);
       return resp.status(400).send("login process failed")
    }

}







export const logout=(req,resp)=>{
    try{
resp.cookie("accesstoken",null,{
    httpOnly:true,
    secure:true,
    expiresIn:'0',
    sameSite:"strict" 
})
resp.cookie("refreshtoken",{
    httpOnly:true,
    secure:true,
    sameSite:"strict" 
})

return resp.redirect('/login')

    }catch(err){
return resp.status(400).json({message:"logout failed"})
}
}


export const deleteuserinfo=async(req,resp)=>{
    try{
const{email}=req.body;
const find=await schema.findOne({email});
if(!find){
    return resp.status(400).send("email is not registered")
}

await schema.deleteOne({email});
return resp.redirect('/');

    }catch{
        resp.status(400).send("can not delete user")
    }
}








export const resettoken=async(req,resp)=>{
  
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
try{
await sendemails.sendmail(email,`reset link has been sent to your email ${resetlink}` )
}catch(err){
console.log(err)
return resp.status(400).send("resent token generetion failed") 
}
}









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
   return resp.redirect("/login")
    }catch(err){
console.log(err)
return resp.status(400).send("forgot password failed")

    }


}














