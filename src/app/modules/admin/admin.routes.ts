import express from 'express';
import { AdminController } from './admin.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { update } from './admin.validation';

const router = express.Router();

router.get('/', AdminController.getAllAdmins);
router.get('/:id', AdminController.getAdminById);
router.patch('/:id', validateRequest(update), AdminController.updateAdmin);
router.delete('/:id', AdminController.deleteAdmin);
router.delete('/soft/:id', AdminController.softDeleteAdmin);

export const adminRoutes = router;
