import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "위시리스트 | 홈쇼퍼",
  description: "찜한 매물을 한눈에 모아봐요.",
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
