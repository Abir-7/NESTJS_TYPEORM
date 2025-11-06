import { IAuthData } from './auth_user.interface';

declare global {
  namespace Express {
    interface Request {
      user?: IAuthData;
    }
  }
}
