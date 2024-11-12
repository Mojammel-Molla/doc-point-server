import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';

import router from './app/router';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);

app.use(globalErrorHandler);
app.use(notFound);

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'Doc point is available',
  });
});

export default app;
