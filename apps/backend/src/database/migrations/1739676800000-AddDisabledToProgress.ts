import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDisabledToProgress1739676800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE tbl_job_guide_progress ADD COLUMN IF NOT EXISTS is_disabled BOOLEAN NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE tbl_job_guide_progress DROP COLUMN IF EXISTS is_disabled`,
    );
  }
}
