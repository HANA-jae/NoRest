import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum NoteType {
  ITEM = 'ITEM',
  PHASE = 'PHASE',
}

@Entity('tbl_job_guide_note')
export class JobGuideNote {
  @PrimaryGeneratedColumn({ name: 'note_id', type: 'bigint' })
  noteId: number;

  @Column({ name: 'user_id', type: 'varchar', length: 50 })
  userId: string;

  @Column({ name: 'item_code', type: 'varchar', length: 50, nullable: true })
  itemCode: string | null;

  @Column({ name: 'template_id', type: 'bigint', nullable: true })
  templateId: number | null;

  @Column({ name: 'note_type', type: 'varchar', length: 20 })
  noteType: NoteType;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @Column({ name: 'created_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @Column({ name: 'modified_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  modifiedDate: Date;
}
