"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { StepProps } from "../_lib/reducer";

const PRIORITY_OPTIONS = [
  "역세권(도보 10분 이내)",
  "상권 및 편의시설 인접",
  "우수 학군 및 학원가",
  "자연환경 인접",
  "신축(준공 5년 이내)",
  "대단지 선호",
  "로열층",
  "커뮤니티 시설 유무",
];

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
        {PRIORITY_OPTIONS.map((label) => {
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
    </div>
  );
}
