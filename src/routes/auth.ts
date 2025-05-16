import { Router } from "express";
import passport from "passport";
import auth from "../controllers/auth";

const router = Router();

router.post('/signup', auth.signup)
router.post('/login', auth.login)


export default router;