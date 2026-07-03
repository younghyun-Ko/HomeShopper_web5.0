"use client";

import { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps {
  children: ReactNode;
  /** inner padding in px, applied on all sides. defaults to 24 */
  padding?: number;
  /** element/component to render as. defaults to 'div' */
  as?: ElementType;
  onClick?: () => void;
  className?: string;
}

export default function GlassCard({
  children,
  padding = 24,
  as: Component = "div",
  onClick,
  className,
}: GlassCardProps) {
  const interactive = Boolean(onClick);

  return (
    <Component
      onClick={onClick}
      className={cn(
        "glass transition-all duration-200 ease-out",
        interactive &&
          "cursor-pointer hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(31,41,72,0.18),0_0_0_1px_rgba(0,131,255,0.12),inset_0_1px_0_rgba(255,255,255,0.7)] active:scale-[0.98] active:opacity-90",
        className,
      )}
      style={{ padding: `${padding}px` }}
    >
      {children}
    </Component>
  );
}
