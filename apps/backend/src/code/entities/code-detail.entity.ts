import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('tbl_code_detail')
export class CodeDetail {
  @PrimaryColumn({ name: 'master_code', length: 100 })
  masterCode: string;

  @PrimaryColumn({ name: 'detail_code', length: 100 })
  detailCode: string;

  @Column({ name: 'detail_code_name', type: 'varchar', length: 100, nullable: true })
  detailCodeName: string | null;

  @Column({ name: 'detail_code_desc', type: 'varchar', length: 100, nullable: true })
  detailCodeDesc: string | null;

  @Column({ name: 'attrbute1', type: 'varchar', length: 100, nullable: true })
  attribute1: string | null;

  @Column({ name: 'attrbute2', type: 'varchar', length: 100, nullable: true })
  attribute2: string | null;

  @Column({ name: 'attrbute3', type: 'varchar', length: 100, nullable: true })
  attribute3: string | null;

  @Column({ name: 'attrbute4', type: 'varchar', length: 100, nullable: true })
  attribute4: string | null;

  @Column({ name: 'attrbute5', type: 'varchar', length: 100, nullable: true })
  attribute5: string | null;

  @Column({ name: 'created_date', type: 'date', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date | null;

  @Column({ name: 'created_user', type: 'varchar', length: 100, nullable: true })
  createdUser: string | null;

  @Column({ name: 'modified_date', type: 'date', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  modifiedDate: Date | null;

  @Column({ name: 'modified_user', type: 'varchar', length: 100, nullable: true })
  modifiedUser: string | null;
}
