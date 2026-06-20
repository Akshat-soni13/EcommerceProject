import {Router} from "express"
import { validateRegisteredUser } from './../validator/auth.validator.js';

const router = Router()


router.post("/register",validateRegisteredUser,)


export default router