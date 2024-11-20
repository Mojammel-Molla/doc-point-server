import bcrypt from 'bcrypt';
import { prisma } from '../../shared/prisma';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { createToken } from '../../helpers/createToken';
import config from '../../../config';

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

export const authServices = {
  logInUser,
  refreshTokenCreate,
};
