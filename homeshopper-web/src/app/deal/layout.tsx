import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "안전 거래 대시보드 | 홈쇼퍼",
  description: "거래 협상부터 계약, 대금 지급까지 안전하게 진행해요.",
};

export default function DealLayout({ children }: { children: React.ReactNode }) {
  return children;
}
