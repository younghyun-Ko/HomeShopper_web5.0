"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type GradientButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type GradientButtonSize = "lg" | "md";

export interface GradientButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  variant?: GradientButtonVariant;
  size?: GradientButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<GradientButtonVariant, string> = {
  primary:
    "bg-grad-primary text-white shadow-[0_8px_24px_rgba(0,131,255,0.28)] hover:brightness-105",
  secondary:
    "bg-white/55 backdrop-blur-xl backdrop-saturate-[180%] border border-white/60 text-ink shadow-[0_8px_32px_rgba(31,41,72,0.12)] hover:bg-white/70",
  danger: "bg-transparent text-danger border border-danger/50 hover:bg-danger/5",
  ghost: "bg-transparent text-ink hover:bg-black/5",
};

const SIZE_CLASSES: Record<GradientButtonSize, string> = {
  lg: "h-14 px-7 text-[17px]",
  md: "h-11 px-5 text-[15px]",
};

export default function GradientButton({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled,
  className,
  children,
  ...props
}: GradientButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-btn font-semibold transition-all duration-150 ease-out active:scale-95 active:opacity-90 disabled:pointer-events-none disabled:opacity-50",
        SIZE_CLASSES[size],
        fullWidth && "w-full",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="h-[1.1em] w-[1.1em] animate-spin" />}
      {children}
    </button>
  );
}
