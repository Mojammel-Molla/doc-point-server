import express from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { adminRoutes } from '../modules/admin/admin.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { SpecialtiesRoutes } from '../modules/specialties/specialties.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/admin',
    route: adminRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/specialties',
    route: SpecialtiesRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
