import { NextFunction, RequestHandler } from 'express';
import { Request, Response } from 'express-serve-static-core';

const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default catchAsync;
