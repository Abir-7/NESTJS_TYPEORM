import { UserRole } from '../../module/user/entities/user.entity';

export interface JwtPayload {
  user_id: string;
  user_email: string;
  user_role: UserRole;
  iat: number;
  exp: number;
}
