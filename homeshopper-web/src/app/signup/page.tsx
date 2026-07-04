"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import PageSection from "@/components/layout/PageSection";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import { useApp } from "@/context/AppContext";
import { signIn } from "@/lib/auth";
import { UserIntent } from "@/lib/types";
import { cn } from "@/lib/utils";

const SEOUL_DISTRICTS = [
  "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구",
  "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구",
  "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구",
];

type Phase = "form" | "onboarding";

export default function SignupPage() {
  const router = useRouter();
  const { setUser, loginAs } = useApp();

  const [phase, setPhase] = useState<Phase>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState<"kakao" | "email" | null>(null);

  const [intent, setIntent] = useState<UserIntent | "">("");
  const [districts, setDistricts] = useState<string[]>([]);
  const [savingOnboarding, setSavingOnboarding] = useState(false);

  const handleKakaoSignup = async () => {
    setSubmitting("kakao");
    const user = await signIn({ method: "kakao" });
    loginAs(user);
    setSubmitting(null);
    setPhase("onboarding");
  };

  const handleEmailSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) return;
    setSubmitting("email");
    const user = await signIn({ method: "email", name, email });
    loginAs(user);
    setSubmitting(null);
    setPhase("onboarding");
  };

  const toggleDistrict = (district: string) => {
    setDistricts((prev) =>
      prev.includes(district) ? prev.filter((item) => item !== district) : [...prev, district],
    );
  };

  const handleFinishOnboarding = async () => {
    setSavingOnboarding(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setUser({ intent: intent || undefined, interestedDistricts: districts });
    setSavingOnboarding(false);
    router.push("/");
  };

  if (phase === "onboarding") {
    return (
      <main>
        <PageSection>
          <Container size="narrow">
            <GlassCard padding={40} className="mx-auto max-w-[480px]">
              <h1 className="text-xl font-bold text-ink">회원님을 더 알려주세요</h1>
              <p className="mt-2 text-[14px] text-slate">맞춤 매물을 추천해 드릴게요.</p>

              <div className="mt-6">
                <p className="text-sm font-semibold text-ink">매수·매도 성향</p>
                <div className="mt-2 flex gap-2">
                  {(["매수", "매도"] as UserIntent[]).map((option) => {
                    const selected = intent === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setIntent(option)}
                        aria-pressed={selected}
                        className={cn(
                          "flex-1 rounded-2xl py-3 text-[14px] font-semibold transition-all duration-200",
                          selected
                            ? "bg-grad-primary text-white shadow-[0_8px_20px_rgba(0,131,255,0.25)]"
                            : "glass-surface text-ink hover:bg-white/70",
                        )}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold text-ink">관심 지역 (복수 선택 가능)</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SEOUL_DISTRICTS.map((district) => {
                    const selected = districts.includes(district);
                    return (
                      <button
                        key={district}
                        type="button"
                        onClick={() => toggleDistrict(district)}
                        aria-pressed={selected}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-[13px] font-medium transition-all duration-200",
                          selected
                            ? "bg-grad-primary text-white shadow-[0_8px_20px_rgba(0,131,255,0.25)]"
                            : "glass-surface text-ink hover:bg-white/70",
                        )}
                      >
                        {district}
                      </button>
                    );
                  })}
                </div>
              </div>

              <GradientButton
                type="button"
                fullWidth
                size="lg"
                className="mt-8"
                loading={savingOnboarding}
                onClick={handleFinishOnboarding}
              >
                시작하기
              </GradientButton>
            </GlassCard>
          </Container>
        </PageSection>
      </main>
    );
  }

  return (
    <main>
      <PageSection>
        <Container size="narrow">
          <GlassCard padding={40} className="mx-auto max-w-[480px]">
            <h1 className="text-center text-xl font-bold text-ink">회원가입</h1>
            <p className="mt-2 text-center text-[14px] text-slate">몇 초면 시작할 수 있어요.</p>

            <button
              type="button"
              onClick={handleKakaoSignup}
              disabled={submitting !== null}
              className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-btn bg-[#FEE500] text-[15px] font-semibold text-[#181600] transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {submitting === "kakao" ? "가입 중..." : "카카오로 3초만에 가입하기"}
            </button>

            <div className="mt-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-black/10" />
              <span className="text-[12px] text-slate">또는</span>
              <span className="h-px flex-1 bg-black/10" />
            </div>

            <div className="mt-6 space-y-3">
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="이름"
                className="glass-surface h-12 w-full rounded-2xl px-4 text-[15px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
              />
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
              disabled={!name.trim() || !email.trim() || !password.trim()}
              loading={submitting === "email"}
              onClick={handleEmailSignup}
            >
              이메일로 회원가입
            </GradientButton>

            <p className="mt-6 text-center text-[13px] text-slate">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="font-semibold text-brand-blue hover:underline">
                로그인
              </Link>
            </p>
          </GlassCard>
        </Container>
      </PageSection>
    </main>
  );
}
