import { getRepository } from 'typeorm';
import { User } from '../../entities/user';
import codes from '../../errors/codes';
import CustomError from '../../errors/customError';
import { Register } from '../../types/type.auth';
import { User as UserType } from '../../types/type.auth';
import connectDB from './connectDB';

const createUser = async (dataRegister: Register) => {
  return await connectDB
    .then(async (connection) => {
      const { name, email, password } = dataRegister;
      const user = new User();
      user.name = name;
      user.email = email;
      user.password = password;
      return connection.manager.save(user);
    })
    .catch((e) => {
      console.log('err user: ', e);
      throw new CustomError(codes.DUPLICATE, e.message);
    });
};

const updateUser = async (id: number, dataUpdate: UserType) => {
  const userRepo = getRepository(User);
  const updateUserRecord = await findUser({ id });
  if (!updateUserRecord) {
    throw new CustomError(codes.NOT_FOUND, 'User not found!');
  } else {
    for (const key in dataUpdate) {
      if (Object.prototype.hasOwnProperty.call(dataUpdate, key)) {
        const value = dataUpdate[key];
        updateUserRecord[key] = value;
      }
    }
  }
  // save
  const userRes = await userRepo.save(updateUserRecord);
  return userRes;
};

const findUser = async (dataFind: { email?: string; id?: number }) => {
  console.log('hello');
  const userReposity = getRepository(User);
  let user: UserType;
  if (dataFind.email) {
    user = await userReposity.findOne({
      where: {
        email: dataFind.email,
      },
    });
  } else if (dataFind.id) {
    user = await userReposity.findOne({
      where: {
        id: dataFind.id,
      },
    });
  }
  return user;
};

export default { createUser, findUser, updateUser };
