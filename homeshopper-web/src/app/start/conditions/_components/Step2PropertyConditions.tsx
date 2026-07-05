"use client";

import { TrendingUp } from "lucide-react";
import SegmentControl from "@/components/ui/SegmentControl";
import { DealType, PropertyType } from "@/lib/types";
import { StepProps } from "../_lib/reducer";
import { useMarketBand } from "../_lib/useMarketBand";
import GlassSelect from "./GlassSelect";
import DistrictMultiSelect from "./DistrictMultiSelect";

const PROPERTY_TYPES: PropertyType[] = ["원룸", "투룸이상", "오피스텔", "아파트", "빌라"];

const DEAL_TYPE_OPTIONS: { label: string; value: DealType }[] = [
  { label: "월세", value: "월세" },
  { label: "전세", value: "전세" },
  { label: "매매", value: "매매" },
];

export const SEOUL_DISTRICTS = [
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

const MAX_DISTRICTS = 3;

function formatWon(value: number): string {
  return value.toLocaleString("ko-KR");
}

export default function Step2PropertyConditions({ state, dispatch }: StepProps) {
  useMarketBand(state, dispatch);

  const band = state.marketBand;

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
          희망 지역 <span className="font-normal text-slate">(최대 {MAX_DISTRICTS}개)</span>
        </label>
        <DistrictMultiSelect
          id="district"
          className="mt-2"
          value={state.districts}
          onChange={(value) => dispatch({ type: "SET_DISTRICTS", value })}
          options={SEOUL_DISTRICTS}
          placeholder="지역 구를 선택하세요"
          max={MAX_DISTRICTS}
        />
        <p className="mt-2 text-[13px] text-slate">
          지역을 넓게 고르실수록 좋은 매물을 찾을 확률이 올라가요
        </p>

        {state.districts.length > 0 && (
          <div className="glass-surface mt-3 flex items-start gap-2.5 rounded-2xl px-4 py-3.5">
            <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
            {state.isLoadingMarketBand ? (
              <p className="text-[13px] text-slate">시세를 확인하고 있어요...</p>
            ) : band ? (
              <p className="text-[13px] leading-relaxed text-ink">
                선택하신 지역의 {state.propertyType || "매물"} {state.dealType} 시세: 보증금{" "}
                <span className="font-semibold text-brand-blue">
                  {formatWon(band.depositRange[0])}~{formatWon(band.depositRange[1])}만
                </span>
                {band.monthlyRange && (
                  <>
                    {" "}
                    / 월{" "}
                    <span className="font-semibold text-brand-blue">
                      {formatWon(band.monthlyRange[0])}~{formatWon(band.monthlyRange[1])}만
                    </span>
                  </>
                )}
                이 일반적이에요{" "}
                <span className="text-slate">(표본 {formatWon(band.sampleCount)}건 기준)</span>
              </p>
            ) : (
              <p className="text-[13px] text-slate">
                이 조합은 아직 참고 시세 데이터가 없어요. 다음 단계에서 예산을 직접 조정해주세요.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
