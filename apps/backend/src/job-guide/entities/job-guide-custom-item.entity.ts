import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_job_guide_custom_item')
export class JobGuideCustomItem {
  @PrimaryGeneratedColumn({ name: 'custom_item_id', type: 'bigint' })
  customItemId: number;

  @Column({ name: 'user_id', type: 'varchar', length: 50 })
  userId: string;

  @Column({ name: 'template_id', type: 'bigint' })
  templateId: number;

  @Column({ name: 'item_title', type: 'varchar', length: 200 })
  itemTitle: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'item_order', type: 'int' })
  itemOrder: number;

  @Column({ name: 'target_date', type: 'date', nullable: true })
  targetDate: Date | null;

  @Column({ name: 'is_completed', type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ name: 'completed_date', type: 'timestamp', nullable: true })
  completedDate: Date | null;

  @Column({ name: 'created_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @Column({ name: 'modified_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  modifiedDate: Date;
}
