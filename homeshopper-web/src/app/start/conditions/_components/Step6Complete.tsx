"use client";

import { useState } from "react";
import AgentAssignedCard, {
  ConsultMethod,
} from "@/components/domain/AgentAssignedCard";
import GlassCard from "@/components/ui/GlassCard";
import { ConditionsWizardState } from "../_lib/reducer";

export interface Step6CompleteProps {
  state: ConditionsWizardState;
  onFinish: (method: ConsultMethod) => void;
}

const LOADING_DURATION_MS = 1200;

export default function Step6Complete({ state, onFinish }: Step6CompleteProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleComplete = (method: ConsultMethod) => {
    setSubmitting(true);
    window.setTimeout(() => {
      onFinish(method);
    }, LOADING_DURATION_MS);
  };

  if (submitting) {
    return (
      <GlassCard
        padding={48}
        className="mx-auto flex w-full flex-col items-center justify-center gap-4 py-16 text-center"
      >
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-transparent [border-right-color:var(--purple)] [border-top-color:var(--blue)]" />
        <p className="text-[15px] font-semibold text-ink">추천 매물 찾는 중...</p>
      </GlassCard>
    );
  }

  return (
    <AgentAssignedCard
      role="전담 매니저"
      message={`${state.name || "회원"}님 전담 담당자가 배정되었습니다. 담당자가 조건에 맞는 매물을 찾아 24시간 내로 연락드리겠습니다.`}
      completeLabel="추천 매물 보러가기"
      onComplete={handleComplete}
    />
  );
}
