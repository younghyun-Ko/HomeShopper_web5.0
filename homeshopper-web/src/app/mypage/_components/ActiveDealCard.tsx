"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { Deal, DealStage, Property } from "@/lib/types";
import { formatManwon } from "@/lib/utils";

const NEXT_TASK: Record<DealStage, string> = {
  제안: "중개사의 거래 수락 여부를 기다리고 있어요",
  협상중: "협상을 계속 진행해 주세요",
  수락: "계약 체결을 준비해 주세요",
  계약전: "계약 체결을 준비해 주세요",
  계약금입금: "계약금을 입금해 주세요",
  소유권이전: "소유권 이전을 확인해 주세요",
  완료: "거래가 완료됐어요",
};

const NEGOTIATE_STAGES: DealStage[] = ["제안", "협상중"];

export interface ActiveDealCardProps {
  deal?: Deal;
  property?: Property;
}

export default function ActiveDealCard({ deal, property }: ActiveDealCardProps) {
  if (!deal || !property) {
    return (
      <GlassCard
        padding={32}
        className="flex flex-col items-center justify-center gap-2 text-center"
      >
        <p className="text-[15px] font-semibold text-ink">진행 중인 거래가 없어요</p>
        <p className="text-[13px] text-slate">관심 매물에 거래를 제안해 보세요.</p>
        <Link
          href="/results"
          className="mt-2 inline-block text-[13px] font-semibold text-brand-blue hover:underline"
        >
          추천 매물 보러가기
        </Link>
      </GlassCard>
    );
  }

  const href = NEGOTIATE_STAGES.includes(deal.stage)
    ? `/deal/${deal.id}/negotiate`
    : `/deal/${deal.id}`;

  return (
    <Link href={href}>
      <GlassCard
        padding={32}
        onClick={() => undefined}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0">
          <span className="inline-block rounded-full bg-brand-blue/10 px-2.5 py-1 text-[12px] font-semibold text-brand-blue">
            {deal.stage}
          </span>
          <h3 className="mt-2 truncate text-[18px] font-bold text-ink">{property.title}</h3>
          <p className="mt-1 text-[14px] text-slate">{NEXT_TASK[deal.stage]}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-brand-blue">
          <span className="text-[14px] font-semibold">
            {formatManwon(deal.proposedPrice)}원
          </span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </GlassCard>
    </Link>
  );
}
