// src/user_authentication/entities/user_authentication.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum AuthenticationType {
  EMAIL = 'email',
  RESEND = 'resend',
  RESET_PASSWORD = 'reset_password',
}

@Entity('user_authentications')
export class UserAuthentication {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => User, (user) => user.authentications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'code' })
  code: string;

  @Column({ name: 'token', nullable: true })
  token?: string;

  @Column({ name: 'expire_date', type: 'timestamp' })
  expire_date: Date;

  @Column({
    type: 'enum',
    enum: AuthenticationType,
    name: 'type',
  })
  type: AuthenticationType;

  @Column({ name: 'is_success', default: false })
  is_success: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
