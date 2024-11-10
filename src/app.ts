import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { userRoutes } from './app/modules/user/user.routes';

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/users', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'Doc point is available',
  });
});

export default app;
