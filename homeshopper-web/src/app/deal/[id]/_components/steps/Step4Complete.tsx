"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import { Deal } from "@/lib/types";
import { formatManwon } from "@/lib/utils";

export interface Step4CompleteProps {
  deal: Deal;
}

export default function Step4Complete({ deal }: Step4CompleteProps) {
  return (
    <div className="text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-grad-primary text-white shadow-[0_8px_24px_rgba(0,131,255,0.28)]">
        <CheckCircle2 className="h-8 w-8" />
      </span>
      <h2 className="mt-4 text-2xl font-bold text-ink">거래 완료</h2>
      <p className="mt-2 text-[14px] text-slate">축하합니다! 안전하게 거래가 마무리됐어요.</p>

      <GlassCard padding={24} className="mt-8 text-left">
        <p className="text-[14px] font-bold text-ink">거래 수수료 납부</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-[14px] text-slate line-through">
            {formatManwon(deal.fee.standard)}원
          </span>
          <span className="bg-grad-primary bg-clip-text text-[15px] font-bold text-transparent">
            홈쇼퍼 혜택가 {formatManwon(deal.fee.homeshopper)}원
          </span>
        </div>
        <p className="mt-1 text-[12px] text-slate">법정 상한 요율의 1/2, 정찰제</p>
        <GradientButton
          type="button"
          fullWidth
          className="mt-4"
          onClick={() => alert("수수료 결제 화면으로 이동합니다. (mock)")}
        >
          수수료 결제
        </GradientButton>
      </GlassCard>

      <Link href="/services" className="mt-4 block">
        <GlassCard
          padding={20}
          className="flex items-center justify-between text-left"
          onClick={() => undefined}
        >
          <span className="text-[14px] font-semibold text-ink">이사·인테리어 알아보기</span>
          <ArrowRight className="h-4 w-4 text-brand-blue" />
        </GlassCard>
      </Link>
    </div>
  );
}
