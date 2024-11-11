import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getAllFromDB = async (params: any) => {
  console.log(params);
  const adminSearchableFields = ['name', 'email'];
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
  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };
  const result = await prisma.admin.findMany({
    where: whereConditions,
  });
  return result;
};

export const AdminService = {
  getAllFromDB,
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
