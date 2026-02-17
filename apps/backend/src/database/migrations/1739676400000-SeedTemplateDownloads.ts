import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTemplateDownloads1739676400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO tbl_job_guide_template_download
        (template_key, template_name, template_type, category, description, file_path, file_size)
      VALUES
        ('resume-basic', '기본 이력서 템플릿', 'DOCX', '이력서',
         '깔끔하고 범용적인 기본 이력서 양식입니다. 경력 사항, 학력, 자격증, 기술 스택을 체계적으로 정리할 수 있습니다.',
         '/templates/resume-basic.docx', 45056),

        ('resume-developer', '개발자 이력서 템플릿', 'DOCX', '이력서',
         '개발자 특화 이력서 양식입니다. 기술 스택, 프로젝트 경험, GitHub/포트폴리오 링크를 강조하는 구조입니다.',
         '/templates/resume-developer.docx', 52224),

        ('cover-letter', '자기소개서 템플릿', 'DOCX', '이력서',
         '이직 면접용 자기소개서 양식입니다. 지원 동기, 핵심 역량, 성장 목표를 체계적으로 작성할 수 있습니다.',
         '/templates/cover-letter.docx', 38912),

        ('checklist-pdf', '이직 체크리스트 PDF', 'PDF', '가이드',
         '이직 준비부터 퇴사까지 전 과정을 한눈에 볼 수 있는 체크리스트입니다. 인쇄하여 책상에 붙여두세요.',
         '/templates/checklist.pdf', 204800),

        ('interview-questions', '면접 질문 모음', 'PDF', '면접',
         '실제 IT 기업에서 자주 나오는 인성 면접 질문 50선과 모범 답변 가이드입니다.',
         '/templates/interview-questions.pdf', 163840),

        ('salary-negotiation', '연봉 협상 가이드', 'PDF', '협상',
         '연봉 협상 전략, 대화 예시, 협상 시 주의사항을 정리한 실전 가이드입니다.',
         '/templates/salary-negotiation.pdf', 143360),

        ('resignation-letter', '퇴사 통보서 양식', 'DOCX', '퇴사',
         '법적으로 유효한 퇴사 통보서 양식입니다. 퇴사일, 사유를 명확히 작성할 수 있습니다.',
         '/templates/resignation-letter.docx', 28672),

        ('handover-doc', '인수인계 문서 템플릿', 'DOCX', '퇴사',
         '인수인계에 필요한 항목들을 체계적으로 정리할 수 있는 문서 양식입니다. 업무 목록, 프로세스, 계정 정보 등을 포함합니다.',
         '/templates/handover-doc.docx', 40960)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM tbl_job_guide_template_download`);
  }
}
