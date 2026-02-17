import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('tbl_user_info')
export class User {
  @PrimaryColumn({ name: 'user_id', length: 50 })
  id: string;

  @Column({ name: 'user_pw', length: 200 })
  password: string;

  @Column({ name: 'user_name', length: 100 })
  name: string;

  @Column({ name: 'user_email', length: 100 })
  email: string;

  @Column({ name: 'user_phone', length: 15 })
  phone: string;

  @Column({ name: 'user_role', length: 10 })
  role: string;

  @Column({ name: 'user_status', length: 10 })
  status: string;

  @Column({ name: 'user_profile', type: 'varchar', length: 100, nullable: true })
  profile: string | null;

  @Column({ name: 'user_history', type: 'varchar', length: 100, nullable: true })
  history: string | null;

  @Column({ name: 'provider', type: 'varchar', length: 10, nullable: true })
  provider: string | null;

  @Column({ name: 'provider_id', type: 'varchar', length: 100, nullable: true })
  providerId: string | null;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  lastLogin: Date | null;

  @Column({ name: 'created_date', type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date | null;

  @Column({ name: 'created_user', type: 'varchar', length: 100, nullable: true })
  createdUser: string | null;

  @Column({ name: 'modified_date', type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  modifiedDate: Date | null;

  @Column({ name: 'modified_user', type: 'varchar', length: 100, nullable: true })
  modifiedUser: string | null;
}
