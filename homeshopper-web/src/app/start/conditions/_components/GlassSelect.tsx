"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GlassSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  className?: string;
}

export default function GlassSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  className,
}: GlassSelectProps) {
  return (
    <div className={cn("relative", className)}>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "glass-surface h-12 w-full appearance-none rounded-2xl px-4 pr-10 text-[15px] focus:outline-none focus:ring-2 focus:ring-brand-blue/40",
          value ? "text-ink" : "text-slate/70",
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
    </div>
  );
}
