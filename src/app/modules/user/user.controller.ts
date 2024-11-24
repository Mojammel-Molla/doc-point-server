import { NextFunction, Request, Response } from 'express';
import { userServices } from './user.service';
import sendResponse from '../../helpers/sendResponse';
import { userFilterableFields, userPaginatedFields } from './user.constant';
import { adminPaginatedFields } from '../admin/admin.constant';
import pick from '../../shared/pick';
import catchAsync from '../../shared/catchAsync';

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

const getAllUsers = catchAsync(async (req, res) => {
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

const updateUserStatus = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await userServices.updateUserStatusIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users data updated successfully',

    data: result,
  });
});
export const userControllers = {
  createAdmin,
  createDoctor,
  getAllUsers,
  updateUserStatus,
};
