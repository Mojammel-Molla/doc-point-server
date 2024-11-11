import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getAllFromDB = async () => {
  const result = await prisma.user.findMany();
  return result;
};

export const AdminService = {
  getAllFromDB,
};
