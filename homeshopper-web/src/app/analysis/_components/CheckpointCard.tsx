"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { CheckPoint, CheckPointLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const LEVEL_STYLES: Record<
  CheckPointLevel,
  { icon: LucideIcon; iconWrap: string; badge: string; label: string }
> = {
  ok: {
    icon: CheckCircle2,
    iconWrap: "bg-success/15 text-success",
    badge: "bg-success/10 text-success",
    label: "이상 없음",
  },
  caution: {
    icon: AlertTriangle,
    iconWrap: "bg-caution/15 text-caution",
    badge: "bg-caution/10 text-caution",
    label: "확인 필요",
  },
  danger: {
    icon: XCircle,
    iconWrap: "bg-danger/15 text-danger",
    badge: "bg-danger/10 text-danger",
    label: "확인 필요",
  },
};

export interface CheckpointCardProps {
  checkpoint: CheckPoint;
}

export default function CheckpointCard({ checkpoint }: CheckpointCardProps) {
  const [expanded, setExpanded] = useState(false);
  const style = LEVEL_STYLES[checkpoint.level];
  const Icon = style.icon;
  const hasDetails =
    checkpoint.level !== "ok" &&
    (Boolean(checkpoint.whyItMatters) || (checkpoint.questionsForAgent?.length ?? 0) > 0);

  return (
    <GlassCard padding={24}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
              style.iconWrap,
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[13px] font-semibold text-slate">{checkpoint.title}</p>
            <p className="mt-0.5 text-[16px] font-bold text-ink">{checkpoint.status}</p>
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold",
            style.badge,
          )}
        >
          {style.label}
        </span>
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-slate">{checkpoint.description}</p>

      {hasDetails && (
        <>
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-brand-blue"
          >
            {expanded ? "접기" : "자세히 보기"}
            <ChevronDown
              className={cn("h-3.5 w-3.5 transition-transform duration-200", expanded && "rotate-180")}
            />
          </button>

          {expanded && (
            <div className="mt-3 space-y-3 border-t border-black/5 pt-3">
              {checkpoint.whyItMatters && (
                <div>
                  <p className="text-[12px] font-semibold text-ink">왜 확인이 필요한가요</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-slate">
                    {checkpoint.whyItMatters}
                  </p>
                </div>
              )}
              {checkpoint.questionsForAgent && checkpoint.questionsForAgent.length > 0 && (
                <div>
                  <p className="text-[12px] font-semibold text-ink">중개사에게 물어볼 질문</p>
                  <ul className="mt-1 space-y-1">
                    {checkpoint.questionsForAgent.map((question) => (
                      <li key={question} className="flex gap-1.5 text-[13px] text-slate">
                        <span className="text-brand-blue">·</span>
                        {question}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </GlassCard>
  );
}
