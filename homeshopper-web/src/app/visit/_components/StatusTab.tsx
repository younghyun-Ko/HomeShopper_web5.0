"use client";

import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import GlassCard from "@/components/ui/GlassCard";
import { useApp } from "@/context/AppContext";
import { VisitCartItem, Property } from "@/lib/types";
import { cn, formatPropertyPrice } from "@/lib/utils";
import { formatMonthDay, formatTimeLabel } from "../_lib/date-utils";

export interface StatusTabProps {
  properties: Record<string, Property>;
  loading: boolean;
  onEdit: () => void;
}

export default function StatusTab({ properties, loading, onEdit }: StatusTabProps) {
  const { state, removeFromVisitCart, markVisited } = useApp();

  const scheduled = state.visitCart.filter((item) => item.scheduledAt);

  if (!loading && scheduled.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <p className="text-[16px] font-semibold text-ink">아직 예약된 임장 일정이 없어요</p>
        <p className="text-[14px] text-slate">임장 장바구니에서 일정을 먼저 잡아주세요.</p>
      </div>
    );
  }

  const groups: [string, VisitCartItem[]][] = [];
  scheduled
    .slice()
    .sort((a, b) =>
      (a.scheduledAt!.date + a.scheduledAt!.time).localeCompare(
        b.scheduledAt!.date + b.scheduledAt!.time,
      ),
    )
    .forEach((item) => {
      const date = item.scheduledAt!.date;
      const group = groups.find(([groupDate]) => groupDate === date);
      if (group) {
        group[1].push(item);
      } else {
        groups.push([date, [item]]);
      }
    });

  return (
    <div className="mx-auto max-w-[720px] space-y-12">
      {groups.map(([date, items]) => (
        <section key={date}>
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-bold text-ink">{formatMonthDay(date)}</h2>
            <button
              type="button"
              onClick={onEdit}
              className="text-[13px] font-semibold text-brand-blue hover:underline"
            >
              수정하기
            </button>
          </div>

          <div className="mt-6 space-y-6">
            {items.map((item) => {
              const property = properties[item.propertyId];
              if (!property) return null;
              const areaM2 = Math.round(property.areaPyeong * 3.3058);
              return (
                <div key={item.propertyId} className="flex gap-4">
                  <div className="flex w-16 shrink-0 flex-col items-center">
                    <span className="whitespace-nowrap text-[13px] font-semibold text-ink">
                      {formatTimeLabel(item.scheduledAt!.time)}
                    </span>
                    <span className="mt-2 w-px flex-1 bg-black/10" />
                  </div>
                  <GlassCard padding={16} className="flex flex-1 gap-4">
                    <Image
                      src={property.thumbnail}
                      alt={property.title}
                      width={80}
                      height={80}
                      className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[15px] font-bold text-ink">
                        {property.title}
                      </h3>
                      <p className="mt-0.5 text-[13px] text-slate">
                        {property.floor}층 · {property.areaPyeong}평 · {areaM2}㎡
                      </p>
                      <p className="mt-2 text-[12px] font-semibold text-brand-blue">
                        거래 합의가격
                      </p>
                      <p className="text-[15px] font-bold text-ink">
                        {formatPropertyPrice(property)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => removeFromVisitCart(item.propertyId)}
                        className="text-[12px] font-medium text-danger hover:underline"
                      >
                        삭제
                      </button>
                      <button
                        type="button"
                        onClick={() => markVisited(item.propertyId)}
                        disabled={item.visited}
                        className={cn(
                          "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors",
                          item.visited
                            ? "bg-success/15 text-success"
                            : "glass-surface text-slate hover:bg-white/70",
                        )}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {item.visited ? "임장 완료" : "임장 완료 처리"}
                      </button>
                    </div>
                  </GlassCard>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
