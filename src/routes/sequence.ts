import { Router } from "express";
import passport from "passport"; //JWT protection
import {getSequence, getSequences, createSequence, updateSequence, deleteSequence} from "../controllers/sequence";

const router = Router();

router.get('/all', passport.authenticate('jwt', {session: false}), getSequences)
router.get('/:id', passport.authenticate('jwt', {session: false}), getSequence)
router.post('/create', passport.authenticate('jwt', {session: false}), createSequence)
router.put('/:id', passport.authenticate('jwt', {session: false}), updateSequence)
router.delete('/:id', passport.authenticate('jwt', {session: false}), deleteSequence)

/**
 * Relationship Routes
 */



export default router;