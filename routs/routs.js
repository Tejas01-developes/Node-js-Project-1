import authentication from '../middleware/middleware.js';
import dotenv from 'dotenv';
import express from 'express';
import  {  forgotpassword, login, logout, register, renderhome, renderlogin, renderregister, resetpage, resettoken } from '../controller/controller.js';
import  { deletedocuments, uploaddocument, viewfiles } from '../controller/doccontroller.js';
dotenv.config();

const router=express.Router();





router.get('/register',renderregister);
router.post('/register',register);


router.get('/',renderlogin);
router.post('/login',login);

router.post('/logout',authentication,logout);


router.post('/forgot',resettoken)

router.get('/resetpage/:token',resetpage);
router.post('/resetpage/:token',forgotpassword);

router.get('/home',authentication,renderhome);


router.post('/upload',authentication,isAdmin,uploaddocument);
router.get('/view',authentication,viewfiles)


router.delete('/deletedoc/:id',authentication,deletedocuments)

export default router;
