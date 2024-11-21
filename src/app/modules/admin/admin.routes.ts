import express from 'express';
import { AdminController } from './admin.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { update } from './admin.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.getAllAdmins
);
router.get(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.getAdminById
);
router.patch(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(update),
  AdminController.updateAdmin
);
router.delete(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.deleteAdmin
);
router.delete('/soft/:id', AdminController.softDeleteAdmin);

export const adminRoutes = router;
