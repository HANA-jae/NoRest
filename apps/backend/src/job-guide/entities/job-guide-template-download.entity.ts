import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_job_guide_template_download')
export class JobGuideTemplateDownload {
  @PrimaryGeneratedColumn({ name: 'download_id', type: 'bigint' })
  downloadId: number;

  @Column({ name: 'template_key', type: 'varchar', length: 100, unique: true })
  templateKey: string;

  @Column({ name: 'template_name', type: 'varchar', length: 200 })
  templateName: string;

  @Column({ name: 'template_type', type: 'varchar', length: 50 })
  templateType: string;

  @Column({ name: 'category', type: 'varchar', length: 50 })
  category: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'file_path', type: 'varchar', length: 500 })
  filePath: string;

  @Column({ name: 'file_size', type: 'bigint', nullable: true })
  fileSize: number | null;

  @Column({ name: 'download_count', type: 'bigint', default: 0 })
  downloadCount: number;

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
}
