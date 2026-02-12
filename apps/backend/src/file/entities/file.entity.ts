import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('tbl_file')
export class FileEntity {
  @PrimaryColumn({ name: 'id', length: 100 })
  id: string;

  @Column({ name: 'original_name', type: 'varchar', length: 500, nullable: true })
  originalName: string | null;

  @Column({ name: 'stored_name', type: 'varchar', length: 500, nullable: true })
  storedName: string | null;

  @Column({ name: 'file_path', type: 'varchar', length: 500, nullable: true })
  filePath: string | null;

  @Column({ name: 'file_size', type: 'int', nullable: true })
  fileSize: number | null;

  @Column({ name: 'content_type', type: 'varchar', length: 10, nullable: true })
  contentType: string | null;

  @Column({ name: 'created_date', type: 'date', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date | null;

  @Column({ name: 'created_user', type: 'varchar', length: 100, nullable: true })
  createdUser: string | null;
}
