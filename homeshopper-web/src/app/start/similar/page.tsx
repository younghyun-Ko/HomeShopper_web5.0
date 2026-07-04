"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import Container from "@/components/layout/Container";
import PageSection from "@/components/layout/PageSection";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import PropertyCard from "@/components/ui/PropertyCard";
import SegmentControl from "@/components/ui/SegmentControl";
import StepHeader from "@/components/ui/StepHeader";
import { getSimilarUserExamples } from "@/lib/api";
import {
  SimilarAgeBand,
  SimilarCommute,
  SimilarGender,
  SimilarLivingWith,
  SimilarUserExample,
} from "@/lib/mock/similarUsers";
import { DealType } from "@/lib/types";
import { cn, formatPropertyPrice } from "@/lib/utils";
import { SEOUL_DISTRICTS } from "../conditions/_components/Step2PropertyConditions";
import GlassSelect from "../conditions/_components/GlassSelect";

const GENDER_OPTIONS: SimilarGender[] = ["여성", "남성", "선택 안 함"];
const AGE_OPTIONS: SimilarAgeBand[] = ["20대 초반", "20대 후반", "30대 초반", "30대 후반", "40대 이상"];
const DEAL_TYPE_OPTIONS: { label: string; value: DealType }[] = [
  { label: "월세", value: "월세" },
  { label: "전세", value: "전세" },
  { label: "매매", value: "매매" },
];
const LIVING_OPTIONS: SimilarLivingWith[] = ["1인 거주", "커플·부부", "룸메이트 동거", "가족과 거주"];
const COMMUTE_OPTIONS: SimilarCommute[] = [
  "30분 이내",
  "1시간 이내",
  "1시간~1시간 30분",
  "1시간 30분 이상",
];

const TOTAL_STEPS = 3;
const LOADING_MIN_MS = 900;

function delayMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface OptionButtonsProps<T extends string> {
  options: T[];
  value: T | null;
  onChange: (value: T) => void;
  columns?: string;
}

function OptionButtons<T extends string>({
  options,
  value,
  onChange,
  columns = "grid-cols-2 sm:grid-cols-3",
}: OptionButtonsProps<T>) {
  return (
    <div className={cn("grid gap-2", columns)}>
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={selected}
            className={cn(
              "h-11 rounded-2xl px-3 text-[13px] font-semibold transition-all duration-200",
              selected
                ? "bg-grad-primary text-white shadow-[0_8px_20px_rgba(0,131,255,0.25)]"
                : "glass-surface text-ink hover:bg-white/70",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

interface TwoWayToggleProps {
  label: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
}

function TwoWayToggle({ label, value, onChange }: TwoWayToggleProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink">{label}</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {[
          { label: "있음", value: true },
          { label: "없음", value: false },
        ].map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
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
  );
}

interface SimilarForm {
  gender: SimilarGender | null;
  ageBand: SimilarAgeBand | null;
  district: string;
  dealType: DealType;
  commute: SimilarCommute | null;
  livingWith: SimilarLivingWith | null;
  hasPet: boolean | null;
  hasCar: boolean | null;
}

const INITIAL_FORM: SimilarForm = {
  gender: null,
  ageBand: null,
  district: "",
  dealType: "월세",
  commute: null,
  livingWith: null,
  hasPet: null,
  hasCar: null,
};

function isStepValid(step: number, form: SimilarForm): boolean {
  switch (step) {
    case 1:
      return form.gender !== null && form.ageBand !== null;
    case 2:
      return form.district !== "" && form.commute !== null;
    case 3:
      return form.livingWith !== null && form.hasPet !== null && form.hasCar !== null;
    default:
      return true;
  }
}

export default function SimilarUsersPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<SimilarForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [examples, setExamples] = useState<SimilarUserExample[] | null>(null);

  const buildInput = () => ({
    gender: form.gender!,
    ageBand: form.ageBand!,
    district: form.district,
    dealType: form.dealType,
    livingWith: form.livingWith!,
    hasPet: form.hasPet!,
    hasCar: form.hasCar!,
    commute: form.commute!,
  });

  const handleNext = () => {
    if (!isStepValid(step, form)) return;
    setStep((prev) => Math.min(TOTAL_STEPS, prev + 1));
  };

  const handleBack = () => {
    if (step === 1) {
      router.push("/");
      return;
    }
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!isStepValid(3, form)) return;
    setStep(4);
    setLoading(true);
    const [result] = await Promise.all([
      getSimilarUserExamples(buildInput()),
      delayMs(LOADING_MIN_MS),
    ]);
    setExamples(result);
    setLoading(false);
  };

  const handleFindMore = async () => {
    if (!examples) return;
    setRefreshing(true);
    const excludeIds = examples.map((example) => example.property.id);
    const result = await getSimilarUserExamples(buildInput(), excludeIds);
    setExamples(result);
    setRefreshing(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-7">
            <div>
              <p className="text-sm font-semibold text-ink">성별</p>
              <OptionButtons
                options={GENDER_OPTIONS}
                value={form.gender}
                onChange={(gender) => setForm((prev) => ({ ...prev, gender }))}
                columns="grid-cols-3"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">연령대</p>
              <OptionButtons
                options={AGE_OPTIONS}
                value={form.ageBand}
                onChange={(ageBand) => setForm((prev) => ({ ...prev, ageBand }))}
                columns="grid-cols-2 sm:grid-cols-5"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-7">
            <div>
              <label htmlFor="similar-district" className="text-sm font-semibold text-ink">
                찾는 부동산 위치
              </label>
              <GlassSelect
                id="similar-district"
                className="mt-2"
                value={form.district}
                onChange={(district) => setForm((prev) => ({ ...prev, district }))}
                options={SEOUL_DISTRICTS}
                placeholder="지역 구를 선택하세요"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">선호 거래 형태</p>
              <SegmentControl
                className="mt-2"
                fullWidth
                options={DEAL_TYPE_OPTIONS}
                value={form.dealType}
                onChange={(dealType) => setForm((prev) => ({ ...prev, dealType }))}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">희망 통근·통학 시간</p>
              <OptionButtons
                options={COMMUTE_OPTIONS}
                value={form.commute}
                onChange={(commute) => setForm((prev) => ({ ...prev, commute }))}
              />
            </div>
          </div>
        );
      case 3:
      default:
        return (
          <div className="space-y-7">
            <div>
              <p className="text-sm font-semibold text-ink">동거 형태</p>
              <OptionButtons
                options={LIVING_OPTIONS}
                value={form.livingWith}
                onChange={(livingWith) => setForm((prev) => ({ ...prev, livingWith }))}
              />
            </div>
            <TwoWayToggle
              label="반려동물 유무"
              value={form.hasPet}
              onChange={(hasPet) => setForm((prev) => ({ ...prev, hasPet }))}
            />
            <TwoWayToggle
              label="차량 보유 여부"
              value={form.hasCar}
              onChange={(hasCar) => setForm((prev) => ({ ...prev, hasCar }))}
            />
          </div>
        );
    }
  };

  if (step === 4) {
    return (
      <main>
        <PageSection>
          <Container size={loading ? "form" : "wide"}>
            {loading ? (
              <GlassCard
                padding={48}
                className="mx-auto flex w-full flex-col items-center justify-center gap-4 py-16 text-center"
              >
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-transparent [border-right-color:var(--purple)] [border-top-color:var(--blue)]" />
                <p className="text-[15px] font-semibold text-ink">비슷한 소비자 찾는 중...</p>
              </GlassCard>
            ) : (
              <>
                <h1 className="text-[28px] font-bold text-ink md:text-[32px]">
                  나와 비슷한 사람들이 최근 거래한 매물 {examples?.length ?? 0}건
                </h1>
                <p className="mt-2 text-[14px] text-slate">
                  매물을 클릭하면 상세 정보를 볼 수 있어요
                </p>
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {examples?.map((example, index) => (
                    <Link
                      key={example.property.id}
                      href={`/properties/${example.property.id}`}
                      className="block h-full animate-fade-up"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      <PropertyCard
                        layout="grid"
                        imageUrl={example.property.thumbnail}
                        title={example.property.title}
                        dealType={example.property.dealType}
                        address={example.property.address}
                        price={formatPropertyPrice(example.property)}
                        area={`${example.property.areaPyeong}평`}
                        hasElevator={example.property.elevator}
                        tags={example.property.tags.slice(0, 3)}
                        consultAvailable={example.property.badges.includes("상담가능")}
                        verified={example.property.badges.includes("서류인증완료")}
                        className="h-full"
                        footer={
                          <div className="space-y-2 border-t border-black/5 pt-4">
                            <span className="inline-flex items-center rounded-full bg-brand-blue/10 px-2.5 py-1 text-[12px] font-semibold text-brand-blue">
                              {example.segmentLabel}
                            </span>
                            <p className="min-h-[168px] text-[13px] leading-relaxed text-slate">
                              {example.behaviorAnalysis}
                            </p>
                          </div>
                        }
                      />
                    </Link>
                  ))}
                </div>

                <div className="mt-12 flex justify-center">
                  <GradientButton
                    type="button"
                    variant="secondary"
                    onClick={handleFindMore}
                    loading={refreshing}
                    disabled={refreshing}
                  >
                    <RefreshCw className="h-4 w-4" />
                    다른 매물 찾아보기
                  </GradientButton>
                </div>
              </>
            )}
          </Container>
        </PageSection>
      </main>
    );
  }

  return (
    <main>
      <PageSection>
        <Container size="form">
          <GlassCard padding={40}>
            <StepHeader
              current={step}
              total={TOTAL_STEPS}
              title="나와 비슷한 유저의 관심 매물 찾기"
              onBack={handleBack}
            />
            <div className="mt-8">{renderStep()}</div>
            <div className="mt-10 flex items-center justify-between gap-3">
              <GradientButton type="button" variant="secondary" onClick={handleBack}>
                이전
              </GradientButton>
              {step < TOTAL_STEPS ? (
                <GradientButton
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepValid(step, form)}
                >
                  다음
                </GradientButton>
              ) : (
                <GradientButton
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isStepValid(step, form)}
                >
                  비슷한 소비자들의 매물 보기
                </GradientButton>
              )}
            </div>
          </GlassCard>
        </Container>
      </PageSection>
    </main>
  );
}
