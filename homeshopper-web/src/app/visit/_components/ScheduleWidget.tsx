"use client";

import { useEffect, useState } from "react";
import GradientButton from "@/components/ui/GradientButton";
import { getVisitSlots } from "@/lib/api";
import { Property } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatTimeLabel } from "../_lib/date-utils";
import MiniCalendar from "./MiniCalendar";

export interface ScheduleWidgetProps {
  property: Property;
  initialDate?: string;
  initialTime?: string;
  onConfirm: (date: string, time: string) => void;
}

export default function ScheduleWidget({
  property,
  initialDate,
  initialTime,
  onConfirm,
}: ScheduleWidgetProps) {
  const [date, setDate] = useState<string | null>(initialDate ?? null);
  const [time, setTime] = useState<string | null>(initialTime ?? null);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (!date) {
      setSlots([]);
      return;
    }
    let active = true;
    setLoadingSlots(true);
    setTime(date === initialDate ? initialTime ?? null : null);
    getVisitSlots(date).then((result) => {
      if (!active) return;
      setSlots(result);
      setLoadingSlots(false);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  return (
    <div>
      <p className="text-[13px] font-semibold text-slate">임장 일정 선택</p>
      <h3 className="mt-1 truncate text-[16px] font-bold text-ink">{property.title}</h3>

      <MiniCalendar selectedDate={date} onSelectDate={setDate} className="mt-4" />

      <div className="mt-5">
        <p className="text-[13px] font-semibold text-ink">방문 가능 시간</p>
        {!date && <p className="mt-2 text-[13px] text-slate">날짜를 먼저 선택해주세요.</p>}
        {date && loadingSlots && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-9 animate-pulse rounded-full bg-black/5" />
            ))}
          </div>
        )}
        {date && !loadingSlots && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {slots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                aria-pressed={time === slot}
                className={cn(
                  "h-9 rounded-full text-[13px] font-semibold transition-all",
                  time === slot
                    ? "bg-grad-primary text-white shadow-[0_8px_20px_rgba(0,131,255,0.25)]"
                    : "glass-surface text-ink hover:bg-white/70",
                )}
              >
                {formatTimeLabel(slot)}
              </button>
            ))}
          </div>
        )}
      </div>

      <GradientButton
        type="button"
        fullWidth
        className="mt-6"
        disabled={!date || !time}
        onClick={() => date && time && onConfirm(date, time)}
      >
        이 일정으로 담기
      </GradientButton>

      <p className="mt-4 text-[12px] leading-relaxed text-slate">
        중개사 일정에 맞춰 임장을 신청해요. 같은 날짜로 여러 매물을 묶어 신청할 수도 있어요.
      </p>
    </div>
  );
}
