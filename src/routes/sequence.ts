import { Router } from "express";
import passport from "passport"; 
import {getSequence, getSequences, createSequence, updateSequence, deleteSequence, addPoseToSequence, removePoseFromSequence} from "../controllers/sequence";

const router = Router();

router.get('/all', passport.authenticate('jwt', {session: false}), getSequences)
router.get('/:id', passport.authenticate('jwt', {session: false}), getSequence)
router.post('/create', passport.authenticate('jwt', {session: false}), createSequence)
router.put('/:id', passport.authenticate('jwt', {session: false}), updateSequence)
router.delete('/:id', passport.authenticate('jwt', {session: false}), deleteSequence)

/**
 * Relationship Routes
 */
router.post('/:sequenceId/pose', passport.authenticate('jwt', {session: false}), addPoseToSequence)
router.delete('/:sequenceId/pose/:poseId', passport.authenticate('jwt', {session: false}), removePoseFromSequence)


export default router;