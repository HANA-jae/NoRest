import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixUserDateColumns1739676600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // last_login: 비정상 텍스트 데이터를 NULL로 정리 후 varchar → timestamp 변환
    await queryRunner.query(`
      UPDATE tbl_user_info SET last_login = NULL
        WHERE last_login !~ '^\\d{4}-\\d{2}-\\d{2}' OR last_login IS NOT NULL AND trim(last_login) = ''
    `);
    await queryRunner.query(`
      ALTER TABLE tbl_user_info
        ALTER COLUMN last_login TYPE timestamp USING last_login::timestamp
    `);

    // created_date: date → timestamp
    await queryRunner.query(`
      ALTER TABLE tbl_user_info
        ALTER COLUMN created_date TYPE timestamp USING created_date::timestamp
    `);

    // modified_date: date → timestamp
    await queryRunner.query(`
      ALTER TABLE tbl_user_info
        ALTER COLUMN modified_date TYPE timestamp USING modified_date::timestamp
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE tbl_user_info
        ALTER COLUMN last_login TYPE varchar(10) USING
          CASE WHEN last_login IS NOT NULL THEN to_char(last_login, 'YYYY-MM-DD') ELSE NULL END
    `);

    await queryRunner.query(`
      ALTER TABLE tbl_user_info
        ALTER COLUMN created_date TYPE date USING created_date::date
    `);

    await queryRunner.query(`
      ALTER TABLE tbl_user_info
        ALTER COLUMN modified_date TYPE date USING modified_date::date
    `);
  }
}
