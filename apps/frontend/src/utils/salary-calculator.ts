// 2024년 기준 4대보험 및 세금 계산기

// 국민연금: 근로자 4.5%, 사용자 4.5% (총 9%)
const NATIONAL_PENSION_RATE = 0.045;
const NATIONAL_PENSION_MAX_INCOME = 5900000; // 월 상한액 590만원
const NATIONAL_PENSION_MIN_INCOME = 370000; // 월 하한액 37만원

// 건강보험: 근로자 3.545%, 사용자 3.545% (총 7.09%)
const HEALTH_INSURANCE_RATE = 0.03545;

// 장기요양보험: 건강보험료의 12.95%
const LONG_TERM_CARE_RATE = 0.1295;

// 고용보험: 근로자 0.9%
const EMPLOYMENT_INSURANCE_RATE = 0.009;

// 소득세 과세표준 구간 (2024년 기준)
const TAX_BRACKETS = [
  { limit: 14000000, rate: 0.06, deduction: 0 },
  { limit: 50000000, rate: 0.15, deduction: 1260000 },
  { limit: 88000000, rate: 0.24, deduction: 5760000 },
  { limit: 150000000, rate: 0.35, deduction: 15440000 },
  { limit: 300000000, rate: 0.38, deduction: 19940000 },
  { limit: 500000000, rate: 0.40, deduction: 25940000 },
  { limit: 1000000000, rate: 0.42, deduction: 35940000 },
  { limit: Infinity, rate: 0.45, deduction: 65940000 },
];

// 근로소득공제 계산
function calculateEmploymentDeduction(income: number): number {
  if (income <= 5000000) return income * 0.7;
  if (income <= 15000000) return 3500000 + (income - 5000000) * 0.4;
  if (income <= 45000000) return 7500000 + (income - 15000000) * 0.15;
  if (income <= 100000000) return 12000000 + (income - 45000000) * 0.05;
  return 14750000 + (income - 100000000) * 0.02;
}

// 기본공제 (본인) - 간소화
const BASIC_DEDUCTION = 1500000;

// 표준세액공제
const STANDARD_TAX_CREDIT = 130000;

export interface SalaryInput {
  annualSalary?: number;
  monthlySalary?: number;
  dependents?: number; // 부양가족 수
  includeBonus?: boolean; // 상여금 포함 여부
}

export interface SalaryResult {
  // 입력값
  annualSalary: number;
  monthlySalary: number;

  // 4대보험 (월)
  nationalPension: number;
  healthInsurance: number;
  longTermCare: number;
  employmentInsurance: number;
  totalInsurance: number;

  // 세금 (월)
  incomeTax: number;
  localIncomeTax: number;
  totalTax: number;

  // 총 공제액 (월)
  totalDeduction: number;

  // 실수령액
  netMonthlySalary: number;
  netAnnualSalary: number;

  // 연간 상세
  annualInsurance: number;
  annualTax: number;
  annualDeduction: number;
}

export function calculateSalary(input: SalaryInput): SalaryResult {
  // 연봉/월급 계산
  const annualSalary = input.annualSalary || (input.monthlySalary || 0) * 12;
  const monthlySalary = input.monthlySalary || annualSalary / 12;

  // 국민연금 계산 (월 상한/하한 적용)
  const pensionBase = Math.min(
    Math.max(monthlySalary, NATIONAL_PENSION_MIN_INCOME),
    NATIONAL_PENSION_MAX_INCOME
  );
  const nationalPension = Math.round(pensionBase * NATIONAL_PENSION_RATE);

  // 건강보험 계산
  const healthInsurance = Math.round(monthlySalary * HEALTH_INSURANCE_RATE);

  // 장기요양보험 계산
  const longTermCare = Math.round(healthInsurance * LONG_TERM_CARE_RATE);

  // 고용보험 계산
  const employmentInsurance = Math.round(monthlySalary * EMPLOYMENT_INSURANCE_RATE);

  // 총 4대보험
  const totalInsurance = nationalPension + healthInsurance + longTermCare + employmentInsurance;

  // 소득세 계산 (간이세액표 기준 간소화 버전)
  // 1. 근로소득공제
  const employmentDeduction = calculateEmploymentDeduction(annualSalary);

  // 2. 과세표준 계산
  const taxableIncome = Math.max(0, annualSalary - employmentDeduction - BASIC_DEDUCTION - (totalInsurance * 12));

  // 3. 소득세 계산
  let annualIncomeTax = 0;
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome <= bracket.limit) {
      annualIncomeTax = taxableIncome * bracket.rate - bracket.deduction;
      break;
    }
  }

  // 4. 세액공제 적용
  annualIncomeTax = Math.max(0, annualIncomeTax - STANDARD_TAX_CREDIT);

  // 월 소득세
  const incomeTax = Math.round(annualIncomeTax / 12);

  // 지방소득세 (소득세의 10%)
  const localIncomeTax = Math.round(incomeTax * 0.1);

  // 총 세금 (월)
  const totalTax = incomeTax + localIncomeTax;

  // 총 공제액 (월)
  const totalDeduction = totalInsurance + totalTax;

  // 실수령액
  const netMonthlySalary = monthlySalary - totalDeduction;
  const netAnnualSalary = netMonthlySalary * 12;

  return {
    annualSalary,
    monthlySalary,
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    totalInsurance,
    incomeTax,
    localIncomeTax,
    totalTax,
    totalDeduction,
    netMonthlySalary,
    netAnnualSalary,
    annualInsurance: totalInsurance * 12,
    annualTax: totalTax * 12,
    annualDeduction: totalDeduction * 12,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(Math.round(value));
}

export function formatCurrencyWon(value: number): string {
  return formatCurrency(value) + '원';
}
