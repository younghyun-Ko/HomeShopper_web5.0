import Link from "next/link";
import { SearchX } from "lucide-react";
import Container from "@/components/layout/Container";
import PageSection from "@/components/layout/PageSection";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";

export default function NotFound() {
  return (
    <main>
      <PageSection>
        <Container size="narrow">
          <GlassCard padding={40} className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
              <SearchX className="h-7 w-7" />
            </span>
            <p className="mt-4 text-lg font-bold text-ink">페이지를 찾을 수 없어요</p>
            <p className="mt-2 text-[14px] leading-relaxed text-slate">
              주소가 잘못되었거나 삭제된 페이지예요. 홈에서 다시 시작해 보세요.
            </p>
            <Link href="/">
              <GradientButton className="mt-6" fullWidth>
                홈으로 돌아가기
              </GradientButton>
            </Link>
          </GlassCard>
        </Container>
      </PageSection>
    </main>
  );
}
