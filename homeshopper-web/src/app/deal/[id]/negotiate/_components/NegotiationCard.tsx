"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Clock, Home as HomeIcon, X } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import Modal from "@/components/ui/Modal";
import { useApp } from "@/context/AppContext";
import { submitOffer } from "@/lib/api";
import { Deal, Property } from "@/lib/types";
import { cn, formatManwon } from "@/lib/utils";
import CompetitionBar from "./CompetitionBar";
import CounterOfferModal from "./CounterOfferModal";
import { formatDateLabel, formatOfferCode } from "../_lib/deal-utils";

export interface NegotiationCardProps {
  deal: Deal;
  property: Property;
  onDealChange: (deal: Deal) => void;
}

export default function NegotiationCard({ deal, property, onDealChange }: NegotiationCardProps) {
  const router = useRouter();
  const { upsertDeal } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [withdrawConfirmOpen, setWithdrawConfirmOpen] = useState(false);

  const askingPrice =
    property.dealType === "매매" ? property.price ?? deal.proposedPrice : property.deposit;
  const highestOffer = deal.highestCompetingOffer ?? Math.round(askingPrice * 0.95);
  const myOffer = deal.proposedPrice;
  const maxValue = Math.max(askingPrice, highestOffer, myOffer, 1);
  const isLeading = myOffer >= highestOffer;

  const handleReSubmit = async (price: number, message: string) => {
    const updated = await submitOffer(property.id, price, message);
    onDealChange(updated);
    upsertDeal(updated);
    setModalOpen(false);
  };

  const handleWithdraw = () => {
    setWithdrawConfirmOpen(false);
    router.push("/");
  };

  return (
    <div className="mx-auto flex max-w-[1020px] items-start justify-center gap-6">
      <GlassCard padding={32} className="w-full max-w-[720px]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-slate">{formatOfferCode(deal.id)}</p>
            <h1 className="mt-1 truncate text-[18px] font-bold text-ink">{property.title}</h1>
          </div>
          <button
            type="button"
            onClick={() => router.push(`/properties/${property.id}`)}
            aria-label="닫기"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate transition-colors hover:bg-black/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-caution/50 px-3 py-1 text-[12px] font-semibold text-caution">
          🕐 검토 대기중
        </span>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-black/5 pt-6">
          <div>
            <p className="text-[12px] text-slate">매물 호가</p>
            <p className="mt-1 text-lg font-bold text-ink">{formatManwon(askingPrice)}원</p>
          </div>
          <div>
            <p className="text-[12px] text-slate">나의 제안</p>
            <p className="mt-1 text-lg font-bold text-brand-blue">{formatManwon(myOffer)}원</p>
          </div>
        </div>

        <GlassCard padding={20} className="mt-6">
          <p className="text-[13px] font-semibold text-ink">경쟁 현황</p>
          <div className="mt-4 space-y-3">
            <CompetitionBar label="매물 호가" value={askingPrice} max={maxValue} colorClass="bg-slate/40" />
            <CompetitionBar label="최고 제안가" value={highestOffer} max={maxValue} colorClass="bg-danger" />
            <CompetitionBar label="나의 제안" value={myOffer} max={maxValue} colorClass="bg-brand-blue" />
          </div>
        </GlassCard>

        <div className={cn("mt-6 rounded-2xl p-5", isLeading ? "bg-caution/10" : "bg-danger/10")}>
          <p className={cn("text-[14px] font-medium leading-relaxed", isLeading ? "text-caution" : "text-danger")}>
            {isLeading
              ? "현재 최고 제안가와 동일하거나 높습니다. 유리한 위치에 있습니다. 협상을 이어가세요!"
              : "더 높은 제안이 있습니다."}
          </p>
          <GradientButton
            type="button"
            fullWidth
            className="mt-4"
            style={{ backgroundImage: "linear-gradient(135deg, #F59E0B, #E8A13A)" }}
            onClick={() => setModalOpen(true)}
          >
            ↑ 금액 올려서 재제안하기
          </GradientButton>
        </div>

        <div className="mt-6 space-y-3 border-t border-black/5 pt-6">
          <div className="flex items-center justify-between text-[13px]">
            <span className="flex items-center gap-1.5 text-slate">
              <HomeIcon className="h-4 w-4" />
              희망 입주일
            </span>
            <span className="font-semibold text-ink">{formatDateLabel(deal.moveInDate)}</span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="flex items-center gap-1.5 text-slate">
              <Clock className="h-4 w-4" />
              제안 접수일
            </span>
            <span className="font-semibold text-ink">{formatDateLabel(deal.submittedAt)}</span>
          </div>
        </div>

        {deal.message && (
          <div className="mt-4">
            <p className="text-[12px] font-semibold text-slate">내가 남긴 메시지</p>
            <div className="mt-2 rounded-2xl bg-black/5 p-4 text-[13px] leading-relaxed text-ink">
              {deal.message}
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <GradientButton
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => setModalOpen(true)}
          >
            ↑ 금액 수정하기
          </GradientButton>
          <GradientButton
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => setWithdrawConfirmOpen(true)}
          >
            철회
          </GradientButton>
        </div>
      </GlassCard>

      {/* 데스크톱 전용 매물 요약 사이드 */}
      <GlassCard padding={16} className="hidden w-[260px] shrink-0 lg:block">
        <div className="relative h-32 w-full overflow-hidden rounded-2xl">
          <Image src={property.thumbnail} alt={property.title} fill sizes="228px" className="object-cover" />
        </div>
        <p className="mt-3 truncate text-[14px] font-bold text-ink">{property.title}</p>
        <p className="mt-1 truncate text-[12px] text-slate">{property.address}</p>
      </GlassCard>

      <CounterOfferModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        currentPrice={myOffer}
        currentMessage={deal.message}
        onSubmit={handleReSubmit}
      />

      <Modal
        open={withdrawConfirmOpen}
        onClose={() => setWithdrawConfirmOpen(false)}
        title="제안 철회 확인"
        maxWidth="sm"
      >
        <div className="text-center">
          <p className="text-[16px] font-bold text-ink">제안을 철회할까요?</p>
          <p className="mt-2 text-[14px] text-slate">철회 후에는 되돌릴 수 없어요.</p>
          <div className="mt-6 flex gap-3">
            <GradientButton
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => setWithdrawConfirmOpen(false)}
            >
              취소
            </GradientButton>
            <GradientButton type="button" variant="danger" fullWidth onClick={handleWithdraw}>
              철회하기
            </GradientButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
