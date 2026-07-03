import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "임장·관리 | 홈쇼퍼",
  description: "임장 장바구니와 임장 일정을 관리해요.",
};

export default function VisitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
