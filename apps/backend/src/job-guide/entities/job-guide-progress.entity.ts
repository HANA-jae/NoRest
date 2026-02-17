import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_job_guide_progress')
export class JobGuideProgress {
  @PrimaryGeneratedColumn({ name: 'progress_id', type: 'bigint' })
  progressId: number;

  @Column({ name: 'user_id', type: 'varchar', length: 50 })
  userId: string;

  @Column({ name: 'item_code', type: 'varchar', length: 50 })
  itemCode: string;

  @Column({ name: 'is_completed', type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ name: 'is_disabled', type: 'boolean', default: false })
  isDisabled: boolean;

  @Column({ name: 'target_date', type: 'date', nullable: true })
  targetDate: Date | null;

  @Column({ name: 'completed_date', type: 'timestamp', nullable: true })
  completedDate: Date | null;

  @Column({ name: 'created_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @Column({ name: 'modified_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  modifiedDate: Date;
}
