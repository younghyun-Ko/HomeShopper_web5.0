"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/layout/Container";
import PageSection from "@/components/layout/PageSection";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import { useApp } from "@/context/AppContext";
import { signIn } from "@/lib/auth";

export default function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { loginAs } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState<"kakao" | "email" | null>(null);

  const handleKakaoLogin = async () => {
    setSubmitting("kakao");
    const user = await signIn({ method: "kakao" });
    loginAs(user);
    setSubmitting(null);
    router.push(redirectTo);
  };

  const handleEmailLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    setSubmitting("email");
    const user = await signIn({ method: "email", email, name: email.split("@")[0] });
    loginAs(user);
    setSubmitting(null);
    router.push(redirectTo);
  };

  return (
    <main>
      <PageSection>
        <Container size="narrow">
          <GlassCard padding={40} className="mx-auto max-w-[480px]">
            <h1 className="text-center text-xl font-bold text-ink">로그인</h1>
            <p className="mt-2 text-center text-[14px] text-slate">
              홈쇼퍼와 함께 안전한 거래를 시작해요.
            </p>

            <button
              type="button"
              onClick={handleKakaoLogin}
              disabled={submitting !== null}
              className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-btn bg-[#FEE500] text-[15px] font-semibold text-[#181600] transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {submitting === "kakao" ? "로그인 중..." : "카카오로 3초만에 시작하기"}
            </button>

            <div className="mt-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-black/10" />
              <span className="text-[12px] text-slate">또는</span>
              <span className="h-px flex-1 bg-black/10" />
            </div>

            <div className="mt-6 space-y-3">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="이메일"
                className="glass-surface h-12 w-full rounded-2xl px-4 text-[15px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="비밀번호"
                className="glass-surface h-12 w-full rounded-2xl px-4 text-[15px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
              />
            </div>

            <GradientButton
              type="button"
              fullWidth
              size="lg"
              className="mt-4"
              disabled={!email.trim() || !password.trim()}
              loading={submitting === "email"}
              onClick={handleEmailLogin}
            >
              이메일로 로그인
            </GradientButton>

            <p className="mt-6 text-center text-[13px] text-slate">
              계정이 없으신가요?{" "}
              <Link href="/signup" className="font-semibold text-brand-blue hover:underline">
                회원가입
              </Link>
            </p>
          </GlassCard>
        </Container>
      </PageSection>
    </main>
  );
}
