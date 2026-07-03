import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "서비스 | 홈쇼퍼",
  description: "이사·인테리어·대출·유지보수·해충 퇴치까지 연계 서비스를 한 번에 찾아봐요.",
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
