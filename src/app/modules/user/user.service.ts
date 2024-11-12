import { UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import { prisma } from '../../shared/prisma';

const createAdminIntoDB = async (data: any) => {
  console.log('Data from service', data);
  const hashedPassword: string = await bcrypt.hash(data.password, 12);

  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };
  const result = await prisma.$transaction(async transactionClient => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdAdminData = await transactionClient.admin.create({
      data: data.admin,
    });
    return createdAdminData;
  });

  return result;
};
export const userServices = {
  createAdminIntoDB,
};
