import auth from '../middleware/middleware.js';
import document from '../middleware/multermiddleware.js';
import dotenv from 'dotenv';
import express from 'express';
import  {  deleteuserinfo, forgotpassword, login, logout, register, renderdelete, renderhome, renderlogin, renderregister, resetpage, resettoken } from '../controller/controller.js';
import  { deletedocuments, uploaddocument, viewfiles } from '../controller/doccontroller.js';
dotenv.config();

const router=express.Router();





router.get('/',renderregister);
router.post('/register',register);


router.get('/login',renderlogin);
router.post('/login',login);


router.get('/home',auth.verifytoken,renderhome);

router.post('/logout',auth.verifytoken,logout);


router.post('/forgot',resettoken);

router.get('/resetpage/:token',resetpage);
router.post('/resetpage/:token',forgotpassword);

router.get('/delete',auth.verifytoken,renderdelete);
router.post('/delete',auth.verifytoken,deleteuserinfo);


router.post('/upload',auth.verifytoken,auth.isAdmin,document,uploaddocument);
router.get('/view',auth.verifytoken,document,viewfiles)
router.delete('/deletedoc/:id',auth.verifytoken,auth.isAdmin,document,deletedocuments)

export default router;
