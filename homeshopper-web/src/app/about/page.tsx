import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Banknote,
  Bug,
  ClipboardCheck,
  Footprints,
  Link2Off,
  Palette,
  Search,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import Container from "@/components/layout/Container";
import PageSection from "@/components/layout/PageSection";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import FaqAccordion from "./_components/FaqAccordion";

export const metadata: Metadata = {
  title: "서비스 소개 | 홈쇼퍼",
  description: "부동산 거래, 중개부터 그 이후까지 — 홈쇼퍼가 어떻게 도와드리는지 소개해요.",
};

const PROBLEMS = [
  {
    icon: Footprints,
    title: "발품",
    desc: "매물 하나 보려고 몇 시간을 써야 해요.",
  },
  {
    icon: Search,
    title: "정보 비대칭",
    desc: "중개사만 아는 정보, 나만 모르고 계약해요.",
  },
  {
    icon: Banknote,
    title: "높은 수수료",
    desc: "법정 상한 요율을 그대로 다 내야 하나요?",
  },
  {
    icon: Link2Off,
    title: "사후 단절",
    desc: "계약이 끝나면 그걸로 끝, 이사·인테리어는 또 다른 일이에요.",
  },
];

const SOLUTION_STEPS = [
  { title: "조건 입력", desc: "원하는 조건을 남기면 시작돼요." },
  { title: "AI 선별·임장", desc: "조건에 맞는 매물을 골라 함께 임장해요." },
  { title: "계약·사후 서비스 연계", desc: "계약부터 이사·인테리어까지 이어져요." },
];

const FULL_SERVICE_PREVIEW = [
  { icon: Truck, label: "이사", href: "/services/이사" },
  { icon: Palette, label: "인테리어", href: "/services/인테리어" },
  { icon: Wrench, label: "유지보수", href: "/services/유지보수" },
  { icon: Bug, label: "해충 퇴치", href: "/services/해충퇴치" },
];

const FAQ_ITEMS = [
  {
    question: "정말 수수료가 절반인가요?",
    answer:
      "네, 홈쇼퍼의 중개 수수료는 법정 상한 요율의 1/2, 정찰제예요. 매물 규모나 협상 여부와 관계없이 동일하게 적용돼요.",
  },
  {
    question: "서류 분석은 법적 효력이 있나요?",
    answer:
      "아니요. 서류 분석은 계약 전 유심히 봐야 할 포인트를 안내해 드리는 참고용 서비스예요. 법적 효력이 없으며, 최종 판단은 전문가 확인을 거쳐주세요.",
  },
  {
    question: "임장은 어떻게 진행되나요?",
    answer:
      "관심 매물을 장바구니에 담고 원하는 날짜·시간을 고르면, 담당자가 일정에 맞춰 함께 임장을 도와드려요.",
  },
  {
    question: "이사·인테리어 같은 서비스도 홈쇼퍼에서 처리하나요?",
    answer:
      "네, 계약이 끝난 후에도 이사·인테리어·대출·유지보수·해충 퇴치 등 필요한 서비스를 같은 화면에서 이어서 연결해 드려요.",
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* 1. 히어로 */}
      <section className="bg-gradient-to-b from-brand-blue/10 via-brand-purple/5 to-transparent">
        <PageSection className="py-20 md:py-28">
          <Container size="wide">
            <div className="mx-auto max-w-[720px] text-center">
              <h1 className="text-[32px] font-bold leading-tight text-ink md:text-[48px]">
                부동산 거래, 중개부터 그 이후까지.
              </h1>
              <p className="mt-4 text-[16px] leading-relaxed text-slate md:text-[18px]">
                매물 탐색부터 임장, 권리분석, 계약, 이사·인테리어·대출까지 — 홈쇼퍼가 끝까지
                함께해요.
              </p>
              <Link href="/start/conditions">
                <GradientButton size="lg" className="mt-8">
                  지금 거래 시작하기
                </GradientButton>
              </Link>
            </div>
          </Container>
        </PageSection>
      </section>

      {/* 2. 문제 제기 */}
      <PageSection>
        <Container size="wide">
          <h2 className="text-center text-[26px] font-bold text-ink md:text-[30px]">
            부동산 거래, 이런 게 불편하지 않았나요?
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {PROBLEMS.map(({ icon: Icon, title, desc }) => (
              <GlassCard key={title} padding={28} className="text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="mt-4 text-[16px] font-bold text-ink">{title}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-slate">{desc}</p>
              </GlassCard>
            ))}
          </div>
        </Container>
      </PageSection>

      {/* 3. 해결 3단계 */}
      <PageSection>
        <Container size="wide">
          <h2 className="text-center text-[26px] font-bold text-ink md:text-[30px]">
            홈쇼퍼는 이렇게 해결해요
          </h2>
          <div className="mt-10 flex flex-col items-stretch gap-4 lg:flex-row lg:items-center lg:gap-4">
            {SOLUTION_STEPS.map((step, index) => (
              <div key={step.title} className="flex flex-1 items-center gap-4">
                <GlassCard padding={28} className="flex-1 text-center">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-grad-primary text-[15px] font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="mt-4 text-[16px] font-bold text-ink">{step.title}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate">{step.desc}</p>
                </GlassCard>
                {index < SOLUTION_STEPS.length - 1 && (
                  <ArrowRight className="hidden h-6 w-6 shrink-0 text-brand-blue lg:block" />
                )}
              </div>
            ))}
          </div>
        </Container>
      </PageSection>

      {/* 4. 수수료 비교 */}
      <PageSection>
        <Container size="wide">
          <h2 className="text-center text-[26px] font-bold text-ink md:text-[30px]">
            중개 수수료, 절반이면 충분해요
          </h2>
          <div className="mx-auto mt-10 grid max-w-[860px] grid-cols-1 gap-6 sm:grid-cols-2">
            <GlassCard padding={32} className="text-center">
              <p className="text-[13px] font-semibold text-slate">일반 중개</p>
              <p className="mt-2 text-[13px] text-slate">법정 상한 요율</p>
              <p className="mt-4 text-[32px] font-bold text-ink line-through opacity-60">
                80만원
              </p>
            </GlassCard>
            <GlassCard
              padding={32}
              className="border-2 border-transparent bg-clip-padding text-center [background-image:linear-gradient(white,white),linear-gradient(135deg,var(--blue),var(--purple))] [background-origin:border-box]"
            >
              <p className="text-[13px] font-semibold text-brand-blue">홈쇼퍼</p>
              <p className="mt-2 text-[13px] text-slate">법정 상한 요율의 1/2, 정찰제</p>
              <p className="mt-4 bg-grad-primary bg-clip-text text-[32px] font-bold text-transparent">
                40만원
              </p>
            </GlassCard>
          </div>
          <p className="mt-6 text-center text-[12px] text-slate">
            * 실제 거래가에 따라 금액은 달라질 수 있어요.
          </p>
        </Container>
      </PageSection>

      {/* 5. 풀서비스 연계 미리보기 */}
      <PageSection>
        <Container size="wide">
          <h2 className="text-center text-[26px] font-bold text-ink md:text-[30px]">
            계약 이후도 홈쇼퍼와 함께
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {FULL_SERVICE_PREVIEW.map(({ icon: Icon, label, href }) => (
              <Link key={label} href={href}>
                <GlassCard
                  padding={28}
                  className="text-center transition-transform duration-200 hover:-translate-y-1"
                >
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                    <Icon className="h-6 w-6" />
                  </span>
                  <p className="mt-4 text-[15px] font-bold text-ink">{label}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </Container>
      </PageSection>

      {/* 6. FAQ */}
      <PageSection>
        <Container size="narrow">
          <h2 className="text-center text-[26px] font-bold text-ink md:text-[30px]">
            자주 묻는 질문
          </h2>
          <div className="mt-10">
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
          <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[12px] text-slate">
            <ShieldCheck className="h-3.5 w-3.5" />
            서류 분석 등 안내는 참고용이며 법적 효력이 없습니다. 전문가 확인을 권장합니다.
          </p>
        </Container>
      </PageSection>

      {/* 최종 CTA 배너 */}
      <section className="bg-grad-primary">
        <PageSection className="py-16 md:py-20">
          <Container size="wide">
            <div className="mx-auto flex max-w-[720px] flex-col items-center gap-5 text-center">
              <ClipboardCheck className="h-10 w-10 text-white" />
              <h2 className="text-[24px] font-bold text-white md:text-[28px]">
                지금 조건을 남기면, 24시간 이내에 연락드려요.
              </h2>
              <Link href="/start/conditions">
                <GradientButton variant="secondary" size="lg">
                  지금 거래 시작하기
                </GradientButton>
              </Link>
            </div>
          </Container>
        </PageSection>
      </section>
    </main>
  );
}
