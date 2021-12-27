import codes from '../../errors/codes';
import CustomError from '../../errors/customError';
import authService from './services';
import { User } from '../../types/type.auth';

const register = async (req: any, res: any) => {
  const { email, password, name } = req.body;
  const user: User = (await authService.register({ email, password, name })) as User;
  delete user.password;
  return res.status(200).json({
    status: 'success',
    result: user,
  });
};

const login = async (req: any, res: any) => {
  const { email, password } = req.body;
  const user: User = (await authService.login({ email, password })) as User;
  delete user.password;
  return res.status(200).json({
    status: 'success',
    result: user,
  });
};

const getUserInfo = async (req: any, res: any) => {
  const user = req.user;
  delete user.password;
  return res.status(200).json({
    status: 'success',
    result: user,
  });
};

const updateUserInfo = async (req: any, res: any) => {
  const updateData = req.body;
  const userId = req.user.id;
  const userIdParams = req.params.id;
  if (Number(userId) !== Number(userIdParams)) {
    throw new CustomError(codes.UNAUTHORIZED, 'Request reject');
  }
  const updateUser = await authService.updateUserInfo(userId, updateData);
  delete updateUser.password;
  return res.status(200).json({
    status: 'success',
    result: updateUser,
  });
};

export default { register, login, getUserInfo, updateUserInfo };
