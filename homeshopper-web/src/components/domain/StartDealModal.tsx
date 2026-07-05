"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Modal from "@/components/ui/Modal";

export interface StartDealModalProps {
  open: boolean;
  onClose: () => void;
}

export default function StartDealModal({ open, onClose }: StartDealModalProps) {
  const router = useRouter();

  const goTo = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="sm" title="어떻게 시작할까요?">
      <h3 className="text-lg font-bold text-ink">어떻게 시작할까요?</h3>
      <div className="mt-4 space-y-3">
        <GlassCard
          as="button"
          padding={16}
          onClick={() => goTo("/start/link")}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <div>
            <p className="font-semibold text-ink">이미 봐둔 매물이 있어요</p>
            <p className="mt-0.5 text-[13px] text-slate">
              링크만 넣으면 전담 담당자가 확인해드려요
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-slate" />
        </GlassCard>
        <GlassCard
          as="button"
          padding={16}
          onClick={() => goTo("/start/conditions")}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <div>
            <p className="font-semibold text-ink">조건에 맞는 매물을 추천해주세요</p>
            <p className="mt-0.5 text-[13px] text-slate">조건 5가지만 알려주세요</p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-slate" />
        </GlassCard>
        <GlassCard
          as="button"
          padding={16}
          onClick={() => goTo("/start/similar")}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <div>
            <p className="font-semibold text-ink">
              나와 비슷한 사람들이 찾은 매물을 추천해주세요
            </p>
            <p className="mt-0.5 text-[13px] text-slate">
              나이·거주형태 등 몇 가지만 알려주시면 비슷한 소비자들의 거래 예시를 보여드려요
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-slate" />
        </GlassCard>
      </div>
    </Modal>
  );
}
