import { Router } from "express";
import pose from "../controllers/pose";
import passport from "passport"; //JWT protection

const router = Router();

router.get('/all', passport.authenticate('jwt', {session: false}), pose.getPoses)
router.get('/', passport.authenticate('jwt', {session: false}), pose.getPose)
router.post('/create', passport.authenticate('jwt', {session: false}), pose.createPose)
router.put('/:id', passport.authenticate('jwt', {session: false}), pose.updatePose)
router.delete('/:id', passport.authenticate('jwt', {session: false}), pose.deletePose)

export default router