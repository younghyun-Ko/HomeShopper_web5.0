"use client";

import { Check } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { DealStage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { dashboardStageIndex } from "../_lib/dashboard-utils";

const STAGE_LABELS = ["입금 완료", "잔금 입금", "소유권 이전 확인", "대금 지급 완료"];

export interface StageProgressBarProps {
  stage: DealStage;
  className?: string;
}

export default function StageProgressBar({ stage, className }: StageProgressBarProps) {
  const currentIndex = stage === "완료" ? 4 : dashboardStageIndex(stage);

  return (
    <GlassCard padding={20} className={className}>
      <div className="flex items-start">
        {STAGE_LABELS.map((label, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <div key={label} className="flex flex-1 items-start last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-colors",
                    isDone && "bg-success text-white",
                    isCurrent && "bg-grad-primary text-white shadow-[0_4px_14px_rgba(0,131,255,0.35)]",
                    !isDone && !isCurrent && "border-2 border-black/10 text-slate",
                  )}
                >
                  {isDone ? <Check className="h-4 w-4" /> : index + 1}
                </span>
                <span
                  className={cn(
                    "w-20 text-center text-[11px] font-medium leading-tight",
                    isCurrent ? "text-ink" : "text-slate",
                  )}
                >
                  {label}
                </span>
              </div>
              {index < STAGE_LABELS.length - 1 && (
                <div
                  className={cn(
                    "mt-[18px] h-0.5 flex-1 rounded-full",
                    isDone ? "bg-success" : "bg-black/10",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
