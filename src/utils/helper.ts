import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import configs from '../configs';
import userDao from '../modules/auth/daos';

export const verifyAccessToken = async (accessToken: string) => {
  const data = jwt.verify(accessToken, configs.JWT_SECRET_KEY);
  const { userId } = data as { userId: number };
  const user = await userDao.findUser({ id: userId });
  return user;
};

export const generateSalt = (rounds: number): string => {
  return bcrypt.genSaltSync(rounds);
};

export const hashBcrypt = (text: string, salt: string) => {
  const hashedBcrypt = new Promise((resolve, reject) => {
    bcrypt.hash(text, salt, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
  return hashedBcrypt;
};

export const compareBcrypt = async (data: string, hashed: string) => {
  const isCorrect = await new Promise((resolve, reject) => {
    bcrypt.compare(data, hashed, (err: any, same: boolean) => {
      if (err) reject(err);
      resolve(same);
    });
  });
  return isCorrect;
};

export const generateAccessToken = async (userId: number) => {
  const accessToken = jwt.sign({ userId }, configs.JWT_SECRET_KEY, {
    expiresIn: configs.JWT_EXPIRES_TIME,
  });
  return accessToken;
};
