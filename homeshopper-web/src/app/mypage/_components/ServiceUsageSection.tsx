"use client";

import GlassCard from "@/components/ui/GlassCard";
import { ServiceUsageItem } from "@/lib/types";

export interface ServiceUsageSectionProps {
  items: ServiceUsageItem[];
}

export default function ServiceUsageSection({ items }: ServiceUsageSectionProps) {
  return (
    <GlassCard padding={24}>
      <h2 className="text-[15px] font-bold text-ink">연계 서비스 이용 내역</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-[13px] text-slate">이용한 연계 서비스가 없어요.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2 rounded-2xl bg-black/[0.03] px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-ink">{item.label}</p>
                <p className="text-[12px] text-slate">{item.category}</p>
              </div>
              <span className="shrink-0 text-[12px] text-slate">{item.requestedAt}</span>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
