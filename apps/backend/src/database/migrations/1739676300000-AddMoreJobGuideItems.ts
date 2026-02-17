import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMoreJobGuideItems1739676300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 준비 단계 추가 항목 (template_id=1)
    await queryRunner.query(`
      INSERT INTO tbl_job_guide_item (template_id, item_code, item_title, item_order, description, tips, example_content, reference_links, estimated_hours, is_required)
      VALUES
        (1, 'p5', '현재 회사 퇴직금 예상 계산', 5,
         '현 직장에서 받을 수 있는 퇴직금을 미리 계산합니다. 평균 급여와 근속 연수를 기준으로 예상 금액을 파악하세요.',
         '퇴직금은 최근 3개월 평균 급여 × 근속 연수로 계산됩니다. 상여금, 수당 등이 포함되는지 인사팀에 확인하세요.',
         '계산 예시:\n- 최근 3개월 평균 급여: 400만원\n- 근속 연수: 3년 2개월\n- 예상 퇴직금: 400만원 × 3.17 = 약 1,268만원\n- 미사용 연차: 8일 × 일급 18만원 = 144만원\n- 총 예상 수령액: 약 1,412만원',
         '[{"title": "고용노동부 퇴직금 계산기", "url": "https://www.moel.go.kr/retirementpaycalc.do"}, {"title": "퇴직금 계산 방법 상세", "url": "https://www.nts.go.kr"}]',
         1, false),

        (1, 'p6', '건강보험 임의계속가입 검토', 6,
         '퇴사 후 건강보험 공백을 방지합니다. 직장가입자 자격을 최대 36개월간 유지할 수 있는 임의계속가입 제도를 검토하세요.',
         '퇴사 후 지역가입자로 전환되면 보험료가 크게 오를 수 있습니다. 임의계속가입은 퇴사일로부터 36개월간 직장가입자 보험료를 유지할 수 있어 유리합니다.',
         '비교:\n- 직장가입자 월 보험료: 약 12만원 (본인 부담)\n- 지역가입자 전환 시: 약 25만원 (재산, 소득 기준)\n- 임의계속가입: 약 24만원 (사용자 부담분 포함)\n→ 가입 기간 중 새 직장 입사 시 자동 해지',
         '[{"title": "건강보험 임의계속가입 안내", "url": "https://www.nhis.or.kr"}, {"title": "퇴사 후 4대보험 처리", "url": "https://www.nps.or.kr"}]',
         1, false)
    `);

    // 이력서 단계 추가 항목 (template_id=2)
    await queryRunner.query(`
      INSERT INTO tbl_job_guide_item (template_id, item_code, item_title, item_order, description, tips, example_content, reference_links, estimated_hours, is_required)
      VALUES
        (2, 'r5', '자기소개서 작성', 5,
         '회사별 맞춤 자기소개서를 작성합니다. 지원 동기, 관련 경험, 기여 가능한 부분을 구체적으로 작성하세요.',
         '회사마다 다른 버전을 준비하세요. 회사의 기술 블로그, 채용 공고의 키워드를 자기소개서에 자연스럽게 녹이면 효과적입니다.',
         '구성:\n1. 지원 동기 (왜 이 회사인지 2~3줄)\n2. 관련 경험 (가장 관련 깊은 프로젝트 1~2개)\n3. 기술적 강점 (채용 공고 요구사항과 매칭)\n4. 기여 포부 (구체적으로 어떻게 기여할 것인지)',
         '[{"title": "자기소개서 작성 팁", "url": "https://brunch.co.kr/@supims/685"}, {"title": "개발자 자기소개서 예시", "url": "https://github.com/JSpiner/RESUME"}]',
         3, false),

        (2, 'r6', '추천인 섭외', 6,
         '이전 직장의 상사나 동료에게 추천인을 부탁합니다. 레퍼런스 체크에 대비하세요.',
         '추천인은 미리 허락을 받아야 합니다. 직속 상사, 프로젝트 리드, 시니어 동료 중 2~3명을 섭외하세요. 현재 회사 사람은 비밀 유지가 가능한 경우에만 요청하세요.',
         '준비 사항:\n- 추천인 2~3명 확보\n- 추천인에게 내 지원 포지션/회사 공유\n- 어필 포인트 미리 정리해서 전달\n- 연락처 (이메일, 전화번호) 확보',
         '[{"title": "레퍼런스 체크 대비 가이드", "url": "https://www.wanted.co.kr/community"}]',
         1, false)
    `);

    // 탐색 단계 추가 항목 (template_id=3)
    await queryRunner.query(`
      INSERT INTO tbl_job_guide_item (template_id, item_code, item_title, item_order, description, tips, example_content, reference_links, estimated_hours, is_required)
      VALUES
        (3, 's5', '채용 공고 알림 설정', 5,
         '관심 있는 포지션의 채용 공고 알림을 설정합니다. 원티드, 프로그래머스, LinkedIn 등에서 키워드/회사별 알림을 등록하세요.',
         '키워드를 세분화하면 불필요한 알림을 줄일 수 있습니다. 회사명 + 직무 조합으로 설정하세요.',
         '설정 예시:\n- 원티드: "백엔드 개발자" 키워드 알림\n- LinkedIn: 관심 회사 팔로우 + "Job Alert" 설정\n- 프로그래머스: 기술 스택별 필터 저장\n- 로켓펀치: 스타트업 채용 알림\n\n주 2~3회 확인하여 신규 공고 모니터링',
         '[{"title": "원티드 채용 알림", "url": "https://www.wanted.co.kr"}, {"title": "LinkedIn Job Alerts", "url": "https://www.linkedin.com/jobs"}]',
         1, false),

        (3, 's6', '기업 문화 분석', 6,
         '목표 회사의 기업 문화를 분석합니다. 기술 블로그, 컨퍼런스 발표, SNS, 뉴스 등을 통해 내부 문화를 파악하세요.',
         '기술 블로그가 활발한 회사는 개발 문화가 좋은 경우가 많습니다. GitHub 오픈소스 활동도 좋은 지표입니다.',
         '분석 항목:\n- 기술 블로그 활성도 (월 몇 편, 최근 글 날짜)\n- GitHub 오픈소스 프로젝트 수\n- 컨퍼런스 발표 이력\n- 채용 공고의 기술 스택 트렌드\n- SNS 계정의 사내 행사/분위기\n- 뉴스 기사 (투자, 성장, 이슈)',
         '[{"title": "기업 기술 블로그 모음", "url": "https://github.com/kilimchoi/engineering-blogs"}, {"title": "잡플래닛 기업 리뷰", "url": "https://www.jobplanet.co.kr"}]',
         2, false)
    `);

    // 면접 단계 추가 항목 (template_id=4)
    await queryRunner.query(`
      INSERT INTO tbl_job_guide_item (template_id, item_code, item_title, item_order, description, tips, example_content, reference_links, estimated_hours, is_required)
      VALUES
        (4, 'i5', '모의 면접 연습', 5,
         '실전 면접에 대비하여 모의 면접을 진행합니다. 지인이나 스터디 그룹과 함께 연습하세요.',
         '혼자 거울 보며 연습하는 것보다 실제 상대방과 대화하며 연습하는 것이 효과적입니다. 녹음/녹화하여 피드백을 받으세요.',
         '연습 방법:\n- 지인과 1:1 모의 면접 (30분)\n- 카메라 켜고 Zoom으로 모의 면접\n- 답변을 녹음하고 다시 들어보기\n- 시간 측정 (자기소개 1~2분, 기술 답변 3~5분)\n- 표정, 어투, 속도 체크',
         '[{"title": "모의 면접 체크리스트", "url": "https://brunch.co.kr/@supims/690"}, {"title": "개발자 면접 스터디", "url": "https://github.com/JaeYeopHan/Interview_Question_for_Beginner"}]',
         3, false),

        (4, 'i6', '면접 복장 및 장비 준비', 6,
         '면접 당일 복장과 준비물을 미리 점검합니다. 대면/화상 면접에 맞는 준비를 하세요.',
         '개발자 면접은 보통 비즈니스 캐주얼이면 충분합니다. 화상 면접의 경우 카메라, 마이크, 인터넷 환경을 미리 테스트하세요.',
         '체크리스트:\n- 대면: 깔끔한 복장, 이력서 출력, 필기구, 노트북(코딩테스트 대비)\n- 화상: 카메라/마이크 테스트, 배경 정리, 조명 확인, 예비 이어폰\n- 공통: 면접 장소/링크 확인, 면접관 이름 확인, 30분 전 도착/접속',
         '[{"title": "화상 면접 팁", "url": "https://www.wanted.co.kr/community"}]',
         1, false)
    `);

    // 협상 단계 추가 항목 (template_id=5)
    await queryRunner.query(`
      INSERT INTO tbl_job_guide_item (template_id, item_code, item_title, item_order, description, tips, example_content, reference_links, estimated_hours, is_required)
      VALUES
        (5, 'n5', '입사 후 90일 계획 수립', 5,
         '새 직장에서의 첫 90일 계획을 세웁니다. 온보딩, 팀 적응, 첫 성과 목표를 설정하세요.',
         '면접에서 90일 계획을 이야기하면 좋은 인상을 줄 수 있습니다. 입사 전 미리 준비하면 적응이 빠릅니다.',
         '90일 계획:\n- 1~30일: 온보딩, 코드베이스 파악, 팀원 관계 구축, 개발 환경 세팅\n- 31~60일: 첫 태스크 완료, 코드 리뷰 참여, 팀 프로세스 이해\n- 61~90일: 독립적 업무 수행, 개선 제안, 첫 성과 공유',
         '[{"title": "입사 90일 적응 가이드", "url": "https://brunch.co.kr/@supims/700"}]',
         2, false),

        (5, 'n6', '동종업계 연봉 비교 분석', 6,
         '최종 오퍼를 받은 후 동종업계 연봉과 비교합니다. 연봉뿐 아니라 총 보상(TC)을 기준으로 비교하세요.',
         '연봉만 비교하지 말고 스톡옵션, 보너스, 복리후생을 포함한 총 보상을 비교하세요. 성장 가능성도 고려하세요.',
         '비교 항목:\n- 기본 연봉 vs 시장 평균\n- 총 보상(TC) = 기본급 + 보너스 + 스톡옵션\n- 복리후생 금전 환산 (식대, 자기개발비, 건강보험 등)\n- 연봉 인상률 및 승진 전망\n- 워라밸 가치 환산',
         '[{"title": "개발자 연봉 정보 - 원티드", "url": "https://www.wanted.co.kr/salary"}, {"title": "IT 연봉 리포트", "url": "https://www.jobkorea.co.kr"}]',
         2, false)
    `);

    // 퇴사 단계 추가 항목 (template_id=6)
    await queryRunner.query(`
      INSERT INTO tbl_job_guide_item (template_id, item_code, item_title, item_order, description, tips, example_content, reference_links, estimated_hours, is_required)
      VALUES
        (6, 'res5', '회사 물품 반납 및 계정 정리', 5,
         '회사 장비와 물품을 반납하고, 업무 계정을 정리합니다.',
         '마지막 날 당일에 하면 누락되기 쉽습니다. 퇴사 1주일 전부터 정리를 시작하세요.',
         '반납 목록:\n- 노트북, 모니터, 키보드, 마우스\n- 사원증, 출입카드\n- 법인카드\n- 기타 지급 장비 (헤드셋, 거치대 등)\n\n계정 정리:\n- 업무용 이메일 자동 응답 설정\n- Slack/Teams 상태 변경\n- 개인 데이터 백업 및 삭제\n- 클라우드 접근 권한 확인',
         '[{"title": "퇴사 체크리스트", "url": "https://www.saramin.co.kr"}]',
         2, false),

        (6, 'res6', '개인 자료 백업', 6,
         '업무 중 생성한 개인 학습 자료, 포트폴리오용 자료를 백업합니다. 단, NDA를 위반하지 않는 범위에서만 진행하세요.',
         '회사 기밀 자료는 절대 가져가면 안 됩니다. 자신이 작성한 기술 문서, 학습 노트, 발표 자료 정도만 백업하세요.',
         '백업 대상:\n- 개인 학습 노트 (Notion, 메모)\n- 기술 발표 자료 (공개된 것만)\n- 업무 프로세스 경험 정리 (구체적 수치 제외)\n- 커리어 성과 기록 (이력서 업데이트용)\n\n주의: 소스 코드, 고객 데이터, 내부 문서 반출 금지',
         '[{"title": "퇴사 시 주의사항", "url": "https://www.moel.go.kr"}]',
         1, false)
    `);

    // 빈 참고 링크 채우기
    await queryRunner.query(`
      UPDATE tbl_job_guide_item SET reference_links = '[{"title": "성과급 지급 기준 가이드", "url": "https://www.nts.go.kr"}, {"title": "스톡옵션 행사 시기 판단", "url": "https://www.startupall.kr"}]'
      WHERE item_code = 'p4'
    `);

    await queryRunner.query(`
      UPDATE tbl_job_guide_item SET reference_links = '[{"title": "IT 헤드헌터 활용법", "url": "https://brunch.co.kr/@supims/730"}, {"title": "LinkedIn 헤드헌터 검색 팁", "url": "https://www.linkedin.com/help/linkedin"}]'
      WHERE item_code = 's4'
    `);

    await queryRunner.query(`
      UPDATE tbl_job_guide_item SET reference_links = '[{"title": "면접 역질문 베스트 20", "url": "https://brunch.co.kr/@supims/695"}, {"title": "면접관이 좋아하는 역질문", "url": "https://www.wanted.co.kr/community"}]'
      WHERE item_code = 'i3'
    `);

    await queryRunner.query(`
      UPDATE tbl_job_guide_item SET reference_links = '[{"title": "감사 메일 작성법", "url": "https://brunch.co.kr/@supims/698"}, {"title": "면접 후 팔로업 가이드", "url": "https://www.wanted.co.kr/community"}]'
      WHERE item_code = 'i4'
    `);

    await queryRunner.query(`
      UPDATE tbl_job_guide_item SET reference_links = '[{"title": "IT 기업 복리후생 비교", "url": "https://www.jobplanet.co.kr"}, {"title": "숨은 복리후생 체크리스트", "url": "https://www.wanted.co.kr/community"}]'
      WHERE item_code = 'n2'
    `);

    await queryRunner.query(`
      UPDATE tbl_job_guide_item SET reference_links = '[{"title": "근로계약서 체크포인트", "url": "https://www.moel.go.kr"}, {"title": "경업금지 조항 유의사항", "url": "https://www.law.go.kr"}]'
      WHERE item_code = 'n3'
    `);

    await queryRunner.query(`
      UPDATE tbl_job_guide_item SET reference_links = '[{"title": "입사일 협의 가이드", "url": "https://www.wanted.co.kr/community"}, {"title": "퇴사 절차 및 기간", "url": "https://www.moel.go.kr"}]'
      WHERE item_code = 'n4'
    `);

    await queryRunner.query(`
      UPDATE tbl_job_guide_item SET reference_links = '[{"title": "퇴사 의사 전달법", "url": "https://brunch.co.kr/@supims/710"}, {"title": "원만한 퇴사를 위한 팁", "url": "https://www.saramin.co.kr"}]'
      WHERE item_code = 'res1'
    `);

    await queryRunner.query(`
      UPDATE tbl_job_guide_item SET reference_links = '[{"title": "인수인계 문서 템플릿", "url": "https://www.notion.so/templates"}, {"title": "효과적인 인수인계 방법", "url": "https://brunch.co.kr/@supims/715"}]'
      WHERE item_code = 'res2'
    `);

    await queryRunner.query(`
      UPDATE tbl_job_guide_item SET reference_links = '[{"title": "퇴사 인사 메시지 예시", "url": "https://brunch.co.kr/@supims/720"}, {"title": "LinkedIn 네트워크 관리", "url": "https://www.linkedin.com/help/linkedin"}]'
      WHERE item_code = 'res4'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM tbl_job_guide_item WHERE item_code IN ('p5', 'p6', 'r5', 'r6', 's5', 's6', 'i5', 'i6', 'n5', 'n6', 'res5', 'res6')`);

    // Restore empty reference links
    const codes = ['p4', 's4', 'i3', 'i4', 'n2', 'n3', 'n4', 'res1', 'res2', 'res4'];
    for (const code of codes) {
      await queryRunner.query(`UPDATE tbl_job_guide_item SET reference_links = '[]' WHERE item_code = '${code}'`);
    }
  }
}
