"use client";

import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import { useApp } from "@/context/AppContext";
import { Property } from "@/lib/types";
import { formatMonthDay, formatTimeLabel } from "../_lib/format";

export interface VisitScheduleSectionProps {
  properties: Record<string, Property>;
}

export default function VisitScheduleSection({ properties }: VisitScheduleSectionProps) {
  const { state, removeFromVisitCart } = useApp();
  const scheduled = state.visitCart.filter((item) => item.scheduledAt);

  return (
    <GlassCard padding={24}>
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-ink">임장 일정</h2>
        <Link href="/visit" className="text-[12px] font-semibold text-brand-blue hover:underline">
          더보기
        </Link>
      </div>
      {scheduled.length === 0 ? (
        <p className="mt-4 text-[13px] text-slate">예약된 임장 일정이 없어요.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {scheduled.map((item) => {
            const property = properties[item.propertyId];
            return (
              <div
                key={item.propertyId}
                className="flex items-center justify-between gap-3 rounded-2xl bg-black/[0.03] px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-ink">
                    {property?.title ?? item.propertyId}
                  </p>
                  <p className="text-[12px] text-slate">
                    {formatMonthDay(item.scheduledAt!.date)} ·{" "}
                    {formatTimeLabel(item.scheduledAt!.time)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Link
                    href="/visit"
                    className="text-[12px] font-semibold text-brand-blue hover:underline"
                  >
                    변경
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeFromVisitCart(item.propertyId)}
                    className="text-[12px] font-medium text-danger hover:underline"
                  >
                    취소
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
