import { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import { authServices } from './auth.service';
import sendResponse from '../../helpers/sendResponse';

const logInUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
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
  }
);

const refreshTokenGenerate: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
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
  }
);

const changedPassword: RequestHandler = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    // console.log(req.user);
    const result = await authServices.changePassword(user, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Password changed successfully',
      data: result,
    });
  }
);

const forgotPassword: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await authServices.forgotPassword(req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'check your email please',
      data: result,
    });
  }
);
const resetPassword: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const token = req.headers.authorization || ' ';
    await authServices.resetPassword(token, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'password reset successfully',
      data: null,
    });
  }
);

export const authController = {
  logInUser,
  refreshTokenGenerate,
  changedPassword,
  forgotPassword,
  resetPassword,
};
