"use client";

import { LoanFormState } from "../_lib/types";
import ChipSelect from "./ChipSelect";

const INCOME_OPTIONS = [
  { label: "3천만원 미만", value: "3천미만" },
  { label: "3천~5천만원", value: "3천-5천" },
  { label: "5천~7천만원", value: "5천-7천" },
  { label: "7천만원 이상", value: "7천이상" },
];

const EMPLOYMENT_OPTIONS = [
  { label: "정규직", value: "정규직" },
  { label: "계약직", value: "계약직" },
  { label: "자영업", value: "자영업" },
  { label: "프리랜서", value: "프리랜서" },
  { label: "무직", value: "무직" },
];

const CREDIT_OPTIONS = [
  { label: "1~2등급", value: "1-2등급" },
  { label: "3~4등급", value: "3-4등급" },
  { label: "5~6등급", value: "5-6등급" },
  { label: "7등급 이하", value: "7등급이하" },
];

const HAS_HOUSE_OPTIONS = [
  { label: "없음", value: "없음" },
  { label: "1주택", value: "1주택" },
  { label: "2주택 이상", value: "2주택이상" },
];

export interface Step3ProfileProps {
  form: LoanFormState;
  onChange: (patch: Partial<LoanFormState>) => void;
}

export default function Step3Profile({ form, onChange }: Step3ProfileProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-ink">소득 구간</p>
        <ChipSelect
          className="mt-2"
          options={INCOME_OPTIONS}
          value={form.incomeRange}
          onChange={(incomeRange) => onChange({ incomeRange })}
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-ink">재직 형태</p>
        <ChipSelect
          className="mt-2"
          options={EMPLOYMENT_OPTIONS}
          value={form.employmentType}
          onChange={(employmentType) => onChange({ employmentType })}
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-ink">신용 구간</p>
        <ChipSelect
          className="mt-2"
          options={CREDIT_OPTIONS}
          value={form.creditRange}
          onChange={(creditRange) => onChange({ creditRange })}
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-ink">보유 주택 여부</p>
        <ChipSelect
          className="mt-2"
          options={HAS_HOUSE_OPTIONS}
          value={form.hasHouse}
          onChange={(hasHouse) => onChange({ hasHouse })}
        />
      </div>

      <p className="text-[12px] text-slate">민감정보는 저장되지 않아요</p>
    </div>
  );
}
