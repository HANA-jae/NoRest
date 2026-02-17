import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixUserInfoPrimaryKey1739675900000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // tbl_user_info에 PK가 없으면 추가
    const pk = await queryRunner.query(`
      SELECT con.conname
      FROM pg_constraint con
      JOIN pg_class rel ON rel.oid = con.conrelid
      WHERE rel.relname = 'tbl_user_info' AND con.contype = 'p'
    `);

    if (pk.length === 0) {
      await queryRunner.query(`
        ALTER TABLE tbl_user_info ADD PRIMARY KEY (user_id)
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE tbl_user_info DROP CONSTRAINT IF EXISTS tbl_user_info_pkey
    `);
  }
}
