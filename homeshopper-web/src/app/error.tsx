"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import Container from "@/components/layout/Container";
import PageSection from "@/components/layout/PageSection";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <PageSection>
        <Container size="narrow">
          <GlassCard padding={40} className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
              <RotateCcw className="h-7 w-7" />
            </span>
            <p className="mt-4 text-lg font-bold text-ink">
              일시적인 오류가 발생했어요
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-slate">
              페이지를 불러오는 중 문제가 생겼어요. 다시 시도해주세요.
            </p>
            <GradientButton className="mt-6" fullWidth onClick={reset}>
              다시 시도하기
            </GradientButton>
          </GlassCard>
        </Container>
      </PageSection>
    </main>
  );
}
