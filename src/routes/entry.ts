import { Router } from "express";
import passport from "passport";
import { listEntries, createEntry, updateEntry, deleteEntry, getEntry } from "../controllers/entry";

const router = Router();

router.get('/:logId/entries', passport.authenticate('jwt', { session: false }), listEntries)
router.post('/:logId/entries', passport.authenticate('jwt', { session: false }), createEntry)
router.get('/:logId/entries/:entryId', passport.authenticate('jwt', { session: false }), getEntry)
router.patch('/:logId/entries/:entryId', passport.authenticate('jwt', { session: false }), updateEntry)
router.delete('/:logId/entries/:entryId', passport.authenticate('jwt', { session: false }), deleteEntry)


export default router;