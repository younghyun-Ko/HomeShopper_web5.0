"use client";

import { useEffect, useState } from "react";
import GradientButton from "@/components/ui/GradientButton";
import Modal from "@/components/ui/Modal";
import { digitsOnly, formatThousands } from "@/lib/utils";

export interface CounterOfferModalProps {
  open: boolean;
  onClose: () => void;
  /** 원 단위 현재 제안가 */
  currentPrice: number;
  currentMessage?: string;
  onSubmit: (price: number, message: string) => Promise<void> | void;
}

export default function CounterOfferModal({
  open,
  onClose,
  currentPrice,
  currentMessage,
  onSubmit,
}: CounterOfferModalProps) {
  const [amount, setAmount] = useState(String(Math.round(currentPrice / 10_000)));
  const [message, setMessage] = useState(currentMessage ?? "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setAmount(String(Math.round(currentPrice / 10_000)));
    setMessage(currentMessage ?? "");
  }, [open, currentPrice, currentMessage]);

  const handleSubmit = async () => {
    const numeric = Number(amount || 0);
    if (numeric <= 0) return;
    setSubmitting(true);
    await onSubmit(numeric * 10_000, message.trim());
    setSubmitting(false);
  };

  return (
    <Modal open={open} onClose={onClose} title="제안 금액 수정">
      <p className="text-lg font-bold text-ink">제안 금액을 수정할까요?</p>

      <div className="mt-4">
        <label htmlFor="counter-amount" className="text-[13px] font-semibold text-ink">
          제안 금액
        </label>
        <div className="relative mt-2">
          <input
            id="counter-amount"
            type="text"
            inputMode="numeric"
            value={formatThousands(amount)}
            onChange={(event) => setAmount(digitsOnly(event.target.value))}
            className="glass-surface h-12 w-full rounded-2xl px-4 pr-14 text-right text-[15px] text-ink focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-slate">
            만원
          </span>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="counter-message" className="text-[13px] font-semibold text-ink">
          메시지 (선택)
        </label>
        <textarea
          id="counter-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={3}
          placeholder="중개사에게 전달할 메시지를 남겨주세요"
          className="glass-surface mt-2 w-full rounded-2xl p-4 text-[14px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
        />
      </div>

      <GradientButton
        type="button"
        fullWidth
        className="mt-6"
        disabled={!amount || Number(amount) <= 0}
        loading={submitting}
        onClick={handleSubmit}
      >
        재제안하기
      </GradientButton>
    </Modal>
  );
}
