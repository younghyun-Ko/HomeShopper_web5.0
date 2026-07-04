"use client";

import { Check, Home, Search } from "lucide-react";
import GradientButton from "@/components/ui/GradientButton";
import { getBuildingRegister } from "@/lib/api";
import { digitsOnly } from "@/lib/utils";
import { StepProps } from "../_lib/reducer";

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="area-pyeong" className="text-sm font-semibold text-ink">
            희망 평 수
          </label>
          <div className="relative mt-2">
            <input
              id="area-pyeong"
              type="text"
              inputMode="numeric"
              value={state.areaPyeong}
              onChange={(event) =>
                dispatch({ type: "SET_AREA_PYEONG", value: digitsOnly(event.target.value) })
              }
              placeholder="0"
              className="glass-surface h-12 w-full rounded-2xl px-4 pr-10 text-right text-[15px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-slate">
              평
            </span>
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
            className="glass-surface mt-2 h-12 w-full rounded-2xl px-4 text-[15px] text-ink focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
          />
        </div>
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
