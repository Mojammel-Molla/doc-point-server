import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../helpers/createToken';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import ApiError from '../errors/ApiError';
const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new ApiError(400, 'No token provided');
      }
      const verifiedUser = verifyToken(
        token,
        config.jwt.access_secret as Secret
      );
      // console.log(verifiedUser);
      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(401, 'You are not authorized');
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
