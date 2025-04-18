import express from 'express';
import { signUp,logIn,logOut } from '../controllers/auth.controller.js';


const router = express.Router();

router.post("/signUp",signUp);
router.post("/logIn",logIn);
router.post("/logOut",logOut);


export default router;
