"use client";

import { useMemo, useState } from "react";
import { Bell, BellOff, Paperclip } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { addDays, formatFullDate } from "../_lib/dashboard-utils";

interface TimelineEvent {
  id: string;
  title: string;
  date: Date;
}

interface Subtask {
  id: string;
  label: string;
  actionLabel?: string;
  done: boolean;
}

const TODAY_EVENT_ID = "e-today";

function buildMockEvents(): TimelineEvent[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return [
    { id: "e-visit", title: "임장 방문", date: addDays(today, -2) },
    { id: TODAY_EVENT_ID, title: "계약 체결", date: today },
    { id: "e-balance", title: "잔금 입금", date: addDays(today, 5) },
    { id: "e-registry", title: "소유권 이전 등기", date: addDays(today, 6) },
    { id: "e-done", title: "거래 완료", date: addDays(today, 7) },
  ];
}

function ddayInfo(date: Date, today: Date) {
  const diffMs = date.getTime() - today.getTime();
  const dday = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const label = dday > 0 ? `+${dday}` : String(dday);
  return { dday, label };
}

export interface TimelineViewProps {
  onSubtasksAllDone?: () => void;
  className?: string;
}

export default function TimelineView({ onSubtasksAllDone, className }: TimelineViewProps) {
  const events = useMemo(buildMockEvents, []);
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const [alarms, setAlarms] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(events.map((event) => [event.id, event.id !== "e-registry"])),
  );

  const [subtasks, setSubtasks] = useState<Subtask[]>([
    { id: "registry-doc", label: "등기사항증명서 확인", done: true },
    { id: "resident-doc", label: "주민등록등본", actionLabel: "첨부하기", done: true },
    { id: "virtual-account", label: "가상계좌 입금", actionLabel: "입금하기", done: false },
  ]);

  const toggleAlarm = (eventId: string) => {
    setAlarms((prev) => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const toggleSubtask = (subtaskId: string) => {
    // setState 업데이터 함수 안에서 부모 콜백을 호출하면 "다른 컴포넌트를 렌더링 중에 상태
    // 갱신" 경고가 발생하므로, 업데이트된 값을 먼저 계산해 setState에는 값만 넘기고
    // 콜백은 이벤트 핸들러 레벨에서 별도로 호출한다.
    const updated = subtasks.map((task) =>
      task.id === subtaskId ? { ...task, done: !task.done } : task,
    );
    setSubtasks(updated);
    if (updated.every((task) => task.done) && !subtasks.every((task) => task.done)) {
      onSubtasksAllDone?.();
    }
  };

  return (
    <div className={cn("mx-auto max-w-[720px] space-y-4", className)}>
      {events.map((event) => {
        const { dday, label } = ddayInfo(event.date, today);
        const isToday = dday === 0;
        const isPast = dday < 0;
        const alarmOn = alarms[event.id];

        return (
          <GlassCard key={event.id} padding={20}>
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[13px] font-bold",
                  isToday && "bg-grad-primary text-white",
                  isPast && "bg-danger/10 text-danger",
                  !isToday && !isPast && "glass-surface text-ink",
                )}
              >
                {label}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold text-ink">{event.title}</p>
                <p className="text-[12px] text-slate">{formatFullDate(event.date)}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleAlarm(event.id)}
                aria-label={alarmOn ? "알림 끄기" : "알림 켜기"}
                aria-pressed={alarmOn}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate transition-colors hover:bg-black/5"
              >
                {alarmOn ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </button>
            </div>

            {isToday && (
              <div className="mt-4 space-y-2 border-t border-black/5 pt-4">
                {subtasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between gap-3 text-[13px]"
                  >
                    <label className="flex flex-1 items-center gap-2">
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleSubtask(task.id)}
                        className="h-4 w-4 shrink-0 rounded border-black/20 accent-[var(--blue)]"
                      />
                      <span className={cn(task.done ? "text-ink" : "text-slate")}>
                        {task.label}
                      </span>
                    </label>
                    {task.actionLabel && !task.done && (
                      <button
                        type="button"
                        onClick={() => toggleSubtask(task.id)}
                        className="inline-flex items-center gap-1 rounded-full bg-brand-blue/10 px-2.5 py-1 text-[11px] font-semibold text-brand-blue"
                      >
                        <Paperclip className="h-3 w-3" />
                        {task.actionLabel}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        );
      })}
    </div>
  );
}
