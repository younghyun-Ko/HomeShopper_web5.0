import { LoanProduct } from "@/lib/types";

export const loans: LoanProduct[] = [
  {
    id: "loan1",
    name: "청년전세자금대출",
    bank: "KB국민은행",
    rateRange: "연 2.1~3.0%",
    limit: "최대 2억원",
    summary: "만 19~34세 무주택 청년 대상 저금리 전세자금대출이에요.",
  },
  {
    id: "loan2",
    name: "버팀목전세자금대출",
    bank: "우리은행",
    rateRange: "연 2.3~2.9%",
    limit: "최대 1.2억원",
    summary: "연소득 5천만원 이하 무주택 세대주 대상 정부 지원 상품이에요.",
  },
  {
    id: "loan3",
    name: "1인가구 월세대출",
    bank: "신한은행",
    rateRange: "연 3.5~4.5%",
    limit: "최대 1,200만원",
    summary: "사회초년생을 위한 월세보증금 특화 신용대출이에요.",
  },
  {
    id: "loan4",
    name: "중소기업취업청년 전월세보증금대출",
    bank: "IBK기업은행",
    rateRange: "연 1.5~1.8%",
    limit: "최대 1억원",
    summary: "중소기업 재직 청년 대상 초저금리 전월세보증금 대출이에요.",
  },
];

export function getLoanById(id: string): LoanProduct | undefined {
  return loans.find((loan) => loan.id === id);
}
