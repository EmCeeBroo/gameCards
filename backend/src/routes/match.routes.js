import { Router } from 'express';
import { matchController } from '../controllers/match.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.post('/', verifyToken, matchController.create);
router.get('/', verifyToken, matchController.getAll);
router.get('/:id', verifyToken, matchController.getById);
router.post('/:id/selections', verifyToken, matchController.saveSelections);
router.post('/:id/battle', verifyToken, matchController.battle);
router.delete('/:id', verifyToken, matchController.delete);

export default router;
