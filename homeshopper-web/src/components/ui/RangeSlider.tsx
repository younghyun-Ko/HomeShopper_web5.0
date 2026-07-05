"use client";

import { useState } from "react";
import { cn, digitsOnly } from "@/lib/utils";

export interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  /** 트랙 위에 오버레이할 보조 구간(예: 시세 밴드) */
  overlayRange?: [number, number];
  overlayLabel?: string;
  /** 값 뒤에 붙는 단위 (예: "만원") */
  unit?: string;
  className?: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

interface EditableEndpointProps {
  value: number;
  min: number;
  max: number;
  unit: string;
  align: "left" | "right";
  onCommit: (next: number) => void;
}

/** 슬라이더 옆 min/max 숫자 표시. 클릭하면 직접 입력할 수 있는 보조 수단으로 전환된다 */
function EditableEndpoint({ value, min, max, unit, align, onCommit }: EditableEndpointProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => {
          setDraft(String(value));
          setEditing(true);
        }}
        className="rounded-lg px-1.5 py-0.5 text-[13px] font-semibold text-ink underline decoration-dotted underline-offset-4 hover:bg-black/5"
      >
        {value.toLocaleString("ko-KR")}
        {unit}
      </button>
    );
  }

  const commit = () => {
    setEditing(false);
    onCommit(clamp(Number(draft || 0), min, max));
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      autoFocus
      value={draft}
      onChange={(event) => setDraft(digitsOnly(event.target.value))}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") commit();
      }}
      className={cn(
        "h-7 w-20 rounded-lg border border-brand-blue/30 px-2 text-[13px] font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-brand-blue/40",
        align === "right" && "text-right",
      )}
    />
  );
}

export default function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  overlayRange,
  overlayLabel,
  unit = "",
  className,
}: RangeSliderProps) {
  const span = Math.max(1, max - min);
  const toPercent = (v: number) => ((clamp(v, min, max) - min) / span) * 100;
  const [low, high] = value;

  const handleLowChange = (next: number) => onChange([Math.min(clamp(next, min, max), high), high]);
  const handleHighChange = (next: number) => onChange([low, Math.max(clamp(next, min, max), low)]);

  return (
    <div className={cn("w-full", className)}>
      {overlayRange && overlayLabel && (
        <p className="mb-2 text-[12px] font-medium text-brand-blue">{overlayLabel}</p>
      )}

      <div className="relative h-5">
        <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-black/10" />

        {overlayRange && (
          <div
            className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand-blue/20"
            style={{
              left: `${toPercent(overlayRange[0])}%`,
              width: `${toPercent(overlayRange[1]) - toPercent(overlayRange[0])}%`,
            }}
          />
        )}

        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-grad-primary"
          style={{
            left: `${toPercent(low)}%`,
            width: `${toPercent(high) - toPercent(low)}%`,
          }}
        />

        <input
          type="range"
          className="range-input absolute inset-x-0 top-1/2 h-5 w-full -translate-y-1/2"
          style={{ zIndex: 2 }}
          min={min}
          max={max}
          step={step}
          value={low}
          onChange={(event) => handleLowChange(Number(event.target.value))}
          aria-label="최소값"
        />
        <input
          type="range"
          className="range-input absolute inset-x-0 top-1/2 h-5 w-full -translate-y-1/2"
          style={{ zIndex: 3 }}
          min={min}
          max={max}
          step={step}
          value={high}
          onChange={(event) => handleHighChange(Number(event.target.value))}
          aria-label="최대값"
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <EditableEndpoint value={low} min={min} max={high} unit={unit} align="left" onCommit={handleLowChange} />
        <EditableEndpoint value={high} min={low} max={max} unit={unit} align="right" onCommit={handleHighChange} />
      </div>
    </div>
  );
}
