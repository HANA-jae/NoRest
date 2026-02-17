import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { JobGuideItem } from './job-guide-item.entity';

@Entity('tbl_job_guide_template')
export class JobGuideTemplate {
  @PrimaryGeneratedColumn({ name: 'template_id', type: 'bigint' })
  templateId: number;

  @Column({ name: 'phase_id', type: 'varchar', length: 50 })
  phaseId: string;

  @Column({ name: 'phase_num', type: 'varchar', length: 10 })
  phaseNum: string;

  @Column({ name: 'phase_title', type: 'varchar', length: 100 })
  phaseTitle: string;

  @Column({ name: 'phase_order', type: 'int' })
  phaseOrder: number;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'estimated_days', type: 'int', nullable: true })
  estimatedDays: number | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'created_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @Column({ name: 'created_user', type: 'varchar', length: 100, nullable: true })
  createdUser: string | null;

  @Column({ name: 'modified_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  modifiedDate: Date;

  @Column({ name: 'modified_user', type: 'varchar', length: 100, nullable: true })
  modifiedUser: string | null;

  @OneToMany(() => JobGuideItem, (item) => item.template)
  items: JobGuideItem[];
}
