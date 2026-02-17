import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('tbl_audit_logs')
export class AuditLog {
  @PrimaryColumn({ name: 'log_id', length: 100 })
  logId: string;

  @Column({ name: 'user_id', type: 'varchar', length: 50, nullable: true })
  userId: string | null;

  @Column({ name: 'action', type: 'varchar', length: 100, nullable: true })
  action: string | null;

  @Column({ name: 'target_type', type: 'varchar', length: 100, nullable: true })
  targetType: string | null;

  @Column({ name: 'target_id', type: 'varchar', length: 100, nullable: true })
  targetId: string | null;

  @Column({ name: 'ip_address', type: 'varchar', length: 50, nullable: true })
  ipAddress: string | null;

  @Column({ name: 'created_date', type: 'date', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date | null;

  @Column({ name: 'created_user', type: 'varchar', length: 100, nullable: true })
  createdUser: string | null;
}
