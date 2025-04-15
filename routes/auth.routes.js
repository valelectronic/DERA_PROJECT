import express from 'express';
import { signUp,logIn,logOut } from '../controllers/auth.controller.js';


const router = express.Router();

router.get("/signUp",signUp);
router.get("/logIn",logIn);
router.get("/logOut",logOut);


export default router;
