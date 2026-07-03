"use client";

import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import { AnalysisHistoryItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface AnalysisHistorySectionProps {
  items: AnalysisHistoryItem[];
}

export default function AnalysisHistorySection({ items }: AnalysisHistorySectionProps) {
  return (
    <GlassCard padding={24}>
      <h2 className="text-[15px] font-bold text-ink">서류 분석 이력</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-[13px] text-slate">분석한 매물이 없어요.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <Link key={item.id} href={`/analysis?propertyId=${item.propertyId}`}>
              <div className="flex items-center justify-between gap-2 rounded-2xl bg-black/[0.03] px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-ink">
                    {item.propertyTitle}
                  </p>
                  <p className="mt-0.5 truncate text-[12px] text-slate">{item.headline}</p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                    item.overallOk ? "bg-success/10 text-success" : "bg-caution/10 text-caution",
                  )}
                >
                  {item.overallOk ? "특이사항 없음" : "확인 필요"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
