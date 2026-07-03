"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import Modal from "@/components/ui/Modal";
import PropertyCard from "@/components/ui/PropertyCard";
import { useApp } from "@/context/AppContext";
import { updateDealStage } from "@/lib/api";
import { Deal, Property } from "@/lib/types";
import { formatManwon, formatPropertyPrice } from "@/lib/utils";

export interface OfferReviewSectionProps {
  deal: Deal;
  property: Property;
  onDealChange: (deal: Deal) => void;
}

export default function OfferReviewSection({
  deal,
  property,
  onDealChange,
}: OfferReviewSectionProps) {
  const router = useRouter();
  const { upsertDeal } = useApp();
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAccept = async () => {
    setSubmitting(true);
    const updated = await updateDealStage(deal.id, "계약전");
    setSubmitting(false);
    if (updated) {
      onDealChange(updated);
      upsertDeal(updated);
      router.push(`/deal/${deal.id}`);
    }
  };

  const handleNegotiate = async () => {
    setSubmitting(true);
    const updated = await updateDealStage(deal.id, "협상중");
    setSubmitting(false);
    if (updated) {
      onDealChange(updated);
      upsertDeal(updated);
    }
  };

  const handleReject = () => {
    setRejectConfirmOpen(false);
    router.push("/");
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      <div className="lg:w-[55%]">
        <PropertyCard
          layout="grid"
          imageUrl={property.thumbnail}
          title={property.title}
          dealType={property.dealType}
          address={property.address}
          price={formatPropertyPrice(property)}
          area={`${property.areaPyeong}평`}
          hasElevator={property.elevator}
          tags={property.tags}
          consultAvailable={property.badges.includes("상담가능")}
          verified={property.badges.includes("서류인증완료")}
        />
      </div>

      <div className="lg:w-[45%]">
        <GlassCard padding={32} className="lg:sticky lg:top-28">
          <p className="text-[13px] font-semibold text-slate">제안된 가격</p>
          <p className="mt-2 text-[36px] font-bold text-ink">
            ₩{deal.proposedPrice.toLocaleString("ko-KR")}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-black/5 pt-6">
            <span className="text-[13px] text-slate">예상 중개 수수료:</span>
            <span className="text-[14px] text-slate line-through">
              {formatManwon(deal.fee.standard)}원
            </span>
            <span className="bg-grad-primary bg-clip-text text-[14px] font-bold text-transparent">
              (홈쇼퍼 혜택가: {formatManwon(deal.fee.homeshopper)}원)
            </span>
          </div>
          <p className="mt-1 text-[12px] text-slate">법정 상한 요율의 1/2 · 정찰제</p>

          <div className="mt-8 space-y-3">
            <GradientButton
              type="button"
              size="lg"
              fullWidth
              loading={submitting}
              onClick={handleAccept}
            >
              거래 수락
            </GradientButton>
            <GradientButton
              type="button"
              variant="secondary"
              size="lg"
              fullWidth
              loading={submitting}
              onClick={handleNegotiate}
            >
              거래 협상
            </GradientButton>
            <GradientButton
              type="button"
              variant="danger"
              size="lg"
              fullWidth
              onClick={() => setRejectConfirmOpen(true)}
            >
              거래 거절
            </GradientButton>
          </div>
        </GlassCard>
      </div>

      <Modal
        open={rejectConfirmOpen}
        onClose={() => setRejectConfirmOpen(false)}
        title="거래 거절 확인"
        maxWidth="sm"
      >
        <div className="text-center">
          <p className="text-[16px] font-bold text-ink">이 제안을 거절할까요?</p>
          <p className="mt-2 text-[14px] text-slate">거절 후에는 되돌릴 수 없어요.</p>
          <div className="mt-6 flex gap-3">
            <GradientButton
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => setRejectConfirmOpen(false)}
            >
              취소
            </GradientButton>
            <GradientButton type="button" variant="danger" fullWidth onClick={handleReject}>
              거절하기
            </GradientButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
