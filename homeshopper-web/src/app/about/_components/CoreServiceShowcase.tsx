import type { ReactNode } from "react";
import Link from "next/link";
import {
  Clock,
  MapPin,
  ShieldCheck,
  Sparkles,
  Timer,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import MatchBadge from "@/components/ui/MatchBadge";
import CheckpointCard from "@/app/analysis/_components/CheckpointCard";
import { cn } from "@/lib/utils";

/** 상단 앵커 칩 내비게이션과 각 서브섹션 id를 공유하기 위해 별도로 export */
export const CORE_SERVICE_SECTIONS = [
  { id: "recommend", label: "압축 추천" },
  { id: "visit", label: "동행 임장" },
  { id: "analysis", label: "서류 체크" },
  { id: "timeline", label: "거래 타임라인" },
] as const;

interface CoreServiceItem {
  id: (typeof CORE_SERVICE_SECTIONS)[number]["id"];
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  visual: ReactNode;
}

const RECOMMEND_CRITERIA = [
  { label: "보증금 2,000만원 이하", met: true },
  { label: "역세권 도보 10분", met: true },
  { label: "엘리베이터", met: true },
  { label: "반려동물 가능", met: false },
  { label: "주차 가능", met: true },
];

const ANALYSIS_CHECKPOINT = {
  level: "caution" as const,
  title: "등기부등본 · 근저당권",
  status: "채권최고액 확인 필요",
  description: "채권최고액이 실거래가 대비 높은 편이에요. 잔금일 전 말소 여부를 확인해요.",
  whyItMatters:
    "근저당권이 남아있으면 잔금 이후에도 권리 관계에 영향을 줄 수 있어 확인이 필요해요.",
  questionsForAgent: ["잔금일 전 근저당권을 말소해 주실 수 있나요?"],
};

const CORE_SERVICES: CoreServiceItem[] = [
  {
    id: "recommend",
    icon: Sparkles,
    title: "압축 추천",
    description:
      "매물을 무한정 스크롤하며 하나하나 비교하지 않아도 돼요. 원하는 조건 5가지만 남기면, 그 조건에 맞는 매물만 골라서 보여드려요. 각 매물이 조건을 몇 개나 충족하는지는 고려사항 충족표(N/5)로 바로 확인할 수 있어요.",
    ctaLabel: "조건 입력하러 가기",
    ctaHref: "/start/conditions",
    visual: (
      <GlassCard padding={28}>
        <p className="text-[13px] font-semibold text-slate">이 매물, 내 조건과 몇 개나 맞을까요?</p>
        <div className="mt-4">
          <MatchBadge criteria={RECOMMEND_CRITERIA} defaultExpanded trigger="click" />
        </div>
      </GlassCard>
    ),
  },
  {
    id: "visit",
    icon: Users,
    title: "동행 임장",
    description:
      "전담 담당자가 직접 함께 매물을 확인해요. 관심 매물을 장바구니에 담아두면 여러 매물을 한 번에 묶어서 도는 묶음 임장으로 이동 시간을 아낄 수 있어요.",
    ctaLabel: "임장 준비하러 가기",
    ctaHref: "/visit",
    visual: (
      <GlassCard padding={28} className="space-y-3">
        <p className="text-[13px] font-semibold text-slate">이번 주 묶음 임장 예시</p>
        <div className="flex items-center gap-2 text-[14px] text-ink">
          <MapPin className="h-4 w-4 shrink-0 text-brand-blue" />
          매물 3건 · 관악구 일대
        </div>
        <div className="flex items-center gap-2 text-[14px] text-ink">
          <Clock className="h-4 w-4 shrink-0 text-brand-blue" />
          토요일 오전 10시
        </div>
        <div className="flex items-center gap-2 text-[14px] text-ink">
          <Users className="h-4 w-4 shrink-0 text-brand-blue" />
          전담 담당자 동행
        </div>
      </GlassCard>
    ),
  },
  {
    id: "analysis",
    icon: ShieldCheck,
    title: "서류 체크",
    description:
      "등기부등본·건축물대장을 체크포인트 단위로 나눠 확인이 필요한 항목만 짚어드려요. 이상 없음·확인 필요로 구분해서 보여주니 어디를 유심히 봐야 할지 한눈에 알 수 있어요.",
    ctaLabel: "서류 분석 해보기",
    ctaHref: "/analysis",
    visual: <CheckpointCard checkpoint={ANALYSIS_CHECKPOINT} />,
  },
  {
    id: "timeline",
    icon: Timer,
    title: "거래 타임라인",
    description:
      "계약부터 잔금까지 남은 일정을 D-day와 할 일 목록으로 관리해요. 계약금·잔금은 에스크로로 안전하게 거래되니 송금 사고 걱정을 줄일 수 있어요.",
    ctaLabel: "내 거래 확인하기",
    ctaHref: "/mypage",
    visual: (
      <GlassCard padding={28} className="space-y-3">
        <div className="flex items-center justify-between text-[14px]">
          <span className="text-ink">계약금 입금</span>
          <span className="rounded-full bg-brand-blue/10 px-2.5 py-1 text-[12px] font-semibold text-brand-blue">
            D-7
          </span>
        </div>
        <div className="flex items-center justify-between text-[14px]">
          <span className="text-ink">잔금 · 소유권 이전</span>
          <span className="rounded-full bg-grad-primary px-2.5 py-1 text-[12px] font-semibold text-white">
            D-0
          </span>
        </div>
        <div className="flex items-center gap-1.5 border-t border-black/5 pt-3 text-[12px] font-semibold text-success">
          <ShieldCheck className="h-3.5 w-3.5" />
          에스크로 안전거래로 진행돼요
        </div>
      </GlassCard>
    ),
  },
];

export default function CoreServiceShowcase() {
  return (
    <div className="space-y-16 md:space-y-24">
      {CORE_SERVICES.map((item, index) => {
        const reverse = index % 2 === 1;
        return (
          <div
            key={item.id}
            id={item.id}
            className="scroll-mt-[88px] grid grid-cols-1 items-center gap-8 md:scroll-mt-[104px] md:grid-cols-2 md:gap-12"
          >
            <div className={cn(reverse && "md:order-2")}>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                <item.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-[22px] font-bold text-ink md:text-[26px]">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate">{item.description}</p>
              {item.id === "analysis" && (
                <p className="mt-3 text-[12px] leading-relaxed text-slate">
                  본 안내는 참고용이며 법적 효력이 없습니다. 전문가 확인을 권장합니다.
                </p>
              )}
              <Link href={item.ctaHref} className="mt-5 inline-block">
                <GradientButton variant="secondary">{item.ctaLabel}</GradientButton>
              </Link>
            </div>
            <div className={cn(reverse && "md:order-1")}>{item.visual}</div>
          </div>
        );
      })}
    </div>
  );
}
