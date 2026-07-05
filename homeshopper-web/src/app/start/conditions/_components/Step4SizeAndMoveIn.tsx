"use client";

import { Check, Home, HelpCircle, Search } from "lucide-react";
import GradientButton from "@/components/ui/GradientButton";
import { getBuildingRegister } from "@/lib/api";
import { cn } from "@/lib/utils";
import { StepProps } from "../_lib/reducer";

interface SizeOption {
  key: string;
  title: string;
  caption: string;
  range: [number, number] | null;
  /** 면적 비례 사각형 일러스트 크기(px). null이면 "잘 모르겠어요" 카드 */
  visual: { width: number; height: number } | null;
}

const SIZE_OPTIONS: SizeOption[] = [
  {
    key: "compact",
    title: "컴팩트 (5평 이하)",
    caption: "침대+책상, 원룸 표준",
    range: [1, 5],
    visual: { width: 26, height: 26 },
  },
  {
    key: "medium",
    title: "보통 (6~9평)",
    caption: "분리형 원룸·1.5룸까지",
    range: [6, 9],
    visual: { width: 38, height: 34 },
  },
  {
    key: "spacious",
    title: "넉넉 (10~14평)",
    caption: "투룸·거실 분리",
    range: [10, 14],
    visual: { width: 54, height: 42 },
  },
  {
    key: "unsure",
    title: "잘 모르겠어요",
    caption: "예산에 맞는 크기로 추천해 드려요",
    range: null,
    visual: null,
  },
];

function rangesEqual(a: [number, number] | null, b: [number, number] | null): boolean {
  if (a === null || b === null) return a === b;
  return a[0] === b[0] && a[1] === b[1];
}

export default function Step4SizeAndMoveIn({ state, dispatch }: StepProps) {
  const handleLookupStructure = async () => {
    const address = state.currentAddress.trim();
    if (!address) return;
    dispatch({ type: "LOOKUP_STRUCTURE_START" });
    const structure = await getBuildingRegister(address);
    dispatch({ type: "LOOKUP_STRUCTURE_DONE", value: structure });
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-ink">희망 평 수</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {SIZE_OPTIONS.map((option) => {
            const selected =
              state.areaPyeongRange !== undefined &&
              rangesEqual(state.areaPyeongRange, option.range);
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => dispatch({ type: "SET_AREA_PYEONG_RANGE", value: option.range })}
                aria-pressed={selected}
                className={cn(
                  "relative flex min-h-[132px] flex-col items-center justify-center gap-2 rounded-2xl px-3 py-4 text-center transition-all duration-200",
                  selected
                    ? "bg-brand-blue/10 ring-2 ring-brand-blue/30"
                    : "glass-surface hover:bg-white/70",
                )}
              >
                <div className="flex h-11 w-11 items-center justify-center">
                  {option.visual ? (
                    <div
                      className={cn(
                        "rounded-md transition-colors duration-200",
                        selected ? "bg-grad-primary" : "bg-black/15",
                      )}
                      style={{ width: option.visual.width, height: option.visual.height }}
                    />
                  ) : (
                    <HelpCircle
                      className={cn("h-7 w-7", selected ? "text-brand-blue" : "text-slate/60")}
                    />
                  )}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-ink">{option.title}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-slate">{option.caption}</p>
                </div>
                {selected && (
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-grad-primary text-white shadow-md">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="move-in-after" className="text-sm font-semibold text-ink">
          입주 희망시기(~이후)
        </label>
        <input
          id="move-in-after"
          type="date"
          value={state.moveInAfter}
          onChange={(event) => dispatch({ type: "SET_MOVE_IN_AFTER", value: event.target.value })}
          className="glass-surface mt-2 h-12 w-full max-w-xs rounded-2xl px-4 text-[15px] text-ink focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
        />
      </div>

      <div className="border-t border-black/5 pt-6">
        <p className="text-sm font-semibold text-ink">
          지금 집 기준으로 원하는 집 구조 설명하기{" "}
          <span className="font-normal text-slate">(선택)</span>
        </p>
        <p className="mt-1 text-[13px] text-slate">
          지금 살고 계신 곳의 주소를 알려주시면, 건축물대장을 확인해 구조를 참고한 매물을
          찾아드려요.
        </p>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={state.currentAddress}
            onChange={(event) =>
              dispatch({ type: "SET_CURRENT_ADDRESS", value: event.target.value })
            }
            placeholder="지금 살고 있는 집 주소를 입력해주세요"
            className="glass-surface h-12 w-full flex-1 rounded-2xl px-4 text-[15px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
          />
          <GradientButton
            type="button"
            variant="secondary"
            onClick={handleLookupStructure}
            loading={state.isLookingUpStructure}
            disabled={!state.currentAddress.trim() || state.isLookingUpStructure}
            className="sm:w-40"
          >
            <Search className="h-4 w-4" />
            구조 확인하기
          </GradientButton>
        </div>

        {state.currentStructure && (
          <div className="glass-surface mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-2xl px-4 py-3 text-[13px] text-ink">
            <span className="inline-flex items-center gap-1 font-semibold text-brand-blue">
              <Home className="h-3.5 w-3.5" />
              건축물대장 조회 결과
            </span>
            <span>{state.currentStructure.builtYear}년 준공</span>
            <span>
              {state.currentStructure.unitFloor}층/{state.currentStructure.totalFloors}층 ·{" "}
              {state.currentStructure.structureType}
            </span>
            <span>방 {state.currentStructure.roomCount}개 · 욕실 {state.currentStructure.bathroomCount}개</span>
            <span>{state.currentStructure.areaPyeong}평</span>
            {state.currentStructure.hasDressRoom && (
              <span className="inline-flex items-center gap-1 text-success">
                <Check className="h-3 w-3" />
                드레스룸
              </span>
            )}
            {state.currentStructure.hasPantry && (
              <span className="inline-flex items-center gap-1 text-success">
                <Check className="h-3 w-3" />
                펜트리
              </span>
            )}
          </div>
        )}

        <textarea
          value={state.structureRequest}
          onChange={(event) =>
            dispatch({ type: "SET_STRUCTURE_REQUEST", value: event.target.value })
          }
          placeholder="예: 지금 살고 있는 집보다 옷방이 더 넓고, 펜트리가 있었으면 좋겠어요."
          rows={3}
          className="glass-surface mt-3 w-full resize-none rounded-2xl px-4 py-3 text-[14px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
        />
      </div>
    </div>
  );
}
