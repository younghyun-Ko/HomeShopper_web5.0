"use client";

import { digitsOnly, formatThousands } from "@/lib/utils";

const MIN_MANWON = 0;
const MAX_MANWON = 50_000;

export interface Step1AmountProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Step1Amount({ value, onChange }: Step1AmountProps) {
  const numeric = Math.min(MAX_MANWON, Math.max(MIN_MANWON, Number(value || 0)));

  return (
    <div>
      <p className="text-[15px] text-slate">얼마 정도의 대출을 원하시나요?</p>

      <div className="relative mt-6">
        <input
          type="text"
          inputMode="numeric"
          value={formatThousands(value)}
          onChange={(event) => onChange(digitsOnly(event.target.value))}
          placeholder="0"
          className="glass-surface h-14 w-full rounded-2xl px-4 pr-14 text-right text-[24px] font-bold text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-slate">
          만원
        </span>
      </div>

      <input
        type="range"
        min={MIN_MANWON}
        max={MAX_MANWON}
        step={100}
        value={numeric}
        onChange={(event) => onChange(event.target.value)}
        className="mt-6 w-full accent-[var(--blue)]"
      />
      <div className="mt-2 flex justify-between text-[12px] text-slate">
        <span>0원</span>
        <span>5억원</span>
      </div>
    </div>
  );
}
