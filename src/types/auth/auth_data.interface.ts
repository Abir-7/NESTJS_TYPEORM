import { UserRole } from '../../module/user/entities/user.entity';

export interface IAuthData {
  user_id: string;
  user_email: string;
  user_role: UserRole;
}
