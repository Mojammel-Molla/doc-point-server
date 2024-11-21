import bcrypt from 'bcrypt';
import { prisma } from '../../shared/prisma';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { createToken, verifyToken } from '../../helpers/createToken';
import config from '../../../config';
import { UserStstus } from '@prisma/client';
import emailSender from './emailSender';
import ApiError from '../../errors/ApiError';

type ILogin = { email: string; password: string };

const logInUser = async (payload: ILogin) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatch) {
    throw new Error('Incorrect password');
  }

  if (!config.jwt.access_secret || !config.jwt.refresh_token_secret) {
    throw new Error('Missing JWT configuration');
  }

  const accessToken = createToken(
    {
      email: user.email,
      role: user.role,
    },
    config.jwt.access_secret as string,
    config.jwt.access_expires_in as string
  );

  const refreshToken = createToken(
    {
      email: user.email,
      role: user.role,
    },
    config.jwt.refresh_token_secret as string,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

const refreshTokenCreate = async (token: string) => {
  console.log('Refreshing', token);
  let decodedData;
  try {
    decodedData = jwt.verify(
      token,
      config.jwt.refresh_token_secret as string
    ) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
    },
  });
  const accessToken = createToken(
    {
      email: user.email,
      role: user.role,
    },
    config.jwt.refresh_token_secret as string,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    needPasswordChange: user.needPasswordChange,
  };
};
const changePassword = async (user: any, payload: any) => {
  console.log(user.email);
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStstus.ACTIVE,
    },
  });
  console.log('Data from service page', userData);
  const isPasswordMatch = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );
  if (!isPasswordMatch) {
    throw new Error('Incorrect password');
  }
  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });
  return {
    message: 'Password changed successfully',
    needPasswordChange: false,
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStstus.ACTIVE,
    },
  });

  const resetPassToken = createToken(
    { email: userData.email, role: userData.role },
    config.jwt.refresh_token_secret as string,
    config.jwt.refresh_token_expires_in as string
  );
  console.log(resetPassToken);
  const resetPassLink =
    config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;

  //https:localhost:3000/reset_password?email=mojammelmolla897@gmail.com&token=********

  await emailSender(
    userData.email,
    `
    
    <div>
    <p>Dear user,</p>
    <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>
    </div>`
  );
  console.log(resetPassLink);
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  console.log(token, payload);

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStstus.ACTIVE,
    },
  });
  const isValidToken = verifyToken(
    token,
    config.jwt.reset_pass_token_secret as Secret
  );

  if (!isValidToken) {
    throw new ApiError(401, 'Invalid token');
  }
  const hashedPassword: string = await bcrypt.hash(payload.password, 12);
  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password: hashedPassword,
    },
  });
};

export const authServices = {
  logInUser,
  refreshTokenCreate,
  changePassword,
  forgotPassword,
  resetPassword,
};
