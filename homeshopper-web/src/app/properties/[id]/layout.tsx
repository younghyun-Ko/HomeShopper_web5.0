import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "매물 상세 | 홈쇼퍼",
  description: "매물 상세 정보와 서류 인증 현황을 확인해요.",
};

export default function PropertyDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
