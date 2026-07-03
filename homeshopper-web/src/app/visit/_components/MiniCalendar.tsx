"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MiniCalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  className?: string;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function toISODate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function MiniCalendar({
  selectedDate,
  onSelectDate,
  className,
}: MiniCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const canGoPrevious =
    year > today.getFullYear() || (year === today.getFullYear() && month > today.getMonth());

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  return (
    <div className={cn("glass-surface rounded-2xl p-4", className)}>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => canGoPrevious && setCursor(new Date(year, month - 1, 1))}
          disabled={!canGoPrevious}
          aria-label="이전 달"
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5 disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-[14px] font-bold text-ink">
          {year}년 {month + 1}월
        </p>
        <button
          type="button"
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          aria-label="다음 달"
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 text-center text-[11px] font-medium text-slate">
        {WEEKDAYS.map((weekday) => (
          <div key={weekday}>{weekday}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-y-1 text-center">
        {cells.map((day, index) => {
          if (day === null) return <div key={`empty-${index}`} />;
          const iso = toISODate(year, month, day);
          const isPast = new Date(year, month, day) < today;
          const isSelected = selectedDate === iso;
          return (
            <button
              key={iso}
              type="button"
              disabled={isPast}
              onClick={() => onSelectDate(iso)}
              aria-pressed={isSelected}
              className={cn(
                "relative mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-medium transition-colors",
                isPast && "text-slate/30",
                !isPast && !isSelected && "text-ink hover:bg-white/70",
                isSelected && "bg-grad-primary text-white",
              )}
            >
              {day}
              {!isPast && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-grad-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
