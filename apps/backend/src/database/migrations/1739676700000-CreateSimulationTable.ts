import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSimulationTable1739676700000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE tbl_simulation (
        simulation_id SERIAL PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        completed_step INT NOT NULL DEFAULT 0,
        input_data JSONB,
        result_data JSONB,
        created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        modified_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE INDEX idx_simulation_user_id ON tbl_simulation (user_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS tbl_simulation`);
  }
}
