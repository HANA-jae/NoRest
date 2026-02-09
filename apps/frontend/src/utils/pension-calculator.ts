// 퇴직연금 계산기 유틸리티

export type PensionType = 'DB' | 'DC' | 'IRP';

export interface PensionInput {
  monthlySalary: number;
  yearsOfService: number;
  pensionType: PensionType;
  expectedReturnRate?: number; // DC/IRP의 경우 예상 수익률 (연 %)
  currentAge?: number;
  retirementAge?: number;
}

export interface PensionResult {
  // 기본 정보
  pensionType: PensionType;
  yearsOfService: number;
  totalContributions: number; // 총 납입금액

  // DB형 계산
  dbEstimate: number; // DB형 예상 퇴직금
  dbMonthlyPension: number; // DB형 월 연금 (10년 분할 수령 시)

  // DC형 계산
  dcEstimate: number; // DC형 예상 적립금 (수익률 적용)
  dcMonthlyPension: number; // DC형 월 연금
  dcContributionMonthly: number; // 월 납입금

  // 비교
  difference: number; // DB - DC 차이
  betterOption: 'DB' | 'DC' | 'SAME';

  // 연금 수령 시뮬레이션
  pensionYears: number; // 연금 수령 기간
  totalPensionAmount: number; // 총 수령액
}

// DB형: 퇴직 시 평균임금 × 근속연수
export function calculateDB(monthlySalary: number, years: number): number {
  // 퇴직금 = 1일 평균임금 × 30일 × 근속연수
  const dailyWage = monthlySalary / 30;
  return dailyWage * 30 * years;
}

// DC형: 매년 연봉의 1/12을 적립, 수익률 적용 (복리)
export function calculateDC(
  monthlySalary: number,
  years: number,
  annualReturnRate: number = 3
): { total: number; contributions: number } {
  const monthlyContribution = monthlySalary / 12; // 월급의 1/12
  const monthlyRate = annualReturnRate / 100 / 12;

  let total = 0;
  const totalMonths = years * 12;

  // 복리 계산 (매월 납입)
  for (let i = 0; i < totalMonths; i++) {
    total = (total + monthlyContribution) * (1 + monthlyRate);
  }

  return {
    total: Math.round(total),
    contributions: Math.round(monthlyContribution * totalMonths),
  };
}

export function calculatePension(input: PensionInput): PensionResult {
  const {
    monthlySalary,
    yearsOfService,
    pensionType,
    expectedReturnRate = 3,
    currentAge = 35,
    retirementAge = 60,
  } = input;

  // DB형 계산
  const dbEstimate = calculateDB(monthlySalary, yearsOfService);

  // DC형 계산
  const dcResult = calculateDC(monthlySalary, yearsOfService, expectedReturnRate);
  const dcEstimate = dcResult.total;
  const dcContributionMonthly = monthlySalary / 12;

  // 총 납입금액
  const totalContributions = dcResult.contributions;

  // 연금 수령 시뮬레이션 (10년 분할)
  const pensionYears = 10;
  const dbMonthlyPension = Math.round(dbEstimate / (pensionYears * 12));
  const dcMonthlyPension = Math.round(dcEstimate / (pensionYears * 12));

  // 비교
  const difference = dbEstimate - dcEstimate;
  let betterOption: 'DB' | 'DC' | 'SAME' = 'SAME';
  if (difference > 1000000) betterOption = 'DB';
  else if (difference < -1000000) betterOption = 'DC';

  // 총 수령액 (선택한 연금 타입 기준)
  const selectedEstimate = pensionType === 'DB' ? dbEstimate : dcEstimate;

  return {
    pensionType,
    yearsOfService,
    totalContributions,
    dbEstimate,
    dbMonthlyPension,
    dcEstimate,
    dcMonthlyPension,
    dcContributionMonthly,
    difference,
    betterOption,
    pensionYears,
    totalPensionAmount: selectedEstimate,
  };
}

export function formatMillion(value: number): string {
  const millions = value / 10000;
  if (millions >= 10000) {
    return `${(millions / 10000).toFixed(1)}억`;
  }
  return `${Math.round(millions).toLocaleString()}만`;
}

export function formatFullCurrency(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(Math.round(value)) + '원';
}
