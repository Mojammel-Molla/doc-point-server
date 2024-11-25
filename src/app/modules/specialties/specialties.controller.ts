import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import { SpecialtiesServices } from './specialties.service';
import sendResponse from '../../helpers/sendResponse';

const createSpecialties = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);
  const result = await SpecialtiesServices.createSpecialtiesIntoDB(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Specialties created successfully!',
    data: result,
  });
});

const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesServices.getAllSpecialtiesFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Specialties data fetched successfully',
    data: result,
  });
});

const deleteSpecialties = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SpecialtiesServices.deleteSpecialtiesFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Specialty deleted successfully',
    data: result,
  });
});

export const SpecialtiesControllers = {
  createSpecialties,
  getAllSpecialties,
  deleteSpecialties,
};
