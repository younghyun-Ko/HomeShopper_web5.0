"use client";

import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import { Deal } from "@/lib/types";
import { addDays, formatFullDate, formatKoreanAmount } from "../../_lib/dashboard-utils";

export interface Step2EscrowProps {
  deal: Deal;
  onComplete: () => void;
  submitting?: boolean;
}

export default function Step2Escrow({ deal, onComplete, submitting }: Step2EscrowProps) {
  const depositDeadline = addDays(new Date(), 7);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ink">계약금 입금 · 에스크로</h2>
        <p className="mt-4 text-[32px] font-bold text-ink">
          ₩ {deal.proposedPrice.toLocaleString("ko-KR")}{" "}
          <span className="text-[16px] font-medium text-slate">
            ({formatKoreanAmount(deal.proposedPrice)})
          </span>
        </p>
      </div>

      <GlassCard padding={24}>
        <p className="text-[13px] font-semibold text-ink">가상 계좌 정보</p>
        <div className="mt-3 space-y-2.5 text-[14px]">
          <div className="flex items-center justify-between">
            <span className="text-slate">계좌 정보</span>
            <span className="font-semibold text-ink">OO 은행 | XXX-123456-XXXX</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate">예금주</span>
            <span className="font-semibold text-ink">홈쇼퍼 (박철수)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate">입금 기간</span>
            <span className="font-semibold text-ink">{formatFullDate(depositDeadline)} 까지</span>
          </div>
        </div>
      </GlassCard>

      <div className="flex gap-3">
        <GradientButton
          type="button"
          variant="secondary"
          fullWidth
          onClick={() => alert("카드 결제 화면으로 이동합니다. (mock)")}
        >
          카드 결제
        </GradientButton>
        <GradientButton type="button" fullWidth loading={submitting} onClick={onComplete}>
          입금 확인됨 (dev)
        </GradientButton>
      </div>
    </div>
  );
}
