import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

const verifytoken=(req,resp,next)=>{

const accesstoken=req.cookies.accesstoken;
const refreshtoken=req.cookies.refreshtoken;



    

    if(!accesstoken){
     return   resp.status(400).json({message:"token is not avalible"})

    }
    try{
    const avalible=jwt.verify(accesstoken,process.env.ACCESSSECRET);
    req.user=avalible;
    req.role=avalible.role;
        return next();
    
    
    }catch(err){

        console.log("accesstoken expired or invalid",err)

    }
        if(!refreshtoken){
           return resp.status(400).json({message:"refresh token missing"})
        }
        try{
        const refreshavalible=jwt.verify(refreshtoken,process.env.REFRESHSECRET);
        
        const newaccesstoken=jwt.sign(
            {id:refreshavalible._id,
                role:refreshavalible.role
            },
            process.env.ACCESSSECRET,
            {expiresIn:"15m"}
        )

        resp.cookie("newtoken",newaccesstoken,{
            httpOnly:true,
            secure:true,
            sameSite:"strict"
})

req.gettoken=refreshavalible;
return next();


    }catch(err){
console.log("refresh token invalid",err);
 resp.status(400).json({message:"invalid refresh token log in again"})

    }
     const isAdmin=(req,resp,next)=>{
        if(req.role !== "ADMIN"){
            resp.status(400).send("only admin is allowed")
        }
        resp.status(200).send("Admin welcome")
        next();
        }
      


    

}
export default verifytoken;



    