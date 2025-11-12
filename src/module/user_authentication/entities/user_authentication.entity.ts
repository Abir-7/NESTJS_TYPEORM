// src/user_authentication/entities/user_authentication.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { UserAuthenticationFailLog } from '../../user_authentication_fail_log/entities/user_authentication_fail_log.entity';

export enum AuthenticationType {
  EMAIL = 'EMAIL_VERIFICATION',
  RESET_PASSWORD = 'RESET_PASSWORD_VERIFICATION',
}

export enum AuthStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

@Entity('user_authentications')
@Index('idx_user_auth_status', ['status'])
@Index('idx_status_expire', ['status', 'expire_date'])
export class UserAuthentication {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => User, (user) => user.authentications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'code', nullable: true })
  code?: string;

  @Column({ name: 'token', nullable: true })
  token?: string;

  @Column({ name: 'expire_date', type: 'timestamp' })
  expire_date: Date;

  @Column({
    type: 'enum',
    enum: AuthStatus,
    default: AuthStatus.PENDING,
  })
  status: AuthStatus;

  @Column({
    type: 'enum',
    enum: AuthenticationType,
    name: 'type',
  })
  type: AuthenticationType;

  @Column({ name: 'ip_address', nullable: true })
  ip_address?: string;

  @Column({ name: 'user_agent', nullable: true })
  user_agent?: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @Column({ name: 'verified_at', type: 'timestamp', nullable: true })
  verified_at?: Date;
  @OneToMany(
    () => UserAuthenticationFailLog,
    (failLog) => failLog.authentication,
    { cascade: true },
  )
  fail_logs: UserAuthenticationFailLog[];
}
