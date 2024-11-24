import express, { NextFunction, Request, Response } from 'express';
import { userControllers } from './user.controller';

import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { fileUploader } from '../../helpers/fileUploader';
import { userValidations } from './user.validation';
import { validateRequest } from '../../middlewares/validateRequest';

const router = express.Router();

router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userControllers.getAllUsers
);

router.post(
  '/create-admin',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidations.createAdmin.parse(req.body.data);
    return userControllers.createAdmin(req, res, next);
  }
);
router.post(
  '/create-doctor',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidations.createDoctor.parse(req.body.data);
    return userControllers.createDoctor(req, res, next);
  }
);

router.patch(
  '/:id/status',
  auth(UserRole.SUPER_ADMIN),
  validateRequest(userValidations.updateStatus),
  userControllers.updateUserStatus
);

export const userRoutes = router;
