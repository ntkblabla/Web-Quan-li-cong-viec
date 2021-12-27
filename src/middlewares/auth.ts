import codes from '../errors/codes';
import CustomError from '../errors/customError';
import { verifyAccessToken } from '../utils/helper';

const authMiddleware = async (req: any, res: any, next: any) => {
  if (!req.path.includes('/auth') && !req.path.includes('/login') && !req.path.includes('/register')) {
    const { authorization } = req.headers;
    const authCookies = req.cookies.auth;
    let authorizationToken: string;
    if (authorization) {
      authorizationToken = authorization;
    } else if (authCookies) {
      authorizationToken = authCookies;
    } else {
      return res.redirect('/login');
    }
    const [tokenType, accessToken] = authorizationToken.split(' ');
    console.log('2', tokenType, accessToken);
    if (tokenType !== 'Bearer') {
      return res.redirect('/login');
    }
    try {
      const user = await verifyAccessToken(accessToken);
      req.user = user;
      if (['/auths/logout', '/auths/verify'].includes(req.path)) {
        req.accessToken = accessToken;
      }
    } catch (e) {
      return res.redirect('/login');
    }
  }

  return next();
};

export default authMiddleware;
