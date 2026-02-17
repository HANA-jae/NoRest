import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedJobGuideData1739676100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert 6 phases
    await queryRunner.query(`
      INSERT INTO tbl_job_guide_template (phase_id, phase_num, phase_title, phase_order, description, estimated_days)
      VALUES
        ('preparation', '01', '준비', 1, '이직 준비 단계: 목표 설정과 현황 분석', 14),
        ('resume', '02', '이력서', 2, '이력서 및 포트폴리오 작성 단계', 7),
        ('search', '03', '탐색', 3, '목표 회사 탐색 및 네트워킹 단계', 14),
        ('interview', '04', '면접', 4, '면접 준비 및 진행 단계', 21),
        ('negotiation', '05', '협상', 5, '연봉 협상 및 계약 단계', 7),
        ('resignation', '06', '퇴사', 6, '퇴사 및 이직 마무리 단계', 14)
    `);

    // Insert 24 items (preparation - 4 items)
    await queryRunner.query(`
      INSERT INTO tbl_job_guide_item (template_id, item_code, item_title, item_order, description, tips, example_content, reference_links, estimated_hours, is_required)
      VALUES
        -- Preparation
        (1, 'p1', '이직 목표 정리 (연봉/성장/워라밸)', 1,
         '이직의 명확한 목표를 설정합니다. 연봉 인상, 커리어 성장, 워라밸 개선 등 우선순위를 정합니다.',
         '우선순위를 명확히 하고, 최소 기대치와 최대 기대치를 함께 정리하세요. 이직 사유를 3가지 이내로 명확히 하면 회사 선택과 면접에서 일관성 있는 메시지를 전달할 수 있습니다.',
         '예시:\n- 1순위: 연봉 20% 인상 (현재 4500만원 → 목표 5400만원)\n- 2순위: 기술 스택 확장 (React → React + TypeScript + Next.js)\n- 3순위: 워라밸 개선 (주 52시간 → 주 40시간)',
         '[{"title": "이직 시기 판단 체크리스트", "url": "https://brunch.co.kr/@supims/664"}, {"title": "연봉 협상 가이드", "url": "https://www.wanted.co.kr/events/22_12_s03_b01"}]',
         2, true),

        (1, 'p2', '시장 가치 파악', 2,
         '현재 직급과 경력에 맞는 시장 연봉을 조사합니다. 동종업계, 유사 직무의 연봉 데이터를 수집하여 협상 근거를 마련합니다.',
         '사람인, 잡코리아, 원티드 등의 연봉 정보와 동종업계 지인 네트워킹을 활용하세요. 링크드인에서 비슷한 경력의 사람들을 찾아 메시지를 보내는 것도 좋은 방법입니다.',
         '조사 항목:\n- 내 직급/경력(예: 5년차 백엔드 개발자)의 평균 연봉\n- 목표 회사의 연봉 범위\n- 주요 기술 스택별 프리미엄(예: AWS 경험 +5%, Kubernetes +7%)\n- 지역별 차이(서울 vs 판교 vs 강남)',
         '[{"title": "개발자 연봉 정보 - 원티드", "url": "https://www.wanted.co.kr/salary"}, {"title": "잡코리아 연봉계산기", "url": "https://www.jobkorea.co.kr/goodjob/tip/salaryCalculator"}]',
         3, true),

        (1, 'p3', '비상금 확보 (3개월 이상)', 3,
         '이직 기간 동안의 생활비를 준비합니다. 평균 이직 기간은 2~6개월이므로 최소 3개월치 생활비를 확보하세요.',
         '급여일 기준으로 계산하되, 퇴직금과 연차 수당도 고려하세요. 이직 활동 중 수입이 없을 수 있으므로 여유 자금을 준비하는 것이 심리적 안정에 도움이 됩니다.',
         '예시:\n- 월 생활비: 300만원\n- 필요 비상금: 900만원(3개월)\n- 예상 퇴직금: 500만원\n- 부족분: 400만원 → 추가 저축 필요',
         '[{"title": "퇴직금 계산기", "url": "https://www.moel.go.kr/retirementpaycalc.do"}]',
         1, true),

        (1, 'p4', '타이밍 검토 (성과급/스톡옵션)', 4,
         '퇴사 시기를 전략적으로 결정합니다. 성과급 지급일, 스톡옵션 베스팅 일정, 프로젝트 마일스톤을 고려하세요.',
         '성과급 지급일 이후, 스톡옵션 베스팅 직후, 또는 중요 프로젝트 완료 후가 좋은 타이밍입니다. 1~2개월 여유를 두고 계획하세요.',
         '체크리스트:\n- 성과급 지급 예정일: 2026년 3월 15일\n- 스톡옵션 베스팅: 다음 라운드 2026년 8월\n- 진행 중인 중요 프로젝트: 2월 말 출시 예정\n→ 최적 퇴사 시기: 3월 말~4월 초',
         '[]',
         2, false)
    `);

    // Resume items
    await queryRunner.query(`
      INSERT INTO tbl_job_guide_item (template_id, item_code, item_title, item_order, description, tips, example_content, reference_links, estimated_hours, is_required)
      VALUES
        (2, 'r1', '이력서 최신화', 1,
         '최근 경력과 성과를 반영하여 이력서를 업데이트합니다. 최근 3개월~1년간의 주요 성과를 중심으로 작성합니다.',
         '양식보다 내용이 중요합니다. 역순 시간순(최신 경력이 위)으로 작성하고, 각 경력마다 주요 성과를 3~5개씩 작성하세요.',
         '작성 팁:\n- 회사명, 기간, 직급, 주요 업무 명시\n- 사용 기술 스택 나열\n- 담당 프로젝트와 역할 설명\n- 정량적 성과 강조',
         '[{"title": "이력서 작성 가이드 - 원티드", "url": "https://www.wanted.co.kr/community/post/11"}, {"title": "개발자 이력서 예시", "url": "https://github.com/JSpiner/RESUME"}]',
         4, true),

        (2, 'r2', '성과 정량화 (전환율/트래픽/매출)', 2,
         '업무 성과를 숫자로 표현합니다. 전환율 개선, 트래픽 증가, 매출 기여, 처리 시간 단축 등 측정 가능한 지표로 작성하세요.',
         '비교 가능한 수치(이전 대비 몇 % 개선)가 가장 효과적입니다. 정량화가 어려운 경우 정성적 성과라도 구체적으로 작성하세요.',
         '예시:\n- "웹사이트 성능 개선" → "페이지 로딩 속도 3.2초에서 1.1초로 65% 단축"\n- "API 개발" → "일 평균 100만 건 처리하는 RESTful API 설계 및 구현"\n- "버그 수정" → "월평균 버그 발생 건수 45건에서 12건으로 73% 감소"',
         '[{"title": "성과 작성법 - STAR 기법", "url": "https://brunch.co.kr/@supims/677"}]',
         3, true),

        (2, 'r3', '포트폴리오 정리', 3,
         '개인 프로젝트, 오픈소스 기여, 기술 블로그 등을 정리합니다. GitHub, 블로그, 발표 자료 링크를 준비하세요.',
         'README를 잘 작성하고, 코드 품질을 높이세요. 실무 프로젝트는 NDA를 고려하여 공개 가능한 범위만 포함하세요.',
         '포함 항목:\n- GitHub 프로필 정리 (Pinned Repositories 설정)\n- 대표 프로젝트 3~5개 (README, 스크린샷, 배포 링크)\n- 기술 블로그 주소 (최근 1년 내 글이 있으면 좋음)\n- 컨퍼런스 발표, 오픈소스 기여 내역',
         '[{"title": "포트폴리오 작성 가이드", "url": "https://developers.google.com/community/experts/become-an-expert"}]',
         5, true),

        (2, 'r4', 'LinkedIn 업데이트', 4,
         'LinkedIn 프로필을 최신화하고 네트워킹을 시작합니다. 헤드헌터와 리쿠르터가 찾을 수 있도록 키워드를 최적화하세요.',
         '프로필 사진, 헤드라인, 요약, 경력 사항을 모두 채우세요. 영어로도 작성하면 글로벌 기회가 늘어납니다.',
         '체크리스트:\n- 프로필 사진 (전문적인 사진)\n- 헤드라인 (예: Senior Backend Engineer | Node.js, AWS, Kubernetes)\n- 요약 (3~5줄로 핵심 역량 어필)\n- 경력 사항 (이력서와 동일하게)\n- 추천서 요청 (전 직장 동료/상사)',
         '[{"title": "LinkedIn 최적화 가이드", "url": "https://www.linkedin.com/help/linkedin"}]',
         2, false)
    `);

    // Search items
    await queryRunner.query(`
      INSERT INTO tbl_job_guide_item (template_id, item_code, item_title, item_order, description, tips, example_content, reference_links, estimated_hours, is_required)
      VALUES
        (3, 's1', '목표 회사 리스트업 (10~20개)', 1,
         '관심 있는 회사를 리스트업합니다. 규모, 업종, 기술 스택, 복리후생 등을 기준으로 우선순위를 정하세요.',
         '너무 적으면 선택지가 부족하고, 너무 많으면 관리가 어렵습니다. 10~20개 정도가 적당합니다.',
         '분류 기준:\n- 1순위 (꼭 지원): 5개\n- 2순위 (관심 있음): 10개\n- 3순위 (기회 되면): 5개\n\n확인 사항:\n- 회사 규모 (스타트업/중견/대기업)\n- 주요 서비스/제품\n- 기술 스택\n- 평균 연봉대\n- 워라밸',
         '[{"title": "원티드", "url": "https://www.wanted.co.kr"}, {"title": "프로그래머스", "url": "https://programmers.co.kr/job"}]',
         3, true),

        (3, 's2', '회사 리뷰 조사 (잡플래닛/블라인드)', 2,
         '잡플래닛, 블라인드 등에서 회사 리뷰를 확인합니다. 연봉, 복리후생, 워라밸, 승진, 사내 문화 등을 파악하세요.',
         '리뷰는 참고만 하고, 너무 맹신하지 마세요. 최근 리뷰(1년 이내)를 중심으로 보고, 극단적인 리뷰는 걸러내세요.',
         '확인 항목:\n- 평균 평점 (3.5 이상이면 양호)\n- 연봉 정보 (직급별/연차별)\n- 워라밸 (야근 빈도, 주말 근무)\n- 복리후생 (식대, 간식, 건강검진, 자기개발비)\n- 퇴사 사유 (가장 많이 언급되는 이유)',
         '[{"title": "잡플래닛", "url": "https://www.jobplanet.co.kr"}, {"title": "블라인드", "url": "https://www.teamblind.com"}]',
         2, true),

        (3, 's3', '네트워크 활용 (지인 추천)', 3,
         '지인 네트워크를 활용하여 내부 정보를 얻고, 추천을 받습니다. LinkedIn, 동문회, 커뮤니티를 활용하세요.',
         '지인 추천은 합격률이 높고, 내부 정보를 얻을 수 있는 가장 좋은 방법입니다. 부담스럽지 않게 먼저 정보를 묻고, 자연스럽게 추천을 부탁하세요.',
         '활용 방법:\n- LinkedIn에서 목표 회사 재직자 검색\n- 커피챗 요청 (20~30분)\n- 회사 문화, 업무 방식 질문\n- 채용 프로세스 정보 확인\n- 추천 가능 여부 확인',
         '[{"title": "커피챗 요청 메시지 예시", "url": "https://brunch.co.kr/@supims/720"}]',
         4, false),

        (3, 's4', '헤드헌터 컨택', 4,
         '헤드헌터를 통해 숨은 기회를 찾습니다. LinkedIn이나 이메일로 헤드헌터에게 먼저 연락하세요.',
         '헤드헌터는 공개되지 않은 포지션을 많이 알고 있습니다. 여러 헤드헌터와 연락하되, 동일 회사에 중복 지원하지 않도록 주의하세요.',
         '컨택 방법:\n- LinkedIn에서 "IT 헤드헌터" 검색\n- 이력서와 희망 조건 전달\n- 정기적으로 연락 유지\n- 피드백 요청',
         '[]',
         2, false)
    `);

    // Interview items
    await queryRunner.query(`
      INSERT INTO tbl_job_guide_item (template_id, item_code, item_title, item_order, description, tips, example_content, reference_links, estimated_hours, is_required)
      VALUES
        (4, 'i1', '예상 질문 준비 (자기소개/경력)', 1,
         '자주 나오는 면접 질문에 대한 답변을 준비합니다. 자기소개, 이직 사유, 장단점, 갈등 해결 경험 등을 준비하세요.',
         'STAR 기법(Situation, Task, Action, Result)을 활용하여 구체적으로 답변하세요. 2분 이내로 간결하게 답변하는 연습이 중요합니다.',
         '필수 질문:\n1. 자기소개 (1~2분)\n2. 이직 사유\n3. 지원 동기\n4. 강점과 약점\n5. 가장 어려웠던 프로젝트와 해결 과정\n6. 팀 내 갈등 경험과 해결\n7. 5년 후 커리어 목표',
         '[{"title": "면접 질문 모음", "url": "https://github.com/JaeYeopHan/Interview_Question_for_Beginner"}]',
         4, true),

        (4, 'i2', '기술 면접 대비 (CS/코딩테스트)', 2,
         '기술 면접과 코딩 테스트를 준비합니다. 자료구조, 알고리즘, CS 기초, 사용 기술 스택을 복습하세요.',
         '하루 1~2문제씩 꾸준히 푸는 것이 좋습니다. 프로그래머스, 백준, LeetCode를 활용하세요.',
         '준비 항목:\n- 자료구조: 배열, 리스트, 스택, 큐, 트리, 그래프\n- 알고리즘: 정렬, 탐색, DP, 그리디\n- CS 기초: 네트워크, OS, DB\n- 프레임워크/라이브러리 원리\n- 최근 프로젝트 기술 상세 설명',
         '[{"title": "프로그래머스", "url": "https://programmers.co.kr"}, {"title": "백준", "url": "https://www.acmicpc.net"}]',
         10, true),

        (4, 'i3', '역질문 준비 (5~10개)', 3,
         '면접관에게 할 질문을 준비합니다. 회사, 팀, 업무, 성장 기회에 대한 질문을 5~10개 준비하세요.',
         '연봉이나 복리후생은 마지막 면접에서 물어보세요. 업무 환경, 팀 문화, 성장 기회에 대한 질문이 좋은 인상을 줍니다.',
         '질문 예시:\n- 이 포지션의 주요 업무는 무엇인가요?\n- 팀 구성과 협업 방식은 어떻게 되나요?\n- 온보딩 프로세스는 어떻게 진행되나요?\n- 성장과 학습을 위한 지원은 어떤 것이 있나요?\n- 이 포지션에서 성공하는 사람의 특징은 무엇인가요?',
         '[]',
         2, true),

        (4, 'i4', '감사 메일 발송', 4,
         '면접 후 24시간 이내에 감사 메일을 보냅니다. 간단한 감사 인사와 함께 면접에서 나온 질문에 대한 보충 답변을 추가하세요.',
         '너무 길거나 형식적이지 않게, 3~5문장 정도로 간결하게 작성하세요.',
         '예시:\n"안녕하세요, 오늘 면접 기회를 주셔서 감사합니다.\n○○ 포지션에 대해 더 깊이 이해할 수 있었고, 팀의 비전에 공감했습니다.\n면접 중 질문하신 △△에 대해 추가로 말씀드리자면, [보충 내용]입니다.\n좋은 소식 기다리겠습니다. 감사합니다."',
         '[]',
         1, false)
    `);

    // Negotiation items
    await queryRunner.query(`
      INSERT INTO tbl_job_guide_item (template_id, item_code, item_title, item_order, description, tips, example_content, reference_links, estimated_hours, is_required)
      VALUES
        (5, 'n1', '연봉 협상 (희망 연봉 vs 최소 연봉)', 1,
         '연봉 협상을 준비합니다. 희망 연봉과 최소 수용 가능 연봉을 미리 정하세요.',
         '먼저 제시하지 말고, 회사에서 먼저 제시하도록 유도하세요. 시장 가치 조사 결과를 근거로 협상하세요.',
         '협상 전략:\n- 희망 연봉: 5500만원\n- 최소 연봉: 5000만원\n- 근거: 동종업계 5년차 평균 5200만원, 내 성과와 역량 고려 시 +300만원\n- 첫 제시가 낮으면: "제 경력과 역량을 고려하면 ○○만원이 적정하다고 생각합니다"\n- 추가 협상: 스톡옵션, 사이닝 보너스, 재택 근무',
         '[{"title": "연봉 협상 가이드", "url": "https://www.wanted.co.kr/events/22_12_s03_b01"}]',
         2, true),

        (5, 'n2', '복리후생 확인', 2,
         '복리후생을 상세히 확인합니다. 식대, 교통비, 자기개발비, 건강검진, 휴가, 재택 근무 등을 확인하세요.',
         '연봉만큼 중요한 것이 복리후생입니다. 숨어 있는 복리후생도 꼼꼼히 확인하세요.',
         '확인 항목:\n- 식대/석식 지원\n- 교통비/주차비\n- 자기개발비 (도서, 강의, 컨퍼런스)\n- 건강검진 (본인/가족)\n- 연차 개수 및 사용 문화\n- 재택 근무 가능 여부\n- 휴게 시설\n- 스톡옵션',
         '[]',
         1, true),

        (5, 'n3', '계약서 검토', 3,
         '근로계약서를 꼼꼼히 검토합니다. 연봉, 근무 시간, 업무 범위, 계약 기간, 퇴직금, 경업 금지 조항 등을 확인하세요.',
         '이해되지 않는 조항은 반드시 질문하세요. 필요하면 법률 자문을 받으세요.',
         '확인 사항:\n- 정확한 연봉 (세전/세후)\n- 근무 시간 (주 40시간? 52시간?)\n- 업무 범위\n- 계약 기간 (정규직? 계약직?)\n- 퇴직금 산정 방식\n- 경업 금지 조항 (퇴사 후 동종업계 이직 제한)\n- 비밀유지 서약',
         '[]',
         2, true),

        (5, 'n4', '입사일 협의 (퇴사 기간 고려)', 4,
         '입사일을 협의합니다. 현 직장의 퇴사 절차와 법정 통지 기간을 고려하여 여유 있게 잡으세요.',
         '법정 통지 기간은 최소 30일입니다. 인수인계와 휴식 기간을 고려하여 45~60일 정도가 적당합니다.',
         '일정 계산:\n- 퇴사 의사 전달: 3월 1일\n- 법정 퇴사일: 3월 31일\n- 여유 기간 (휴식/인수인계): +2주\n- 희망 입사일: 4월 15일\n\n협의 시: "현 직장 인수인계와 휴식을 고려하여 4월 15일 입사를 희망합니다"',
         '[]',
         1, true)
    `);

    // Resignation items
    await queryRunner.query(`
      INSERT INTO tbl_job_guide_item (template_id, item_code, item_title, item_order, description, tips, example_content, reference_links, estimated_hours, is_required)
      VALUES
        (6, 'res1', '퇴사 의사 전달 (상사 → 인사팀)', 1,
         '퇴사 의사를 전달합니다. 먼저 직속 상사에게 구두로 알린 후, 인사팀에 공식 문서를 제출하세요.',
         '최소 30일 전에 통보하세요. 감정적으로 대응하지 말고, 전문적으로 마무리하세요.',
         '전달 순서:\n1. 직속 상사와 1:1 미팅 요청\n2. 퇴사 의사와 사유 간략히 설명\n3. 퇴사 희망일 전달\n4. 인사팀에 퇴사 신청서 제출\n\n말투 예시:\n"성장 기회를 찾아 이직을 결정했습니다. ○월 ○일자로 퇴사하고자 합니다. 원활한 인수인계를 위해 최선을 다하겠습니다."',
         '[]',
         1, true),

        (6, 'res2', '인수인계 (문서화/미팅)', 2,
         '업무를 후임자 또는 팀원에게 인수인계합니다. 문서화를 철저히 하고, 인수인계 미팅을 진행하세요.',
         '인수인계 문서는 누가 봐도 이해할 수 있도록 상세히 작성하세요. 미래의 나를 위해서도 좋은 습관입니다.',
         '인수인계 항목:\n- 담당 업무 목록 및 프로세스\n- 주요 프로젝트 현황 및 일정\n- 주요 연락처 (고객, 협력사, 내부 담당자)\n- 시스템 접근 권한 및 계정 정보\n- 미완료 업무 및 이슈\n- 주의 사항 및 팁',
         '[]',
         8, true),

        (6, 'res3', '퇴직금 및 4대보험 정산', 3,
         '퇴직금과 4대보험을 정산합니다. 퇴직금 계산이 정확한지 확인하고, 4대보험 상실 신고를 확인하세요.',
         '퇴직금은 마지막 3개월 평균 급여 기준으로 계산됩니다. 연차 수당도 함께 받으세요.',
         '확인 사항:\n- 퇴직금 계산 (평균 급여 × 근속 연수)\n- 미사용 연차 수당\n- 4대보험 상실 신고 (퇴사일 다음 날 자동 처리)\n- 다음 회사 입사 전까지 임의계속가입 고려',
         '[{"title": "퇴직금 계산기", "url": "https://www.moel.go.kr/retirementpaycalc.do"}]',
         2, true),

        (6, 'res4', '동료 인사 (감사 인사)', 4,
         '함께 일한 동료들에게 감사 인사를 전합니다. 개인적으로 연락하거나, 팀 전체에 메시지를 보내세요.',
         '관계는 계속됩니다. 좋은 인상을 남기고, 네트워크를 유지하세요.',
         '인사 방법:\n- 직접 대화 (가까운 동료)\n- 감사 메시지 (팀 전체, 협업 부서)\n- 작별 인사 (마지막 날 전체 공지)\n- LinkedIn 연결 유지\n\n메시지 예시:\n"그동안 함께 일하며 많이 배웠습니다. 새로운 도전을 시작하지만, 언제든 연락 주세요. 감사했습니다!"',
         '[]',
         2, true)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM tbl_job_guide_item`);
    await queryRunner.query(`DELETE FROM tbl_job_guide_template`);
  }
}
