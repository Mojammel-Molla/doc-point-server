import { RequestHandler } from 'express';
import catchAsync from '../../shared/catchAsync';
import { authServices } from './auth.service';
import sendResponse from '../../helpers/sendResponse';

const logInUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await authServices.logInUser(req.body);

  const { refreshToken } = result;
  res.cookie('refreshToken', refreshToken, {
    httpOnly: false,
    secure: false,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Logged in successfully',
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});
const refreshTokenGenerate: RequestHandler = catchAsync(async (req, res) => {
  // const { refreshToken } = req.cookies;
  console.log('Token', req.cookies);

  const result = await authServices.refreshTokenCreate(req.cookies);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Logged in successfully',
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});

export const authController = {
  logInUser,
  refreshTokenGenerate,
};
