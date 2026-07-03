"use client";

import { cn } from "@/lib/utils";

export interface ChipSelectOption {
  label: string;
  value: string;
}

export interface ChipSelectProps {
  options: ChipSelectOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function ChipSelect({ options, value, onChange, className }: ChipSelectProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={selected}
            className={cn(
              "rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-200",
              selected
                ? "bg-grad-primary text-white shadow-[0_8px_20px_rgba(0,131,255,0.25)]"
                : "glass-surface text-ink hover:bg-white/70",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
