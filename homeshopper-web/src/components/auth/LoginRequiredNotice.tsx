"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import Container from "@/components/layout/Container";
import PageSection from "@/components/layout/PageSection";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";

/** 거래 대시보드 등 로그인 필수 페이지에 진입했을 때 보여주는 전체 화면 안내 */
export default function LoginRequiredNotice() {
  return (
    <main>
      <PageSection>
        <Container size="narrow">
          <GlassCard padding={40} className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
              <LogIn className="h-7 w-7" />
            </span>
            <p className="mt-4 text-lg font-bold text-ink">로그인이 필요해요</p>
            <p className="mt-2 text-[14px] leading-relaxed text-slate">
              탐색은 자유롭게, 거래 추적은 로그인 후에 이어져요.
            </p>
            <Link href="/login">
              <GradientButton className="mt-6" fullWidth>
                로그인하기
              </GradientButton>
            </Link>
          </GlassCard>
        </Container>
      </PageSection>
    </main>
  );
}
