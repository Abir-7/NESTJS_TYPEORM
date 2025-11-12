import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserProfile } from '../../user_profile/entities/user_profile.entity';
import { UserAuthentication } from '../../user_authentication/entities/user_authentication.entity';

import { UserLoginHistory } from '../../user_login_history/entities/user_login_history.entity';
import { UserAuthenticationFailLog } from '../../user_authentication_fail_log/entities/user_authentication_fail_log.entity';

export enum AccountStatus {
  DELETED = 'deleted',
  PENDING_VERIFICATION = 'pending_verification',
  BLOCKED = 'blocked',
  DISABLED = 'disabled',
  ACTIVE = 'active',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ unique: true, name: 'email' })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
    name: 'role',
  })
  role: UserRole;

  @Column({ default: false, name: 'is_profile_updated' })
  is_profile_updated: boolean;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.PENDING_VERIFICATION,
    name: 'account_status',
  })
  account_status: AccountStatus;

  @Column({ default: false, name: 'is_verified' })
  is_verified: boolean;

  @Column({ default: false, name: 'need_to_reset_password' })
  need_to_reset_password: boolean;

  @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
  profile: UserProfile;

  @OneToMany(() => UserAuthentication, (auth) => auth.user, { cascade: true })
  authentications: UserAuthentication[];

  @OneToMany(() => UserLoginHistory, (loginHistory) => loginHistory.user, {
    cascade: true,
  })
  loginHistories: UserLoginHistory[];

  @OneToMany(() => UserAuthenticationFailLog, (failLog) => failLog.user, {
    cascade: true,
  })
  authenticationFailLogs: UserAuthenticationFailLog[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
