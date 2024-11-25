import { NextFunction, Request, Response } from 'express';
import { userServices } from './user.service';
import sendResponse from '../../helpers/sendResponse';
import { userFilterableFields, userPaginatedFields } from './user.constant';
import pick from '../../shared/pick';
import catchAsync from '../../shared/catchAsync';
import { IAuthUser } from '../../interfaces/common';

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userServices.createAdminIntoDB(req);
    res.status(500).json({
      success: true,
      message: 'Admin created successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err?.name || 'Failed to create admin',
      error: err,
    });
  }
};
const createDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await userServices.createDoctorIntoDB(req);
    res.status(500).json({
      success: true,
      message: 'Doctor created successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err?.name || 'Failed to create doctor',
      error: err,
    });
  }
};
const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createPatientIntoDB(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Patient Created successfully!',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, userPaginatedFields);

  const result = await userServices.getAllUsersFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users data retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await userServices.updateUserStatusIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users data updated successfully',

    data: result,
  });
});

const getMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req?.user;

    const result = await userServices.getMyProfileFromDB(user as IAuthUser);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Profile data retrieve successfully',

      data: result,
    });
  }
);

const updateMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;

    const result = await userServices.updateMyProfileIntoDB(
      user as IAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Profile data updated successfully',

      data: result,
    });
  }
);
export const userControllers = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsers,
  updateUserStatus,
  getMyProfile,
  updateMyProfile,
};
