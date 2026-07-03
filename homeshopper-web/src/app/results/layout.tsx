import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "추천 매물 | 홈쇼퍼",
  description: "입력하신 조건에 맞춰 정리한 추천 매물 리스트예요.",
};

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
