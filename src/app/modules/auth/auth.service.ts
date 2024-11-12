import bcrypt from 'bcrypt';
import { prisma } from '../../shared/prisma';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { createToken } from '../../helpers/createToken';

type ILogin = { email: string; password: string };

const logInUser = async (payload: ILogin) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user || !(await bcrypt.compare(payload.password, user.password))) {
    throw new Error('Invalid credentials');
  }
  const accessToken = createToken(
    {
      email: user.email,
      role: user.role,
    },
    'abcdefg',
    '5m'
  );
  const refreshToken = createToken(
    {
      email: user.email,
      role: user.role,
    },
    'abcdefghijklmnopqrstuvwxyz',
    '30d'
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
    decodedData = jwt.verify(token, 'abcdefghijklmnopqrstuvwxyz') as JwtPayload;
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
    'abcdefg',
    '5m'
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
