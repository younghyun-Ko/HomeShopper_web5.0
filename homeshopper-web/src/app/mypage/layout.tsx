import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "마이페이지 | 홈쇼퍼",
  description: "진행 중인 거래와 신청 내역을 확인해요.",
};

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
