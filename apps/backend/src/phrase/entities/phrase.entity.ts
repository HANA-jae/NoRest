import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_phrase')
export class Phrase {
  @PrimaryGeneratedColumn({ name: 'phrase_id', type: 'bigint' })
  id: number;

  @Column({ name: 'category', type: 'varchar', length: 20 })
  category: string;

  @Column({ name: 'tone_level', type: 'int' })
  toneLevel: number;

  @Column({ name: 'text', type: 'varchar', length: 500 })
  text: string;

  @Column({ name: 'created_date', type: 'date', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date | null;

  @Column({ name: 'created_user', type: 'varchar', length: 100, nullable: true })
  createdUser: string | null;
}
