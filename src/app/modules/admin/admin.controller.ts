import { Request, Response } from 'express';
import { AdminService } from './admin.service';

const getAllAdmins = async (req: Request, res: Response) => {
  // console.log(req.query);
  try {
    const result = await AdminService.getAllFromDB(req.query);
    res.status(500).json({
      success: true,
      message: 'Admin data retrieved successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err?.name || 'Failed to retrieved admin',
      error: err,
    });
  }
};

export const AdminController = {
  getAllAdmins,
};
