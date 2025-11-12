import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('user_login_history')
export class UserLoginHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'ip_address', type: 'varchar', length: 100, nullable: true })
  ip_address: string;

  @Column({ name: 'device', type: 'varchar', length: 200, nullable: true })
  device: string;

  @Column({ name: 'location', type: 'varchar', length: 200, nullable: true })
  location: string;
  @Column({ name: 'is_success', type: 'boolean', default: true })
  is_success: boolean;

  @Column({ name: 'reason', type: 'varchar', length: 500, nullable: true })
  note: string;
  @CreateDateColumn({ name: 'login_time' })
  login_time: Date;
}
