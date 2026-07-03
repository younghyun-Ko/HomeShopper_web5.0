"use client";

import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepHeaderProps {
  current: number;
  total: number;
  title: string;
  onBack?: () => void;
  className?: string;
}

export default function StepHeader({
  current,
  total,
  title,
  onBack,
  className,
}: StepHeaderProps) {
  const progress = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="뒤로가기"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate">
            {current} / {total}
          </p>
          <h2 className="truncate text-lg font-bold text-ink">{title}</h2>
        </div>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-black/5">
        <div
          className="h-full rounded-full bg-grad-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
