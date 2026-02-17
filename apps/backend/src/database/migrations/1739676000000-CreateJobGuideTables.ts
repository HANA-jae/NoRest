import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateJobGuideTables1739676000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. tbl_job_guide_template
    await queryRunner.query(`
      CREATE TABLE tbl_job_guide_template (
        template_id BIGSERIAL PRIMARY KEY,
        phase_id VARCHAR(50) NOT NULL,
        phase_num VARCHAR(10) NOT NULL,
        phase_title VARCHAR(100) NOT NULL,
        phase_order INT NOT NULL,
        description TEXT,
        estimated_days INT,
        is_active BOOLEAN DEFAULT true,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_user VARCHAR(100),
        modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_user VARCHAR(100)
      )
    `);

    // 2. tbl_job_guide_item
    await queryRunner.query(`
      CREATE TABLE tbl_job_guide_item (
        item_id BIGSERIAL PRIMARY KEY,
        template_id BIGINT NOT NULL REFERENCES tbl_job_guide_template(template_id) ON DELETE CASCADE,
        item_code VARCHAR(50) NOT NULL UNIQUE,
        item_title VARCHAR(200) NOT NULL,
        item_order INT NOT NULL,
        description TEXT,
        tips TEXT,
        example_content TEXT,
        reference_links JSONB,
        estimated_hours INT,
        is_required BOOLEAN DEFAULT true,
        is_active BOOLEAN DEFAULT true,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_user VARCHAR(100),
        modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_user VARCHAR(100)
      )
    `);

    await queryRunner.query(`
      CREATE INDEX idx_item_template ON tbl_job_guide_item(template_id)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_item_code ON tbl_job_guide_item(item_code)
    `);

    // 3. tbl_job_guide_progress
    await queryRunner.query(`
      CREATE TABLE tbl_job_guide_progress (
        progress_id BIGSERIAL PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL REFERENCES tbl_user_info(user_id) ON DELETE CASCADE,
        item_code VARCHAR(50) NOT NULL REFERENCES tbl_job_guide_item(item_code),
        is_completed BOOLEAN DEFAULT false,
        target_date DATE,
        completed_date TIMESTAMP,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, item_code)
      )
    `);

    await queryRunner.query(`
      CREATE INDEX idx_progress_user ON tbl_job_guide_progress(user_id)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_progress_item ON tbl_job_guide_progress(item_code)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_progress_target_date ON tbl_job_guide_progress(target_date)
    `);

    // 4. tbl_job_guide_note
    await queryRunner.query(`
      CREATE TABLE tbl_job_guide_note (
        note_id BIGSERIAL PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL REFERENCES tbl_user_info(user_id) ON DELETE CASCADE,
        item_code VARCHAR(50) REFERENCES tbl_job_guide_item(item_code) ON DELETE CASCADE,
        template_id BIGINT REFERENCES tbl_job_guide_template(template_id) ON DELETE CASCADE,
        note_type VARCHAR(20) NOT NULL,
        content TEXT NOT NULL,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CHECK (
          (note_type = 'ITEM' AND item_code IS NOT NULL AND template_id IS NULL) OR
          (note_type = 'PHASE' AND template_id IS NOT NULL AND item_code IS NULL)
        )
      )
    `);

    await queryRunner.query(`
      CREATE INDEX idx_note_user ON tbl_job_guide_note(user_id)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_note_item ON tbl_job_guide_note(item_code)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_note_template ON tbl_job_guide_note(template_id)
    `);

    // 5. tbl_job_guide_custom_item
    await queryRunner.query(`
      CREATE TABLE tbl_job_guide_custom_item (
        custom_item_id BIGSERIAL PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL REFERENCES tbl_user_info(user_id) ON DELETE CASCADE,
        template_id BIGINT NOT NULL REFERENCES tbl_job_guide_template(template_id) ON DELETE CASCADE,
        item_title VARCHAR(200) NOT NULL,
        description TEXT,
        item_order INT NOT NULL,
        target_date DATE,
        is_completed BOOLEAN DEFAULT false,
        completed_date TIMESTAMP,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE INDEX idx_custom_item_user ON tbl_job_guide_custom_item(user_id)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_custom_item_template ON tbl_job_guide_custom_item(template_id)
    `);

    // 6. tbl_job_guide_template_download
    await queryRunner.query(`
      CREATE TABLE tbl_job_guide_template_download (
        download_id BIGSERIAL PRIMARY KEY,
        template_key VARCHAR(100) NOT NULL UNIQUE,
        template_name VARCHAR(200) NOT NULL,
        template_type VARCHAR(50) NOT NULL,
        category VARCHAR(50) NOT NULL,
        description TEXT,
        file_path VARCHAR(500) NOT NULL,
        file_size BIGINT,
        download_count BIGINT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_user VARCHAR(100),
        modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_user VARCHAR(100)
      )
    `);

    await queryRunner.query(`
      CREATE INDEX idx_template_category ON tbl_job_guide_template_download(category)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS tbl_job_guide_template_download CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS tbl_job_guide_custom_item CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS tbl_job_guide_note CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS tbl_job_guide_progress CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS tbl_job_guide_item CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS tbl_job_guide_template CASCADE`);
  }
}
