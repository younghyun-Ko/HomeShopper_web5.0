"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AgentAssignedCard from "@/components/domain/AgentAssignedCard";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import Modal from "@/components/ui/Modal";
import { useApp } from "@/context/AppContext";
import { submitOffer } from "@/lib/api";
import { Property } from "@/lib/types";
import { useRequireLogin } from "@/lib/useRequireLogin";
import { digitsOnly, formatThousands } from "@/lib/utils";

export interface DealOfferCardProps {
  property: Property;
}

export default function DealOfferCard({ property }: DealOfferCardProps) {
  const router = useRouter();
  const { upsertDeal } = useApp();
  const { requireLogin, guardModal } = useRequireLogin();
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dealId, setDealId] = useState<string | null>(null);

  const min = Number(minAmount || 0);
  const max = Number(maxAmount || 0);
  const canSubmit = min > 0 && max > 0 && max >= min;

  const submitOfferRequest = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    const proposedPrice = Math.round(((min + max) / 2) * 10_000);
    const deal = await submitOffer(property.id, proposedPrice);
    upsertDeal(deal);
    setDealId(deal.id);
    setSubmitting(false);
  };

  const handleSubmit = () => requireLogin(submitOfferRequest);

  return (
    <>
      <GlassCard padding={24}>
        <p className="text-[13px] font-semibold text-success">임장 완료 · 거래 의사 전달</p>
        <p className="mt-2 text-[14px] font-semibold text-ink">
          해당 매물을 어느 정도 가격 범위에서 거래하고 싶으신가요?
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="offer-min" className="text-[12px] text-slate">
              최소 금액
            </label>
            <div className="relative mt-1.5">
              <input
                id="offer-min"
                type="text"
                inputMode="numeric"
                value={formatThousands(minAmount)}
                onChange={(event) => setMinAmount(digitsOnly(event.target.value))}
                placeholder="0"
                className="glass-surface h-11 w-full rounded-2xl px-3 pr-11 text-right text-[14px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-slate">
                만원
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="offer-max" className="text-[12px] text-slate">
              최대 금액
            </label>
            <div className="relative mt-1.5">
              <input
                id="offer-max"
                type="text"
                inputMode="numeric"
                value={formatThousands(maxAmount)}
                onChange={(event) => setMaxAmount(digitsOnly(event.target.value))}
                placeholder="0"
                className="glass-surface h-11 w-full rounded-2xl px-3 pr-11 text-right text-[14px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-slate">
                만원
              </span>
            </div>
          </div>
        </div>

        <GradientButton
          type="button"
          fullWidth
          className="mt-4"
          disabled={!canSubmit}
          loading={submitting}
          onClick={handleSubmit}
        >
          해당 조건으로 제안하기 →
        </GradientButton>
        <p className="mt-3 text-center text-[12px] text-slate">
          중개 수수료는 법정 상한 요율의 1/2, 정찰제로 안내돼요.
        </p>
      </GlassCard>

      <Modal open={Boolean(dealId)} onClose={() => setDealId(null)} title="거래 의사 전달 완료">
        <AgentAssignedCard
          role="전담 중개사"
          message="회원님 전담 중개사가 배정되었습니다. 담당자가 거래 가격 협상 후 2시간 내로 연락드리겠습니다."
          completeLabel="거래 협상 시작"
          onComplete={() => {
            if (dealId) router.push(`/deal/${dealId}/negotiate`);
          }}
        />
      </Modal>
      {guardModal}
    </>
  );
}
