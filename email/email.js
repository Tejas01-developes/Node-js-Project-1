import email from 'nodemailer';
import dotenv from 'dotenv';


dotenv.config();


const createtransport=email.createTransport({
service:"gmail",
auth:{
user:process.env.EMAIL,
pass:process.env.EPASS
}
})


 const sendmail=async(to,subject,text)=>{
    try{
 await createtransport.sendMail({

from:process.env.EMAIL,
to,
subject,
text,
})

console.log(`email sent to ${to}`)

}catch(err){
console.log(`email falied to send to ${to}`,err);

}
}


export default sendmail;