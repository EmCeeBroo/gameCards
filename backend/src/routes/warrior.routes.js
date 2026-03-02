import { Router } from 'express';
import { warriorController } from '../controllers/warrior.controller.js';

const router = Router();

router.get('/', warriorController.getAll);
router.get('/races', warriorController.getRaces);
router.get('/powers', warriorController.getPowers);
router.get('/spells', warriorController.getSpells);
router.get('/:id', warriorController.getById);

export default router;
