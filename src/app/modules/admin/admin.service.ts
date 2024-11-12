import { Admin, Prisma, UserStstus } from '@prisma/client';
import { adminSearchableFields } from './admin.constant';
import { calculatePagination } from '../../helpers/pagination.helper';
import { prisma } from '../../shared/prisma';

const getAllFromDB = async (params: any, options: any) => {
  console.log(params);
  const { searchTerm, ...restQuery } = params;
  const { page, limit, skip } = calculatePagination(options);
  console.log(options);
  const andConditions: Prisma.AdminWhereInput[] = [];
  if (params.searchTer) {
    andConditions.push({
      OR: adminSearchableFields.map(field => ({
        [field]: {
          contains: params.searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  if (Object.keys(restQuery).length > 0) {
    andConditions.push({
      AND: Object.keys(restQuery).map(key => ({
        [key]: {
          equals: restQuery[key],
        },
      })),
    });
  }
  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };
  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,

    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });
  const totalCount = await prisma.admin.count({ where: whereConditions });
  return {
    meta: {
      page,
      limit,
      totalCount,
    },
    data: result,
  };
};
const getByIdFromDB = async (id: string) => {
  console.log(id);

  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const updateAdminIntoDB = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin> => {
  console.log(id, data);

  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.$transaction(async transactionClient => {
    const adminDeletedData = await transactionClient.admin.delete({
      where: {
        id,
      },
    });
    await transactionClient.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });
    return adminDeletedData;
  });
  return result;
};
const softDeleteFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.$transaction(async transactionClient => {
    const adminDeletedData = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    await transactionClient.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStstus.DELETED,
      },
    });
    return adminDeletedData;
  });
  return result;
};

export const AdminService = {
  getAllFromDB,
  getByIdFromDB,
  updateAdminIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};

// [
//         {
//           name: {
//             contains: params.searchTerm,
//             mode: 'insensitive',
//           },
//         },
//         {
//           email: {
//             contains: params.searchTerm,
//             mode: 'insensitive',
//           },
//         },
//       ],
