"use client";

import { Info } from "lucide-react";
import { cn, digitsOnly, formatThousands } from "@/lib/utils";
import { StepProps } from "../_lib/reducer";

const LOAN_OPTIONS = [
  { label: "대출 진행", value: true },
  { label: "미 대출", value: false },
];

export default function Step3Budget({ state, dispatch }: StepProps) {
  const monthlyRentDisabled = state.dealType !== "월세";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="budget" className="text-sm font-semibold text-ink">
            보증금/매입금 예산
          </label>
          <div className="relative mt-2">
            <input
              id="budget"
              type="text"
              inputMode="numeric"
              value={formatThousands(state.budget)}
              onChange={(event) =>
                dispatch({ type: "SET_BUDGET", value: digitsOnly(event.target.value) })
              }
              placeholder="0"
              className="glass-surface h-12 w-full rounded-2xl px-4 pr-14 text-right text-[15px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-slate">
              만원
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="monthly-rent"
            className={cn(
              "text-sm font-semibold",
              monthlyRentDisabled ? "text-slate/60" : "text-ink",
            )}
          >
            희망 월세
          </label>
          <div className="relative mt-2">
            <input
              id="monthly-rent"
              type="text"
              inputMode="numeric"
              disabled={monthlyRentDisabled}
              value={formatThousands(state.monthlyRent)}
              onChange={(event) =>
                dispatch({ type: "SET_MONTHLY_RENT", value: digitsOnly(event.target.value) })
              }
              placeholder="0"
              className={cn(
                "glass-surface h-12 w-full rounded-2xl px-4 pr-14 text-right text-[15px] placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40",
                monthlyRentDisabled ? "cursor-not-allowed text-slate/50 opacity-60" : "text-ink",
              )}
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-slate">
              만원
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-ink">보증금 대출 진행여부</p>
          <div role="radiogroup" aria-label="보증금 대출 진행여부" className="mt-2 grid grid-cols-2 gap-3">
            {LOAN_OPTIONS.map((option) => {
              const selected = state.loanPlanned === option.value;
              return (
                <button
                  key={option.label}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => dispatch({ type: "SET_LOAN_PLANNED", value: option.value })}
                  className={cn(
                    "h-12 rounded-2xl text-[14px] font-semibold transition-all duration-200",
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
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <label
              htmlFor="loan-method"
              className={cn(
                "text-sm font-semibold",
                state.loanPlanned ? "text-ink" : "text-slate/60",
              )}
            >
              보증금 대출 방식
            </label>
            <span className="group relative inline-flex">
              <Info className="h-3.5 w-3.5 cursor-help text-slate" />
              <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-[220px] -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1.5 text-[11px] text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                버팀목, 중기청, 카카오 전월세 등
              </span>
            </span>
          </div>
          <input
            id="loan-method"
            type="text"
            disabled={!state.loanPlanned}
            value={state.loanMethod}
            onChange={(event) => dispatch({ type: "SET_LOAN_METHOD", value: event.target.value })}
            placeholder="대출 상품명을 입력해주세요"
            className={cn(
              "glass-surface mt-2 h-12 w-full rounded-2xl px-4 text-[15px] placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40",
              !state.loanPlanned ? "cursor-not-allowed text-slate/50 opacity-60" : "text-ink",
            )}
          />
        </div>
      </div>
    </div>
  );
}
