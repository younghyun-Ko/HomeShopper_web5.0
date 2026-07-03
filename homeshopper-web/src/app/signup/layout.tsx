import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입 | 홈쇼퍼",
  description: "몇 초면 시작할 수 있어요.",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
