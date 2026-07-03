import { Suspense } from "react";
import type { Metadata } from "next";
import LoginPageContent from "./_components/LoginPageContent";

export const metadata: Metadata = {
  title: "로그인 | 홈쇼퍼",
  description: "홈쇼퍼와 함께 안전한 거래를 시작해요.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
