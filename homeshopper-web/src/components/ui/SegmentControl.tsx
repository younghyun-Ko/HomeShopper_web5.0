"use client";

import { cn } from "@/lib/utils";

export interface SegmentOption<T extends string> {
  label: string;
  value: T;
}

export interface SegmentControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** stretch to fill the width of its container. defaults to inline/hug-content */
  fullWidth?: boolean;
  className?: string;
}

export default function SegmentControl<T extends string>({
  options,
  value,
  onChange,
  fullWidth = false,
  className,
}: SegmentControlProps<T>) {
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  return (
    <div
      role="tablist"
      className={cn(
        "glass-surface relative rounded-full p-1",
        fullWidth ? "flex w-full" : "inline-flex",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-1 left-1 rounded-full bg-white shadow-[0_2px_8px_rgba(31,41,72,0.16)] transition-transform duration-[220ms] ease-spring"
        style={{
          width: `calc((100% - 8px) / ${options.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            "relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
            fullWidth ? "flex-1" : "min-w-[88px]",
            option.value === value ? "text-ink" : "text-slate hover:text-ink",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
