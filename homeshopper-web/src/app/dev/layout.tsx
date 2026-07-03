import { notFound } from "next/navigation";

/**
 * /dev/* 는 디자인 시스템 쇼케이스 등 개발 중에만 필요한 라우트다. 서버 컴포넌트
 * 레이아웃에서 막아야 요청 시점에 실제로 평가되어 프로덕션에서 진짜 404 상태 코드가
 * 나온다 ("use client" 페이지 안에서 notFound()를 부르면 정적 생성 시 200으로 나가버림).
 */
export default function DevLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return children;
}
