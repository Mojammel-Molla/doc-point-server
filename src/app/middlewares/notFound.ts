import { NextFunction, Request, Response } from 'express';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'API not found',
    error: {
      path: req.originalUrl,
      method: req.method,
      message: 'Your requested path is not valid',
    },
  });
};

export default notFound;
