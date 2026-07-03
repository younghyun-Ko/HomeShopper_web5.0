import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "상담 신청 | 홈쇼퍼",
  description: "조건을 남겨주시면 전담 매니저가 24시간 이내에 연락드려요.",
};

export default function ConditionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
