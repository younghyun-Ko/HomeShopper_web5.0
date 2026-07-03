export interface LoanFormState {
  /** 만원 단위 숫자 문자열 */
  amount: string;
  purpose: string;
  rateType: string;
  term: string;
  incomeRange: string;
  employmentType: string;
  creditRange: string;
  hasHouse: string;
}

export const INITIAL_LOAN_FORM: LoanFormState = {
  amount: "10000",
  purpose: "전세자금",
  rateType: "고정",
  term: "2년",
  incomeRange: "",
  employmentType: "",
  creditRange: "",
  hasHouse: "",
};
