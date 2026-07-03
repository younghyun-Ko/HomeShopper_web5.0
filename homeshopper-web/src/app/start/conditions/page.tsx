"use client";

import { useReducer } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import PageSection from "@/components/layout/PageSection";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import StepHeader from "@/components/ui/StepHeader";
import type { ConsultMethod } from "@/components/domain/AgentAssignedCard";
import { useApp } from "@/context/AppContext";
import { submitConsult } from "@/lib/api";
import { SearchConditions } from "@/lib/types";
import {
  ConditionsWizardState,
  createInitialState,
  reducer,
} from "./_lib/reducer";
import Step1BasicInfo from "./_components/Step1BasicInfo";
import Step2PropertyConditions from "./_components/Step2PropertyConditions";
import Step3Budget from "./_components/Step3Budget";
import Step4SizeAndMoveIn from "./_components/Step4SizeAndMoveIn";
import Step5Priorities from "./_components/Step5Priorities";
import Step6Complete from "./_components/Step6Complete";

const STEP_TITLES = ["상담 신청", "매물 조건", "예산", "크기·입주 시기", "우선 고려사항", "완료"];
const TOTAL_STEPS = 6;

function isStepValid(step: number, state: ConditionsWizardState): boolean {
  switch (step) {
    case 1:
      return state.name.trim() !== "" && state.phone.trim() !== "";
    case 2:
      return state.propertyType !== "" && state.district !== "";
    case 3:
      return (
        state.budget.trim() !== "" &&
        (state.dealType !== "월세" || state.monthlyRent.trim() !== "") &&
        (!state.loanPlanned || state.loanMethod.trim() !== "")
      );
    case 4:
      return state.areaPyeong.trim() !== "" && state.moveInAfter.trim() !== "";
    case 5:
      return state.priorities.length > 0;
    default:
      return true;
  }
}

export default function ConditionsWizardPage() {
  const router = useRouter();
  const { state: appState, setConditions } = useApp();
  const [state, dispatch] = useReducer(reducer, appState.user, createInitialState);

  const handleNext = () => {
    if (!isStepValid(state.step, state)) return;
    dispatch({ type: "GOTO_STEP", value: Math.min(TOTAL_STEPS, state.step + 1) });
  };

  const handleBack = () => {
    dispatch({ type: "GOTO_STEP", value: Math.max(1, state.step - 1) });
  };

  const handleFinish = async (method: ConsultMethod) => {
    const conditions: SearchConditions = {
      dealType: state.dealType,
      propertyType: state.propertyType || undefined,
      budgetMin: 0,
      budgetMax: Number(state.budget || 0) * 10_000,
      monthlyRentMax:
        state.dealType === "월세" ? Number(state.monthlyRent || 0) * 10_000 : undefined,
      loanPlanned: state.loanPlanned,
      loanMethod: state.loanPlanned ? state.loanMethod : undefined,
      district: state.district,
      areaPyeong: Number(state.areaPyeong || 0),
      moveInAfter: state.moveInAfter,
      priorities: state.priorities,
    };
    setConditions(conditions);
    await submitConsult({
      name: state.name,
      phone: state.phone,
      message: `선호 상담 방식: ${method}`,
    });
    router.push("/results");
  };

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return <Step1BasicInfo state={state} dispatch={dispatch} />;
      case 2:
        return <Step2PropertyConditions state={state} dispatch={dispatch} />;
      case 3:
        return <Step3Budget state={state} dispatch={dispatch} />;
      case 4:
        return <Step4SizeAndMoveIn state={state} dispatch={dispatch} />;
      case 5:
        return <Step5Priorities state={state} dispatch={dispatch} />;
      case 6:
      default:
        return <Step6Complete state={state} onFinish={handleFinish} />;
    }
  };

  return (
    <main>
      <PageSection>
        <Container size="form">
          <GlassCard padding={40}>
            <StepHeader
              current={state.step}
              total={TOTAL_STEPS}
              title={STEP_TITLES[state.step - 1]}
              onBack={state.step > 1 ? handleBack : undefined}
            />
            <div className="mt-8">{renderStep()}</div>
            {state.step < TOTAL_STEPS && (
              <div className="mt-10 flex items-center justify-between gap-3">
                <GradientButton
                  type="button"
                  variant="secondary"
                  onClick={handleBack}
                  disabled={state.step === 1}
                >
                  이전
                </GradientButton>
                <GradientButton
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepValid(state.step, state)}
                >
                  다음
                </GradientButton>
              </div>
            )}
          </GlassCard>
        </Container>
      </PageSection>
    </main>
  );
}
