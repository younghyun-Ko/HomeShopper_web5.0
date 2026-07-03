"use client";

import { useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import Modal from "@/components/ui/Modal";
import { useApp } from "@/context/AppContext";
import { LoanProduct } from "@/lib/types";

const DISCLAIMER = "실제 금리·한도는 금융사 심사에 따라 달라질 수 있습니다.";

export interface LoanResultsProps {
  loans: LoanProduct[];
  onRestart: () => void;
}

export default function LoanResults({ loans, onRestart }: LoanResultsProps) {
  const { addServiceUsage } = useApp();
  const [selected, setSelected] = useState<LoanProduct | null>(null);

  return (
    <div>
      <h1 className="text-[28px] font-bold text-ink md:text-[32px]">맞춤 대출 상품</h1>
      <p className="mt-2 text-[14px] text-slate">총 {loans.length}개 상품을 찾았어요</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {loans.map((loan) => (
          <GlassCard key={loan.id} padding={24} onClick={() => setSelected(loan)}>
            <p className="text-[12px] text-slate">{loan.bank}</p>
            <h3 className="mt-1 text-[17px] font-bold text-ink">{loan.name}</h3>
            <div className="mt-3 grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <p className="text-slate">예상 금리</p>
                <p className="mt-0.5 font-bold text-brand-blue">{loan.rateRange}</p>
              </div>
              <div>
                <p className="text-slate">한도</p>
                <p className="mt-0.5 font-bold text-ink">{loan.limit}</p>
              </div>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-slate">{loan.summary}</p>
          </GlassCard>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <GradientButton type="button" variant="secondary" onClick={onRestart}>
          조건 다시 입력하기
        </GradientButton>
      </div>

      <p className="mt-8 text-center text-[12px] text-slate">{DISCLAIMER}</p>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        maxWidth="md"
        title={selected?.name}
      >
        {selected && (
          <div>
            <p className="text-[13px] text-slate">{selected.bank}</p>
            <h2 className="mt-1 text-xl font-bold text-ink">{selected.name}</h2>

            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-black/5 pt-5">
              <div>
                <p className="text-[12px] text-slate">예상 금리</p>
                <p className="mt-1 text-[16px] font-bold text-brand-blue">{selected.rateRange}</p>
              </div>
              <div>
                <p className="text-[12px] text-slate">한도</p>
                <p className="mt-1 text-[16px] font-bold text-ink">{selected.limit}</p>
              </div>
            </div>

            <p className="mt-5 text-[14px] leading-relaxed text-slate">{selected.summary}</p>

            <GradientButton
              type="button"
              fullWidth
              className="mt-6"
              onClick={() => {
                addServiceUsage({
                  id: `service-${Date.now()}`,
                  category: "대출",
                  label: selected.name,
                  requestedAt: new Date().toISOString().slice(0, 10),
                });
                alert(`${selected.bank} 상담원과 연결합니다. (mock)`);
              }}
            >
              상담 연결
            </GradientButton>

            <p className="mt-4 text-center text-[12px] text-slate">{DISCLAIMER}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
