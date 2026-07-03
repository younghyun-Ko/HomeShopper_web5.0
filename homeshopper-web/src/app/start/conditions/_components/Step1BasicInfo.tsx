"use client";

import { StepProps } from "../_lib/reducer";

export default function Step1BasicInfo({ state, dispatch }: StepProps) {
  return (
    <div>
      <p className="text-[15px] leading-relaxed text-slate">
        조건을 남겨주시면 전담 매니저가 매물 방향을 정리해 드리고, 24시간 이내에
        연락드리겠습니다.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="consult-name" className="text-sm font-semibold text-ink">
            이름*
          </label>
          <input
            id="consult-name"
            type="text"
            value={state.name}
            onChange={(event) => dispatch({ type: "SET_NAME", value: event.target.value })}
            placeholder="이름을 입력해주세요"
            className="glass-surface mt-2 h-12 w-full rounded-2xl px-4 text-[15px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
          />
        </div>
        <div>
          <label htmlFor="consult-phone" className="text-sm font-semibold text-ink">
            연락처*
          </label>
          <input
            id="consult-phone"
            type="tel"
            value={state.phone}
            onChange={(event) => dispatch({ type: "SET_PHONE", value: event.target.value })}
            placeholder="010-0000-0000"
            className="glass-surface mt-2 h-12 w-full rounded-2xl px-4 text-[15px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
          />
        </div>
      </div>
      <p className="mt-3 text-xs text-slate">로그인 정보에 따라 자동 입력</p>
    </div>
  );
}
