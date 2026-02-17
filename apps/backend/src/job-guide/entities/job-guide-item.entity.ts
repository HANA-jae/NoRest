import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { JobGuideTemplate } from './job-guide-template.entity';

@Entity('tbl_job_guide_item')
export class JobGuideItem {
  @PrimaryGeneratedColumn({ name: 'item_id', type: 'bigint' })
  itemId: number;

  @Column({ name: 'template_id', type: 'bigint' })
  templateId: number;

  @Column({ name: 'item_code', type: 'varchar', length: 50, unique: true })
  itemCode: string;

  @Column({ name: 'item_title', type: 'varchar', length: 200 })
  itemTitle: string;

  @Column({ name: 'item_order', type: 'int' })
  itemOrder: number;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'tips', type: 'text', nullable: true })
  tips: string | null;

  @Column({ name: 'example_content', type: 'text', nullable: true })
  exampleContent: string | null;

  @Column({ name: 'reference_links', type: 'jsonb', nullable: true })
  referenceLinks: Array<{ title: string; url: string }> | null;

  @Column({ name: 'estimated_hours', type: 'int', nullable: true })
  estimatedHours: number | null;

  @Column({ name: 'is_required', type: 'boolean', default: true })
  isRequired: boolean;

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

  @ManyToOne(() => JobGuideTemplate, (template) => template.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'template_id' })
  template: JobGuideTemplate;
}
