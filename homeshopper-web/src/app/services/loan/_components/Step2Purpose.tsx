"use client";

import SegmentControl from "@/components/ui/SegmentControl";
import { LoanFormState } from "../_lib/types";
import ChipSelect from "./ChipSelect";

const PURPOSE_OPTIONS = [
  { label: "전세자금", value: "전세자금" },
  { label: "주택담보", value: "주택담보" },
  { label: "신용", value: "신용" },
];

const RATE_TYPE_OPTIONS = [
  { label: "고정", value: "고정" },
  { label: "변동", value: "변동" },
];

const TERM_OPTIONS = [
  { label: "1년", value: "1년" },
  { label: "2년", value: "2년" },
  { label: "3년", value: "3년" },
  { label: "5년", value: "5년" },
  { label: "10년", value: "10년" },
];

export interface Step2PurposeProps {
  form: LoanFormState;
  onChange: (patch: Partial<LoanFormState>) => void;
}

export default function Step2Purpose({ form, onChange }: Step2PurposeProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-ink">대출 목적</p>
        <SegmentControl
          className="mt-2"
          fullWidth
          options={PURPOSE_OPTIONS}
          value={form.purpose}
          onChange={(purpose) => onChange({ purpose })}
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-ink">금리 유형</p>
        <SegmentControl
          className="mt-2"
          fullWidth
          options={RATE_TYPE_OPTIONS}
          value={form.rateType}
          onChange={(rateType) => onChange({ rateType })}
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-ink">대출 기간</p>
        <ChipSelect
          className="mt-2"
          options={TERM_OPTIONS}
          value={form.term}
          onChange={(term) => onChange({ term })}
        />
      </div>
    </div>
  );
}
