import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePhraseTable1739676500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // tbl_phrase가 이미 존재하면 스킵
    const tableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'tbl_phrase'
      )
    `);

    if (tableExists[0].exists) {
      return;
    }

    await queryRunner.query(`
      CREATE TABLE tbl_phrase (
        phrase_id BIGSERIAL PRIMARY KEY,
        category VARCHAR(20) NOT NULL,
        tone_level INT NOT NULL,
        text VARCHAR(500) NOT NULL,
        created_date DATE DEFAULT CURRENT_TIMESTAMP,
        created_user VARCHAR(100)
      )
    `);

    await queryRunner.query(`
      INSERT INTO tbl_phrase (category, tone_level, text, created_user) VALUES
        ('motivation', 1, '지금 이 순간의 고민이 미래의 나를 더 단단하게 만들어줄 거예요.', 'SYSTEM'),
        ('motivation', 2, '변화를 두려워하지 마세요. 성장은 항상 불편함 속에서 시작됩니다.', 'SYSTEM'),
        ('motivation', 3, '당신의 가치는 연봉이 아닌, 매일 쌓아가는 역량에 있습니다.', 'SYSTEM'),
        ('motivation', 1, '오늘 한 걸음이 내일의 큰 변화를 만듭니다.', 'SYSTEM'),
        ('motivation', 2, '포기하고 싶을 때가 성장에 가장 가까운 순간입니다.', 'SYSTEM'),
        ('motivation', 3, '좋은 기회는 준비된 사람에게 찾아옵니다.', 'SYSTEM'),
        ('motivation', 1, '완벽한 타이밍은 없습니다. 지금이 가장 좋은 때입니다.', 'SYSTEM'),
        ('motivation', 2, '나를 불편하게 하는 환경은 나를 성장시키는 환경입니다.', 'SYSTEM'),
        ('comfort', 1, '힘든 시간도 지나갑니다. 오늘 하루도 수고했어요.', 'SYSTEM'),
        ('comfort', 2, '퇴사를 고민하는 것 자체가 용기 있는 일이에요.', 'SYSTEM'),
        ('comfort', 3, '모든 선택에는 정답이 없어요. 선택한 후 정답으로 만들어가는 거예요.', 'SYSTEM'),
        ('comfort', 1, '지금 느끼는 불안은 자연스러운 거예요. 누구나 그렇습니다.', 'SYSTEM'),
        ('comfort', 2, '쉬어가도 괜찮아요. 잠시 멈추는 것도 전략입니다.', 'SYSTEM'),
        ('comfort', 3, '비교하지 마세요. 당신만의 속도가 있습니다.', 'SYSTEM'),
        ('comfort', 1, '실패는 끝이 아닙니다. 방향을 알려주는 나침반이에요.', 'SYSTEM'),
        ('comfort', 2, '완벽하지 않아도 괜찮아요. 충분히 잘하고 있어요.', 'SYSTEM'),
        ('advice', 1, '이직은 도망이 아닌, 더 나은 환경으로의 이동입니다.', 'SYSTEM'),
        ('advice', 2, '연봉 협상의 핵심은 감정이 아닌 데이터입니다.', 'SYSTEM'),
        ('advice', 3, '면접관은 정답을 원하지 않습니다. 논리적 사고 과정을 봅니다.', 'SYSTEM'),
        ('advice', 1, '이력서의 핵심은 "무엇을 했느냐"가 아닌 "어떤 임팩트를 만들었느냐"입니다.', 'SYSTEM'),
        ('advice', 2, '좋은 회사보다 좋은 팀이 더 중요합니다.', 'SYSTEM'),
        ('advice', 3, '퇴사할 때의 태도가 다음 기회를 결정합니다.', 'SYSTEM'),
        ('advice', 1, '네트워킹은 부탁이 아닙니다. 서로 도움을 주고받는 관계입니다.', 'SYSTEM'),
        ('advice', 2, '채용 시장은 타이밍입니다. 꾸준히 준비하는 사람이 기회를 잡습니다.', 'SYSTEM'),
        ('humor', 1, '월요일이 힘든 건 당신 탓이 아닙니다. 월요일 탓입니다.', 'SYSTEM'),
        ('humor', 2, '야근은 열정이 아닙니다. 비효율의 증거입니다.', 'SYSTEM'),
        ('humor', 3, '"괜찮아, 다 잘 될 거야"는 거짓말이 아닙니다. 준비하면 진짜 잘 됩니다.', 'SYSTEM'),
        ('humor', 1, '이력서에 "잘 참음"은 쓸 수 없지만, 훌륭한 역량이에요.', 'SYSTEM'),
        ('humor', 2, '연봉 인상 없는 칭찬은 0칼로리 음료 같은 거예요.', 'SYSTEM'),
        ('humor', 3, '면접 준비가 시험 공부보다 쉬운 이유: 범위가 정해져 있으니까요.', 'SYSTEM'),
        ('humor', 1, '퇴사 후 첫 월요일 아침, 그 자유를 꿈꿔보세요.', 'SYSTEM'),
        ('humor', 2, '회사는 가족이 아닙니다. 가족은 해고하지 않아요.', 'SYSTEM')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS tbl_phrase CASCADE`);
  }
}
