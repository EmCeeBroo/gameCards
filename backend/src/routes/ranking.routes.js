import { Router } from 'express';
import { rankingController } from '../controllers/ranking.controller.js';

const router = Router();

router.get('/', rankingController.getRanking);

export default router;
