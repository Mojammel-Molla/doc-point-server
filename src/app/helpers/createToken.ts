import jwt from 'jsonwebtoken';
export const createToken = (
  payload: any,
  secret: string,
  expiresIn: string
) => {
  const token = jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn,
  });
  return token;
};
