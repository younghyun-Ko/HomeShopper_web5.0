"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "caution" | "danger";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  action?: ToastAction;
  /** ms before auto-dismiss. defaults to 4000 */
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_ICON: Record<ToastVariant, LucideIcon> = {
  default: Info,
  success: CheckCircle2,
  caution: AlertTriangle,
  danger: XCircle,
};

const VARIANT_COLOR: Record<ToastVariant, string> = {
  default: "text-ink",
  success: "text-success",
  caution: "text-caution",
  danger: "text-danger",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (options: ToastOptions) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const duration = options.duration ?? 4000;
      setToasts((prev) => [...prev, { id, variant: "default", ...options }]);
      window.setTimeout(() => dismissToast(id), duration);
    },
    [dismissToast],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 md:inset-x-auto md:bottom-6 md:right-6 md:items-end md:px-0">
        {toasts.map((toast) => {
          const Icon = VARIANT_ICON[toast.variant ?? "default"];
          return (
            <div
              key={toast.id}
              role="status"
              className="glass-surface pointer-events-auto flex w-full max-w-sm animate-fade-in items-start gap-3 rounded-2xl p-4 md:w-96"
            >
              <Icon
                className={cn(
                  "mt-0.5 h-5 w-5 shrink-0",
                  VARIANT_COLOR[toast.variant ?? "default"],
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-ink">{toast.title}</p>
                {toast.description && (
                  <p className="mt-0.5 text-[13px] text-slate">
                    {toast.description}
                  </p>
                )}
                {toast.action && (
                  <button
                    type="button"
                    onClick={() => {
                      toast.action?.onClick();
                      dismissToast(toast.id);
                    }}
                    className="mt-2 text-[13px] font-semibold text-brand-blue hover:underline"
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="닫기"
                className="shrink-0 text-slate transition-colors hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx.showToast;
}
