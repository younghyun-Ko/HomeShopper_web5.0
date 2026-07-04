"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { PRIORITY_OPTIONS } from "@/lib/priorityMatching";
import { cn } from "@/lib/utils";
import { StepProps } from "../_lib/reducer";

const MAX_PRIORITIES = 5;

export default function Step5Priorities({ state, dispatch }: StepProps) {
  const showToast = useToast();
  const [shakingChip, setShakingChip] = useState<string | null>(null);

  const handleToggle = (label: string) => {
    const selected = state.priorities.includes(label);
    if (!selected && state.priorities.length >= MAX_PRIORITIES) {
      setShakingChip(label);
      showToast({ title: "최대 5개까지 선택할 수 있어요", variant: "caution" });
      window.setTimeout(() => {
        setShakingChip((current) => (current === label ? null : current));
      }, 400);
      return;
    }
    dispatch({ type: "TOGGLE_PRIORITY", value: label });
  };

  return (
    <div>
      <p className="text-[15px] text-slate">
        원하시는 조건을 순서대로 클릭해주세요 (최대 5개)
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {PRIORITY_OPTIONS.map(({ label }) => {
          const order = state.priorities.indexOf(label);
          const selected = order !== -1;
          return (
            <button
              key={label}
              type="button"
              onClick={() => handleToggle(label)}
              aria-pressed={selected}
              className={cn(
                "relative flex min-h-[88px] flex-col items-center justify-center rounded-2xl px-3 py-4 text-center text-[13px] font-medium leading-snug transition-all duration-200",
                selected
                  ? "bg-brand-blue/10 text-ink ring-2 ring-brand-blue/30"
                  : "glass-surface text-ink hover:bg-white/70",
                shakingChip === label && "animate-shake",
              )}
            >
              {label}
              {selected && (
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-grad-primary text-[12px] font-bold text-white shadow-md">
                  {order + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        <p className="text-sm font-semibold text-ink">
          그 외에 원하시는 조건이 있나요? <span className="font-normal text-slate">(선택)</span>
        </p>
        <textarea
          value={state.customRequest}
          onChange={(event) =>
            dispatch({ type: "SET_CUSTOM_REQUEST", value: event.target.value })
          }
          placeholder="예: 저층은 피하고 싶어요, 주차 공간이 꼭 필요해요 등 자유롭게 적어주세요"
          rows={3}
          className="glass-surface mt-3 w-full resize-none rounded-2xl px-4 py-3 text-[14px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
        />
      </div>
    </div>
  );
}
