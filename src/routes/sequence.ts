import { Router } from "express";
import passport from "passport"; //JWT protection
import sequence from "../controllers/sequence";

const router = Router();

router.get('/all', passport.authenticate('jwt', {session: false}), sequence.getSequences)
router.get('/', passport.authenticate('jwt', {session: false}), sequence.getSequence)
router.post('/create', passport.authenticate('jwt', {session: false}), sequence.createSequence)
router.put('/:id', passport.authenticate('jwt', {session: false}), sequence.updateSequence)
router.delete('/:id', passport.authenticate('jwt', {session: false}), sequence.deleteSequence)

/**
 * Relationship Routes
 */



export default router;