"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export interface DistrictMultiSelectProps {
  id?: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
  placeholder: string;
  max?: number;
  className?: string;
}

export default function DistrictMultiSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  max = 3,
  className,
}: DistrictMultiSelectProps) {
  const showToast = useToast();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [shakingOption, setShakingOption] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const filteredOptions = options.filter((option) => option.includes(query.trim()));

  const handleToggle = (option: string) => {
    const selected = value.includes(option);
    if (selected) {
      onChange(value.filter((item) => item !== option));
      return;
    }
    if (value.length >= max) {
      setShakingOption(option);
      showToast({
        title: `희망 지역은 최대 ${max}개까지 선택할 수 있어요`,
        variant: "caution",
      });
      window.setTimeout(() => {
        setShakingOption((current) => (current === option ? null : current));
      }, 400);
      return;
    }
    onChange([...value, option]);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        id={id}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="glass-surface flex min-h-[48px] w-full flex-wrap items-center gap-1.5 rounded-2xl px-3 py-2 pr-10 text-left"
      >
        {value.length === 0 ? (
          <span className="px-1 text-[15px] text-slate/70">{placeholder}</span>
        ) : (
          value.map((district) => (
            <span
              key={district}
              className="inline-flex items-center gap-1 rounded-full bg-brand-blue/10 py-1 pl-3 pr-1.5 text-[13px] font-semibold text-brand-blue"
            >
              {district}
              <span
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation();
                  handleToggle(district);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.stopPropagation();
                    event.preventDefault();
                    handleToggle(district);
                  }
                }}
                aria-label={`${district} 선택 해제`}
                className="flex h-4 w-4 items-center justify-center rounded-full text-brand-blue/70 hover:bg-brand-blue/20 hover:text-brand-blue"
              >
                <X className="h-3 w-3" />
              </span>
            </span>
          ))
        )}
        <ChevronDown
          className={cn(
            "pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="glass-surface absolute inset-x-0 top-[calc(100%+8px)] z-20 rounded-2xl p-3 shadow-lg">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="구 이름으로 검색"
              className="h-10 w-full rounded-xl bg-black/5 pl-9 pr-3 text-[14px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
            />
          </div>

          <div className="mt-3 grid max-h-64 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
            {filteredOptions.map((option) => {
              const selected = value.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleToggle(option)}
                  aria-pressed={selected}
                  className={cn(
                    "flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-[13px] font-medium transition-all duration-200",
                    selected
                      ? "bg-grad-primary text-white shadow-[0_4px_14px_rgba(0,131,255,0.25)]"
                      : "bg-black/5 text-ink hover:bg-black/10",
                    shakingOption === option && "animate-shake",
                  )}
                >
                  {selected && <Check className="h-3 w-3 shrink-0" />}
                  {option}
                </button>
              );
            })}
            {filteredOptions.length === 0 && (
              <p className="col-span-full py-4 text-center text-[13px] text-slate">
                검색 결과가 없어요
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
