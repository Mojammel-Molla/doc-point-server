import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { userRoutes } from './app/modules/user/user.routes';
import { adminRoutes } from './app/modules/admin/admin.routes';

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'Doc point is available',
  });
});

export default app;
