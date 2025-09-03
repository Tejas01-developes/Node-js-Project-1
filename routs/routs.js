import auth from '../middleware/middleware.js';
import document from '../middleware/multermiddleware.js';
import dotenv from 'dotenv';
import express from 'express';
import  {  deleteuserinfo, forgot, forgotpassword, login, logout, register, renderdelete, renderforgot, renderhome, renderlogin, renderregister, resetpage } from '../controller/controller.js';
import  { deletedocuments, uploaddocument, viewfiles } from '../controller/doccontroller.js';
dotenv.config();

const router=express.Router();





router.get('/',renderregister);
router.post('/register',register);


router.get('/login',renderlogin);
router.post('/login',login);


router.get('/home',auth.verifytoken,renderhome);

router.get('/logout',auth.verifytoken,logout);

router.get('/forgot',renderforgot);
router.post('/forgot-password',forgot);

router.get('/reset/token',resetpage);
router.post('/resetpage/token',forgotpassword);

router.get('/deleteaccount',auth.verifytoken,renderdelete);
router.post('/delete',auth.verifytoken,deleteuserinfo);



router.post('/upload',auth.verifytoken,document.single("document"),uploaddocument);
router.get('/view',auth.verifytoken,viewfiles)
router.delete('/deletedoc/:id',auth.verifytoken,auth.isAdmin,deletedocuments)


export default router;
