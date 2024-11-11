import { Request, Response } from 'express';
import { userServices } from './user.service';

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createAdminIntoDB(req.body);
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

export const userControllers = {
  createAdmin,
};
