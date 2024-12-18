import {
  Admin,
  Doctor,
  Patient,
  Prisma,
  UserRole,
  UserStatus,
} from '@prisma/client';
import bcrypt from 'bcrypt';
import { prisma } from '../../shared/prisma';
import { Request } from 'express';
import { IFile } from '../../interfaces/file';
import { fileUploader } from '../../helpers/fileUploader';
import { calculatePagination } from '../../helpers/pagination.helper';
import { userSearchableFields } from './user.constant';
import { IAuthUser } from '../../interfaces/common';

const createAdminIntoDB = async (req: Request): Promise<Admin> => {
  const file = req.file as IFile;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };
  const result = await prisma.$transaction(async transactionClient => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdAdminData = await transactionClient.admin.create({
      data: req.body.admin,
    });
    return createdAdminData;
  });

  return result;
};
const createDoctorIntoDB = async (req: Request): Promise<Doctor> => {
  const file = req.file as IFile;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };
  const result = await prisma.$transaction(async transactionClient => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdDoctorData = await transactionClient.doctor.create({
      data: req.body.doctor,
    });
    return createdDoctorData;
  });

  return result;
};

const createPatientIntoDB = async (req: Request): Promise<Patient> => {
  const file = req.file as IFile;

  if (file) {
    const uploadedProfileImage = await fileUploader.uploadToCloudinary(file);
    req.body.patient.profilePhoto = uploadedProfileImage?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async transactionClient => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdPatientData = await transactionClient.patient.create({
      data: req.body.patient,
    });

    return createdPatientData;
  });

  return result;
};

const getAllUsersFromDB = async (params: any, options: any) => {
  console.log(params);
  const { searchTerm, ...restQuery } = params;
  const { page, limit, skip } = calculatePagination(options);
  console.log(options);
  const andConditions: Prisma.UserWhereInput[] = [];
  if (params.searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map(field => ({
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
          equals: (restQuery as any)[key],
        },
      })),
    });
  }
  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.user.findMany({
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
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      needPasswordChange: true,
    },
    // include: {
    //   admin: true,
    //   doctor: true,
    // },
  });
  const totalCount = await prisma.user.count({ where: whereConditions });
  return {
    meta: {
      page,
      limit,
      totalCount,
    },
    data: result,
  };
};

const updateUserStatusIntoDB = async (id: string, status: UserRole) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });

  return updateUserStatus;
};

const getMyProfileFromDB = async (user: IAuthUser) => {
  const userInfo = await prisma.user.findFirstOrThrow({
    where: {
      email: user.email,
    },
  });
  let profileInfo;
  if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.findFirstOrThrow({
      where: {
        email: userInfo.email,
      },
    });
  }
  return { ...userInfo, ...profileInfo };
};
const updateMyProfileIntoDB = async (user: IAuthUser, req: Request) => {
  const userInfo = await prisma.user.findFirstOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (req.file) {
    const file = req.file as IFile;
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }

  let profileInfo;
  if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  }
  return { ...profileInfo };
};
export const userServices = {
  createAdminIntoDB,
  createDoctorIntoDB,
  createPatientIntoDB,
  getAllUsersFromDB,
  updateUserStatusIntoDB,
  getMyProfileFromDB,
  updateMyProfileIntoDB,
};
