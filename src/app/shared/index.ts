import asyncHandler from 'express-async-handler';
import express, { Request, Response, NextFunction } from 'express';

const app = express();

// Route without asyncHandler (verbose with try...catch)
app.get('/without', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await someAsyncOperation();
    res.send(data);
  } catch (error) {
    next(error); // manually forwarding error
  }
});

// Cleaner route with asyncHandler
app.get(
  '/with',
  asyncHandler(async (req: Request, res: Response) => {
    const data = await someAsyncOperation();
    res.send(data); // any error is automatically caught and forwarded
  })
);

function someAsyncOperation() {
  throw new Error('Function not implemented.');
}
