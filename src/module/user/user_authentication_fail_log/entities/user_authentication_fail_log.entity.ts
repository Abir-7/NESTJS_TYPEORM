import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { UserAuthentication } from '../../user_authentication/entities/user_authentication.entity';

@Entity('user_authentication_fail_logs')
@Index('idx_fail_logs_user_id', ['user'])
@Index('idx_fail_logs_authentication_id', ['authentication'])
export class UserAuthenticationFailLog {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => UserAuthentication, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authentication_id' })
  authentication: UserAuthentication;

  @Column({ name: 'code', type: 'varchar', length: 255, nullable: true })
  code?: string;

  @Column({ name: 'token', type: 'varchar', length: 255, nullable: true })
  token?: string;

  @Column({ name: 'reason', type: 'text', nullable: true })
  reason?: string;

  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ip_address?: string;

  @Column({ name: 'user_agent', type: 'varchar', length: 255, nullable: true })
  user_agent?: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
