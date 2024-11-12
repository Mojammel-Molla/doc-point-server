import express, { NextFunction, Request, Response } from 'express';
import { AdminController } from './admin.controller';
import { AnyZodObject, z } from 'zod';

const router = express.Router();

const update = z.object({
  body: z.object({
    name: z.string(),
    contactNumber: z.string(),
  }),
});

const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      {
        await schema.parseAsync({
          body: req.body,
        });
        return next();
      }
    } catch (err) {
      next(err);
    }
  };

router.get('/', AdminController.getAllAdmins);
router.get('/:id', AdminController.getAdminById);
router.patch('/:id', validateRequest(update), AdminController.updateAdmin);
router.delete('/:id', AdminController.deleteAdmin);
router.delete('/soft/:id', AdminController.softDeleteAdmin);

export const adminRoutes = router;
