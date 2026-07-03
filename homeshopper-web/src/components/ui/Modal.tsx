"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type ModalMaxWidth = "sm" | "md" | "lg";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** sm: 480px / md: 640px / lg: 880px (desktop only — mobile sheet is always full width) */
  maxWidth?: ModalMaxWidth;
  /** used as the dialog's accessible name */
  title?: string;
  className?: string;
}

const MAX_WIDTH_CLASSES: Record<ModalMaxWidth, string> = {
  sm: "md:max-w-[480px]",
  md: "md:max-w-[640px]",
  lg: "md:max-w-[880px]",
};

export default function Modal({
  open,
  onClose,
  children,
  maxWidth = "md",
  title,
  className,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-ink/40 md:items-center md:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "glass-surface w-full animate-sheet-up max-h-[85vh] overflow-y-auto rounded-t-[28px] p-6",
          "md:w-full md:animate-modal-in md:max-h-[80vh] md:rounded-modal md:p-8",
          MAX_WIDTH_CLASSES[maxWidth],
          className,
        )}
      >
        <div className="mb-4 flex justify-center md:hidden">
          <div className="h-1.5 w-10 rounded-full bg-ink/15" />
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
