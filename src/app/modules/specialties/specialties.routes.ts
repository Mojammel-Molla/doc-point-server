import express, { NextFunction, Request, Response } from 'express';
import { SpecialtiesControllers } from './specialties.controller';

import { SpecialtiesValidation } from './specialties.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { fileUploader } from '../../helpers/fileUploader';

const router = express.Router();

router.get('/', SpecialtiesControllers.getAllSpecialties);

router.post(
  '/',
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialtiesValidation.create.parse(JSON.parse(req.body.data));
    return SpecialtiesControllers.createSpecialties(req, res, next);
  }
);

router.delete(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  SpecialtiesControllers.deleteSpecialties
);

export const SpecialtiesRoutes = router;
