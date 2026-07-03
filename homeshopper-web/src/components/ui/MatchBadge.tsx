"use client";

import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MatchCriterion {
  label: string;
  met: boolean;
}

export type MatchBadgeTrigger = "click" | "hover";

export interface MatchBadgeProps {
  criteria: MatchCriterion[];
  /** allow expanding to show each criterion. defaults to true */
  expandable?: boolean;
  defaultExpanded?: boolean;
  /** "click": inline expand below the badge. "hover": floating popover above the badge (falls back to click on touch via onClick). defaults to "click" */
  trigger?: MatchBadgeTrigger;
  className?: string;
}

export default function MatchBadge({
  criteria,
  expandable = true,
  defaultExpanded = false,
  trigger = "click",
  className,
}: MatchBadgeProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const metCount = criteria.filter((criterion) => criterion.met).length;
  const isOpen = expandable && expanded;
  const isHover = expandable && trigger === "hover";

  const criteriaList = (
    <div className="flex flex-wrap gap-1.5">
      {criteria.map((criterion) => (
        <span
          key={criterion.label}
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-medium",
            criterion.met ? "bg-success/10 text-success" : "bg-black/5 text-slate",
          )}
        >
          {criterion.met ? (
            <Check className="h-3 w-3" />
          ) : (
            <X className="h-3 w-3" />
          )}
          {criterion.label}
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn("relative inline-flex flex-col items-start gap-2", className)}
      onMouseEnter={isHover ? () => setExpanded(true) : undefined}
      onMouseLeave={isHover ? () => setExpanded(false) : undefined}
    >
      <button
        type="button"
        onClick={() => expandable && trigger === "click" && setExpanded((prev) => !prev)}
        onFocus={isHover ? () => setExpanded(true) : undefined}
        onBlur={isHover ? () => setExpanded(false) : undefined}
        aria-expanded={expandable ? expanded : undefined}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-[13px] font-semibold text-success transition-colors",
          expandable && "cursor-pointer hover:bg-success/15",
        )}
      >
        고려사항 {metCount}/{criteria.length} 충족
        {expandable && trigger === "click" && (
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              expanded && "rotate-180",
            )}
          />
        )}
      </button>
      {isOpen &&
        (isHover ? (
          <div className="glass-surface absolute bottom-full left-0 z-20 mb-2 w-max max-w-[260px] animate-fade-in rounded-2xl p-3 shadow-lg">
            {criteriaList}
          </div>
        ) : (
          criteriaList
        ))}
    </div>
  );
}
