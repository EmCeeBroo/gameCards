import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { verifyToken } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = Router();

// Todas las rutas de admin requieren autenticación + rol ADMIN
router.use(verifyToken, isAdmin);

// Dashboard stats
router.get('/stats', adminController.getStats);

// Warriors CRUD
router.post('/warriors', adminController.createWarrior);
router.put('/warriors/:id', adminController.updateWarrior);
router.delete('/warriors/:id', adminController.deleteWarrior);

// Users management
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Races CRUD
router.post('/races', adminController.createRace);
router.put('/races/:id', adminController.updateRace);
router.delete('/races/:id', adminController.deleteRace);

// Powers CRUD
router.post('/powers', adminController.createPower);
router.put('/powers/:id', adminController.updatePower);
router.delete('/powers/:id', adminController.deletePower);

// Spells CRUD
router.post('/spells', adminController.createSpell);
router.put('/spells/:id', adminController.updateSpell);
router.delete('/spells/:id', adminController.deleteSpell);

// Matches management
router.get('/matches', adminController.getMatches);
router.delete('/matches/:id', adminController.deleteMatch);

export default router;
