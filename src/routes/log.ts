import { Router } from "express";
import passport from "passport";
import { listLogs, createLog, getLog, updateLog, deleteLog } from '../controllers/log'


const router = Router();

router.get('/', passport.authenticate('jwt', { session: false }), listLogs);
router.post('/', passport.authenticate('jwt', { session: false }), createLog);
router.get('/:logId', passport.authenticate('jwt', { session: false }), getLog);
router.patch('/:logId', passport.authenticate('jwt', { session: false }), updateLog);
router.delete('/:logId', passport.authenticate('jwt', { session: false }), deleteLog);

export default router;