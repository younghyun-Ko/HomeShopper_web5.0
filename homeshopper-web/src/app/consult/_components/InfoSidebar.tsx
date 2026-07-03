"use client";

import { CheckCircle2, ShieldCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export type ConsultTab = "buyer" | "seller";

const STEPS: Record<ConsultTab, string[]> = {
  buyer: ["상담 신청", "담당자 배정", "24시간 내 연락"],
  seller: ["매물 등록 신청", "서류 검토", "24시간 내 연락"],
};

const TRUST_POINTS = [
  { icon: ShieldCheck, text: "중개 수수료는 법정 상한 요율의 1/2, 정찰제예요." },
  { icon: Users, text: "전담 매니저가 배정되어 끝까지 함께해요." },
  { icon: CheckCircle2, text: "서류 인증까지 마친 안심 거래를 도와드려요." },
];

export interface InfoSidebarProps {
  tab: ConsultTab;
  className?: string;
}

export default function InfoSidebar({ tab, className }: InfoSidebarProps) {
  const steps = STEPS[tab];

  return (
    <div className={cn(className)}>
      <h1 className="text-3xl font-bold text-ink">
        {tab === "buyer" ? "상담 신청" : "매물 등록 신청"}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-slate">
        {tab === "buyer"
          ? "조건을 남겨주시면 전담 매니저가 매물 방향을 정리해 드려요."
          : "매물 정보를 남겨주시면 전담 매니저가 서류 검토 후 연락드려요."}
      </p>

      <ol className="mt-10">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isLast = index === steps.length - 1;
          return (
            <li key={step} className={cn("relative flex items-start gap-3", !isLast && "pb-6")}>
              {!isLast && (
                <span className="absolute left-4 top-8 h-full w-px -translate-x-1/2 bg-black/10" />
              )}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-grad-primary text-[13px] font-bold text-white">
                {stepNumber}
              </span>
              <p className="pt-1 text-[15px] font-semibold text-ink">{step}</p>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 space-y-4 border-t border-black/5 pt-8">
        {TRUST_POINTS.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-start gap-3">
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" />
            <p className="text-[14px] leading-relaxed text-slate">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
