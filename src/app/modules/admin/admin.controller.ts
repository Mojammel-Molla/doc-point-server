import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import pick from '../../shared/pick';
import { adminFilterableFields, adminPaginatedFields } from './admin.constant';
import sendResponse from './sendResponse';

const getAllAdmins = async (req: Request, res: Response) => {
  // console.log(req.query);
  const filters = pick(req.query, adminFilterableFields);
  const options = pick(req.query, adminPaginatedFields);
  try {
    const result = await AdminService.getAllFromDB(filters, options);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Admin data retrieved successfully',
      meta: result.meta,
      data: result.data,
    });
    // res.status(500).json({
    //   success: true,
    //   message: 'Admin data retrieved successfully',
    //   meta: result.meta,
    //   data: result.data,
    // });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err?.name || 'Failed to retrieved admin',
      error: err,
    });
  }
};
const getAdminById = async (req: Request, res: Response) => {
  // console.log(req.query);
  const { id } = req.params;
  try {
    const result = await AdminService.getByIdFromDB(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Admin data retrieved successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message:
        err && typeof err === 'object' && 'name' in err
          ? err.name
          : 'Failed to retrieved admin',
      error: err,
    });
  }
};
const updateAdmin = async (req: Request, res: Response) => {
  // console.log(req.query);
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const result = await AdminService.updateAdminIntoDB(id, updatedData);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Admin data updated successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err?.name || 'Failed to update admin',
      error: err,
    });
  }
};
const deleteAdmin = async (req: Request, res: Response) => {
  // console.log(req.query);
  const { id } = req.params;
  try {
    const result = await AdminService.softDeleteFromDB(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Admin data deleted successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err?.name || 'Failed to delete admin',
      error: err,
    });
  }
};
const softDeleteAdmin = async (req: Request, res: Response) => {
  // console.log(req.query);
  const { id } = req.params;
  try {
    const result = await AdminService.softDeleteFromDB(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Admin data deleted successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err?.name || 'Failed to delete admin',
      error: err,
    });
  }
};

export const AdminController = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
