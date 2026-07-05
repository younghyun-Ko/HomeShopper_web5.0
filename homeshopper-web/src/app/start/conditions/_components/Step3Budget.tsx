"use client";

import { useEffect } from "react";
import { Info } from "lucide-react";
import RangeSlider from "@/components/ui/RangeSlider";
import { cn } from "@/lib/utils";
import { StepProps } from "../_lib/reducer";
import {
  depositSliderBounds,
  isUnsetRange,
  monthlySliderBounds,
  PriceTier,
  rangesEqual,
  tierPreset,
} from "../_lib/marketSlider";

const LOAN_OPTIONS = [
  { label: "대출 진행", value: true },
  { label: "미 대출", value: false },
];

const PRICE_TIERS: PriceTier[] = ["low", "mid", "high"];

const TIER_CHIPS: { tier: PriceTier | "custom"; label: string }[] = [
  { tier: "low", label: "시세 하위" },
  { tier: "mid", label: "시세 중간" },
  { tier: "high", label: "시세 상위" },
  { tier: "custom", label: "직접 조정" },
];

export default function Step3Budget({ state, dispatch }: StepProps) {
  const band = state.marketBand;
  const showMonthly = state.dealType === "월세";

  const depositBounds = depositSliderBounds(band);
  const monthlyBounds = monthlySliderBounds(band);
  const depositMidPreset = tierPreset(depositBounds, "mid");
  const monthlyMidPreset = tierPreset(monthlyBounds, "mid");

  // 이 스텝에 처음 들어와 아직 손대지 않았을 때만 시세 중간값을 채워준다.
  // 시세 밴드가 비동기로 늦게 도착해도, 그때까지 손대지 않았다면 다시 채워 넣는다.
  useEffect(() => {
    if (isUnsetRange(state.budgetRange)) {
      dispatch({ type: "SET_BUDGET_RANGE", value: depositMidPreset });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [band]);

  useEffect(() => {
    if (showMonthly && isUnsetRange(state.monthlyRentRange)) {
      dispatch({ type: "SET_MONTHLY_RENT_RANGE", value: monthlyMidPreset });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [band, showMonthly]);

  const dontKnowChecked =
    rangesEqual(state.budgetRange, depositMidPreset) &&
    (!showMonthly || rangesEqual(state.monthlyRentRange, monthlyMidPreset));

  const handleDontKnowToggle = () => {
    dispatch({ type: "SET_BUDGET_RANGE", value: depositMidPreset });
    if (showMonthly) {
      dispatch({ type: "SET_MONTHLY_RENT_RANGE", value: monthlyMidPreset });
    }
  };

  const activeDepositTier: PriceTier | "custom" =
    PRICE_TIERS.find((tier) => rangesEqual(state.budgetRange, tierPreset(depositBounds, tier))) ??
    "custom";
  const activeMonthlyTier: PriceTier | "custom" =
    PRICE_TIERS.find((tier) =>
      rangesEqual(state.monthlyRentRange, tierPreset(monthlyBounds, tier)),
    ) ?? "custom";

  return (
    <div className="space-y-8">
      <div>
        <label className="text-sm font-semibold text-ink">보증금/매입금 예산</label>

        <div className="mt-3 flex flex-wrap gap-2">
          {TIER_CHIPS.map(({ tier, label }) => {
            const isActive = activeDepositTier === tier;
            return (
              <button
                key={label}
                type="button"
                onClick={() => {
                  if (tier === "custom") return;
                  dispatch({ type: "SET_BUDGET_RANGE", value: tierPreset(depositBounds, tier) });
                }}
                aria-pressed={isActive}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-200",
                  isActive
                    ? "bg-grad-primary text-white shadow-[0_6px_16px_rgba(0,131,255,0.25)]"
                    : "glass-surface text-ink hover:bg-white/70",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          <RangeSlider
            min={depositBounds.min}
            max={depositBounds.max}
            step={10}
            value={state.budgetRange}
            onChange={(value) => dispatch({ type: "SET_BUDGET_RANGE", value })}
            overlayRange={band ? band.depositRange : undefined}
            overlayLabel={band ? "이 지역 시세 구간" : undefined}
            unit="만원"
          />
        </div>
      </div>

      {showMonthly && (
        <div>
          <label className="text-sm font-semibold text-ink">희망 월세</label>

          <div className="mt-3 flex flex-wrap gap-2">
            {TIER_CHIPS.map(({ tier, label }) => {
              const isActive = activeMonthlyTier === tier;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (tier === "custom") return;
                    dispatch({
                      type: "SET_MONTHLY_RENT_RANGE",
                      value: tierPreset(monthlyBounds, tier),
                    });
                  }}
                  aria-pressed={isActive}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-200",
                    isActive
                      ? "bg-grad-primary text-white shadow-[0_6px_16px_rgba(0,131,255,0.25)]"
                      : "glass-surface text-ink hover:bg-white/70",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <RangeSlider
              min={monthlyBounds.min}
              max={monthlyBounds.max}
              step={5}
              value={state.monthlyRentRange}
              onChange={(value) => dispatch({ type: "SET_MONTHLY_RENT_RANGE", value })}
              overlayRange={band?.monthlyRange}
              overlayLabel={band?.monthlyRange ? "이 지역 시세 구간" : undefined}
              unit="만원"
            />
          </div>
        </div>
      )}

      <div>
        <label className="glass-surface flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3.5">
          <input
            type="checkbox"
            checked={dontKnowChecked}
            onChange={handleDontKnowToggle}
            className="h-4 w-4 rounded border-slate/40 text-brand-blue focus:ring-2 focus:ring-brand-blue/40"
          />
          <span className="text-[14px] font-medium text-ink">잘 모르겠어요</span>
        </label>
        {dontKnowChecked && (
          <p className="mt-2 text-[12px] text-slate">
            전담 매니저가 상담 때 예산을 함께 정리해 드려요
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-black/5 pt-6 sm:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-ink">보증금 대출 진행여부</p>
          <div
            role="radiogroup"
            aria-label="보증금 대출 진행여부"
            className="mt-2 grid grid-cols-2 gap-3"
          >
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
