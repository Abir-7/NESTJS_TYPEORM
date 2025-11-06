import { UserRole } from '../module/user/user/entities/user.entity';

export interface JwtPayload {
  user_id: string;
  user_email: string;
  user_role: UserRole;
  iat: number; // issued at timestamp
  exp: number; // expiration timestamp
}
