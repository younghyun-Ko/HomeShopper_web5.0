"use client";

import SegmentControl from "@/components/ui/SegmentControl";
import { DealType, PropertyType } from "@/lib/types";
import { StepProps } from "../_lib/reducer";
import GlassSelect from "./GlassSelect";

const PROPERTY_TYPES: PropertyType[] = ["원룸", "투룸이상", "오피스텔", "아파트", "빌라"];

const DEAL_TYPE_OPTIONS: { label: string; value: DealType }[] = [
  { label: "월세", value: "월세" },
  { label: "전세", value: "전세" },
  { label: "매매", value: "매매" },
];

const SEOUL_DISTRICTS = [
  "강남구",
  "강동구",
  "강북구",
  "강서구",
  "관악구",
  "광진구",
  "구로구",
  "금천구",
  "노원구",
  "도봉구",
  "동대문구",
  "동작구",
  "마포구",
  "서대문구",
  "서초구",
  "성동구",
  "성북구",
  "송파구",
  "양천구",
  "영등포구",
  "용산구",
  "은평구",
  "종로구",
  "중구",
  "중랑구",
];

export default function Step2PropertyConditions({ state, dispatch }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="property-type" className="text-sm font-semibold text-ink">
            희망 매물종류
          </label>
          <GlassSelect
            id="property-type"
            className="mt-2"
            value={state.propertyType}
            onChange={(value) =>
              dispatch({ type: "SET_PROPERTY_TYPE", value: value as PropertyType })
            }
            options={PROPERTY_TYPES}
            placeholder="매물종류를 선택하세요"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">거래 유형</p>
          <SegmentControl
            className="mt-2"
            fullWidth
            options={DEAL_TYPE_OPTIONS}
            value={state.dealType}
            onChange={(value) => dispatch({ type: "SET_DEAL_TYPE", value })}
          />
        </div>
      </div>

      <div>
        <label htmlFor="district" className="text-sm font-semibold text-ink">
          희망 지역
        </label>
        <GlassSelect
          id="district"
          className="mt-2"
          value={state.district}
          onChange={(value) => dispatch({ type: "SET_DISTRICT", value })}
          options={SEOUL_DISTRICTS}
          placeholder="지역 구를 선택하세요"
        />
      </div>
    </div>
  );
}
