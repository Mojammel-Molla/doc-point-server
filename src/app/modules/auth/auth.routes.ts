import express from 'express';
import { authController } from './auth.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post('/login', authController.logInUser);
router.post('/refresh-token', authController.refreshTokenGenerate);
router.post(
  '/change-password',
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SUPER_ADMIN, UserRole.PAITENT),
  authController.changedPassword
);
router.post(
  '/forgot-password',
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SUPER_ADMIN, UserRole.PAITENT),
  authController.forgotPassword
);
router.post(
  '/reset-password',
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SUPER_ADMIN, UserRole.PAITENT),
  authController.resetPassword
);

export const authRoutes = router;
