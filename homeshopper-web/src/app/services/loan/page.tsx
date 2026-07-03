"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";
import PageSection from "@/components/layout/PageSection";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import StepHeader from "@/components/ui/StepHeader";
import { getLoanProducts } from "@/lib/api";
import { LoanProduct } from "@/lib/types";
import LoanResults from "./_components/LoanResults";
import Step1Amount from "./_components/Step1Amount";
import Step2Purpose from "./_components/Step2Purpose";
import Step3Profile from "./_components/Step3Profile";
import { INITIAL_LOAN_FORM, LoanFormState } from "./_lib/types";

type Step = 1 | 2 | 3 | 4;

const STEP_TITLES = ["희망 대출 금액", "대출 목적·조건", "사용자 정보"];
const TOTAL_STEPS = 3;

function isStepValid(step: Step, form: LoanFormState): boolean {
  if (step === 1) return Number(form.amount || 0) > 0;
  if (step === 2) return Boolean(form.purpose && form.rateType && form.term);
  if (step === 3) {
    return Boolean(
      form.incomeRange && form.employmentType && form.creditRange && form.hasHouse,
    );
  }
  return true;
}

export default function LoanPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<LoanFormState>(INITIAL_LOAN_FORM);
  const [loans, setLoans] = useState<LoanProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const updateForm = (patch: Partial<LoanFormState>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const handleBack = () => setStep((prev) => Math.max(1, prev - 1) as Step);

  const handleNext = async () => {
    if (!isStepValid(step, form)) return;
    if (step === 3) {
      setLoading(true);
      const result = await getLoanProducts({
        loanMethod: form.purpose,
        budgetMax: Number(form.amount || 0) * 10_000,
      });
      setLoading(false);
      setLoans(result);
      setStep(4);
      return;
    }
    setStep((prev) => (prev + 1) as Step);
  };

  const handleRestart = () => {
    setForm(INITIAL_LOAN_FORM);
    setStep(1);
  };

  return (
    <main>
      <PageSection>
        <Container size={step === 4 ? "wide" : "form"}>
          {step < 4 ? (
            <GlassCard padding={40}>
              <StepHeader
                current={step}
                total={TOTAL_STEPS}
                title={STEP_TITLES[step - 1]}
                onBack={step > 1 ? handleBack : undefined}
              />
              <div className="mt-8">
                {step === 1 && (
                  <Step1Amount value={form.amount} onChange={(amount) => updateForm({ amount })} />
                )}
                {step === 2 && <Step2Purpose form={form} onChange={updateForm} />}
                {step === 3 && <Step3Profile form={form} onChange={updateForm} />}
              </div>
              <div className="mt-10 flex items-center justify-between gap-3">
                <GradientButton
                  type="button"
                  variant="secondary"
                  onClick={handleBack}
                  disabled={step === 1}
                >
                  이전
                </GradientButton>
                <GradientButton
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepValid(step, form)}
                  loading={loading}
                >
                  {step === 3 ? "대출 상품 찾기" : "다음"}
                </GradientButton>
              </div>
            </GlassCard>
          ) : (
            <LoanResults loans={loans} onRestart={handleRestart} />
          )}
        </Container>
      </PageSection>
    </main>
  );
}
