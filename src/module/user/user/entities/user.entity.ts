import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum AccountStatus {
  DELETED = 'deleted',
  PENDING_VERIFICATION = 'pending_verification',
  BLOCKED = 'blocked',
  DISABLED = 'disabled',
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
  isProfileUpdated: boolean;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.PENDING_VERIFICATION,
    name: 'account_status',
  })
  accountStatus: AccountStatus;

  @Column({ default: false, name: 'is_verified' })
  isVerified: boolean;
}
