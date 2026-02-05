// 퇴사 시뮬레이터 계산 로직
// 참고용 계산이며 실제와 다를 수 있음

export interface Step1Input {
  startDate: string;
  monthlySalary: number;
  hasSeverancePay: boolean;
  insuranceMonths: number;
  resignationType: 'voluntary' | 'involuntary';
  age: number;
}

export interface Step3Input {
  rent: number;
  living: number;
  insurance: number;
  other: number;
  restPeriod: number;
}

export interface CalculationResults {
  // 근속 정보
  workingDays: number;
  workingYears: number;
  workingMonths: number;

  // 퇴직금
  severancePay: number;
  dailyAvgWage: number;

  // 실업급여
  unemploymentBenefitEligible: boolean;
  dailyBenefit: number;
  benefitDays: number;
  totalBenefit: number;

  // 보험
  nationalPensionMonthly: number;
  healthInsuranceMonthly: number;
  totalInsuranceMonthly: number;

  // 세금 환급 추정
  estimatedTaxRefund: number;

  // 시뮬레이션 결과
  totalMonthlyExpense: number;
  totalSavings: number; // 퇴직금 + 실업급여 총액
  survivalDays: number;
  survivalMonths: number;
  additionalFundsNeeded: number;

  // 등급
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  percentile: number;
}

// 2024 기준 상수
const DAILY_BENEFIT_CAP = 66000;
const DAILY_BENEFIT_FLOOR = 61568;
const BENEFIT_RATE = 0.6;
const NATIONAL_PENSION_RATE = 0.09;
const HEALTH_INSURANCE_RATE = 0.0709;
const INCOME_TAX_RATE_ESTIMATE = 0.06;
const TAX_REFUND_RATE = 0.15;

/**
 * 근속일수 계산
 */
function calculateWorkingDays(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

/**
 * 퇴직금 계산
 * 퇴직금 = 1일 평균임금 × 30 × (근속일수 / 365)
 */
function calculateSeverancePay(
  monthlySalary: number,
  workingDays: number,
  hasSeverancePay: boolean,
): { severancePay: number; dailyAvgWage: number } {
  if (!hasSeverancePay || workingDays < 365) {
    const dailyAvgWage = (monthlySalary * 3) / 91;
    return { severancePay: 0, dailyAvgWage };
  }
  const dailyAvgWage = (monthlySalary * 3) / 91;
  const severancePay = Math.floor(dailyAvgWage * 30 * (workingDays / 365));
  return { severancePay, dailyAvgWage };
}

/**
 * 실업급여 지급기간 (일)
 * 고용보험 가입기간 + 나이 기준
 */
function getUnemploymentBenefitDays(
  insuranceMonths: number,
  age: number,
): number {
  const isOver50 = age >= 50;
  const years = insuranceMonths / 12;

  if (years < 1) return isOver50 ? 120 : 120;
  if (years < 3) return isOver50 ? 150 : 120;
  if (years < 5) return isOver50 ? 180 : 150;
  if (years < 10) return isOver50 ? 210 : 180;
  return isOver50 ? 240 : 210;
}

/**
 * 실업급여 계산
 */
function calculateUnemploymentBenefit(
  monthlySalary: number,
  insuranceMonths: number,
  age: number,
  resignationType: 'voluntary' | 'involuntary',
): {
  eligible: boolean;
  dailyBenefit: number;
  benefitDays: number;
  totalBenefit: number;
} {
  if (resignationType === 'voluntary') {
    return { eligible: false, dailyBenefit: 0, benefitDays: 0, totalBenefit: 0 };
  }

  if (insuranceMonths < 6) {
    return { eligible: false, dailyBenefit: 0, benefitDays: 0, totalBenefit: 0 };
  }

  const dailyWage = monthlySalary / 30;
  let dailyBenefit = Math.floor(dailyWage * BENEFIT_RATE);

  dailyBenefit = Math.min(dailyBenefit, DAILY_BENEFIT_CAP);
  dailyBenefit = Math.max(dailyBenefit, DAILY_BENEFIT_FLOOR);

  const benefitDays = getUnemploymentBenefitDays(insuranceMonths, age);
  const totalBenefit = dailyBenefit * benefitDays;

  return { eligible: true, dailyBenefit, benefitDays, totalBenefit };
}

/**
 * 국민연금 지역가입자 월 납부액
 */
function calculateNationalPension(monthlySalary: number): number {
  const base = Math.min(Math.max(monthlySalary, 370000), 5900000);
  return Math.floor(base * NATIONAL_PENSION_RATE);
}

/**
 * 건강보험 지역가입자 월 납부액 (임의계속가입 기준)
 */
function calculateHealthInsurance(monthlySalary: number): number {
  return Math.floor(monthlySalary * HEALTH_INSURANCE_RATE);
}

/**
 * 세금 환급 추정액
 */
function calculateTaxRefund(
  monthlySalary: number,
  workingMonths: number,
): number {
  const monthlyTax = Math.floor(monthlySalary * INCOME_TAX_RATE_ESTIMATE);
  const totalPaid = monthlyTax * workingMonths;
  return Math.floor(totalPaid * TAX_REFUND_RATE);
}

/**
 * 등급 산정
 */
function calculateGrade(survivalMonths: number): CalculationResults['grade'] {
  if (survivalMonths >= 12) return 'S';
  if (survivalMonths >= 9) return 'A';
  if (survivalMonths >= 6) return 'B';
  if (survivalMonths >= 3) return 'C';
  if (survivalMonths >= 1) return 'D';
  return 'F';
}

/**
 * 퍼센타일 추정 (하드코딩 통계 분포)
 */
function estimatePercentile(survivalMonths: number): number {
  if (survivalMonths >= 18) return 95;
  if (survivalMonths >= 12) return 82;
  if (survivalMonths >= 9) return 68;
  if (survivalMonths >= 6) return 50;
  if (survivalMonths >= 3) return 30;
  if (survivalMonths >= 1) return 12;
  return 5;
}

/**
 * 전체 계산 실행
 */
export function calculate(
  step1: Step1Input,
  step3: Step3Input,
): CalculationResults {
  const workingDays = calculateWorkingDays(step1.startDate);
  const workingYears = Math.floor(workingDays / 365);
  const workingMonths = Math.floor(workingDays / 30);

  const { severancePay, dailyAvgWage } = calculateSeverancePay(
    step1.monthlySalary,
    workingDays,
    step1.hasSeverancePay,
  );

  const unemployment = calculateUnemploymentBenefit(
    step1.monthlySalary,
    step1.insuranceMonths,
    step1.age,
    step1.resignationType,
  );

  const nationalPensionMonthly = calculateNationalPension(step1.monthlySalary);
  const healthInsuranceMonthly = calculateHealthInsurance(step1.monthlySalary);
  const totalInsuranceMonthly = nationalPensionMonthly + healthInsuranceMonthly;

  const estimatedTaxRefund = calculateTaxRefund(
    step1.monthlySalary,
    workingMonths,
  );

  const totalMonthlyExpense =
    step3.rent + step3.living + step3.insurance + step3.other + totalInsuranceMonthly;

  const totalSavings = severancePay + unemployment.totalBenefit + estimatedTaxRefund;

  const survivalMonths =
    totalMonthlyExpense > 0
      ? totalSavings / totalMonthlyExpense
      : totalSavings > 0
        ? 999
        : 0;

  const survivalDays = Math.floor(survivalMonths * 30);

  const totalExpenseForPeriod = totalMonthlyExpense * step3.restPeriod;
  const additionalFundsNeeded = Math.max(0, totalExpenseForPeriod - totalSavings);

  const grade = calculateGrade(survivalMonths);
  const percentile = estimatePercentile(survivalMonths);

  return {
    workingDays,
    workingYears,
    workingMonths,
    severancePay,
    dailyAvgWage,
    unemploymentBenefitEligible: unemployment.eligible,
    dailyBenefit: unemployment.dailyBenefit,
    benefitDays: unemployment.benefitDays,
    totalBenefit: unemployment.totalBenefit,
    nationalPensionMonthly,
    healthInsuranceMonthly,
    totalInsuranceMonthly,
    estimatedTaxRefund,
    totalMonthlyExpense,
    totalSavings,
    survivalDays,
    survivalMonths: Math.round(survivalMonths * 10) / 10,
    additionalFundsNeeded,
    grade,
    percentile,
  };
}

/**
 * 금액 포맷 (만원 단위)
 */
export function formatMoney(amount: number): string {
  if (Math.abs(amount) >= 10000) {
    const man = Math.floor(amount / 10000);
    const remainder = amount % 10000;
    if (remainder === 0) return `${man.toLocaleString()}만원`;
    return `${man.toLocaleString()}만 ${remainder.toLocaleString()}원`;
  }
  return `${amount.toLocaleString()}원`;
}

/**
 * 금액 포맷 (원 단위, 콤마)
 */
export function formatWon(amount: number): string {
  return `${amount.toLocaleString()}원`;
}
