import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'first_name', nullable: true })
  first_name?: string;

  @Column({ name: 'last_name', nullable: true })
  last_name?: string;

  @Column({ name: 'phone', nullable: true })
  phone?: string;

  @Column({ name: 'image', nullable: true })
  image?: string;

  @Column({ name: 'image_id', nullable: true })
  image_id?: string;

  @Column({ name: 'address', nullable: true })
  address?: string;

  @Column({ name: 'city', nullable: true })
  city?: string;

  @Column({ name: 'country', nullable: true })
  country?: string;

  @Column({ name: 'zip_code', nullable: true })
  zip_code?: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  date_of_birth?: string;
}
