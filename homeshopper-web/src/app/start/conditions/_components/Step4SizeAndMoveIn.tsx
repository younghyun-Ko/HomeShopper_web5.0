"use client";

import { digitsOnly } from "@/lib/utils";
import { StepProps } from "../_lib/reducer";

export default function Step4SizeAndMoveIn({ state, dispatch }: StepProps) {
  return (
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
  );
}
