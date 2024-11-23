import express from 'express';
import { userControllers } from './user.controller';

import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { fileUploader } from '../../helpers/fileUploader';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single('file'),
  userControllers.createAdmin
);

export const userRoutes = router;
