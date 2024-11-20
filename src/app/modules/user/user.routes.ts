import express, { NextFunction, Request, Response } from 'express';
import { userControllers } from './user.controller';
import { verifyToken } from '../../helpers/createToken';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import { string } from 'zod';

const router = express.Router();
const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new Error('No token provided');
      }
      const verifiedUser = verifyToken(
        token,
        config.jwt.access_secret as Secret
      );
      console.log(verifiedUser);

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new Error('You are not authorized');
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

router.post('/', auth('ADMIN', 'SUPER_ADMIN'), userControllers.createAdmin);

export const userRoutes = router;
