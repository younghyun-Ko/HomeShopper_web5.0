import { DealType, PropertyType } from "@/lib/types";

export type MarketDistrict =
  | "관악구"
  | "동작구"
  | "서대문구"
  | "마포구"
  | "종로구"
  | "성북구"
  | "광진구"
  | "동대문구"
  | "강남구"
  | "송파구";

export type MarketPropertyType = Extract<PropertyType, "원룸" | "투룸이상" | "오피스텔">;
export type MarketDealType = Extract<DealType, "월세" | "전세">;

export interface MarketBand {
  district: MarketDistrict;
  propertyType: MarketPropertyType;
  dealType: MarketDealType;
  /** 만원 단위 */
  depositRange: [number, number];
  /** 만원 단위. 전세는 월세가 없으므로 없음 */
  monthlyRange?: [number, number];
  /** 평 단위 */
  typicalPyeong: [number, number];
  sampleCount: number;
}

const MARKET_DISTRICTS: MarketDistrict[] = [
  "관악구",
  "동작구",
  "서대문구",
  "마포구",
  "종로구",
  "성북구",
  "광진구",
  "동대문구",
  "강남구",
  "송파구",
];

interface BaseBand {
  depositRange: [number, number];
  monthlyRange?: [number, number];
  typicalPyeong: [number, number];
  sampleCount: number;
}

/** 관악구(가장 낮은 가격대) 기준 원가 밴드. 다른 구는 여기에 지역 배율을 곱해 만든다 */
const BASE_BANDS: Record<MarketPropertyType, Record<MarketDealType, BaseBand>> = {
  원룸: {
    월세: { depositRange: [500, 2000], monthlyRange: [40, 70], typicalPyeong: [5, 9], sampleCount: 150 },
    전세: { depositRange: [6000, 12000], typicalPyeong: [5, 9], sampleCount: 60 },
  },
  투룸이상: {
    월세: { depositRange: [1000, 3000], monthlyRange: [60, 100], typicalPyeong: [10, 16], sampleCount: 80 },
    전세: { depositRange: [12000, 22000], typicalPyeong: [10, 16], sampleCount: 45 },
  },
  오피스텔: {
    월세: { depositRange: [1000, 3000], monthlyRange: [55, 90], typicalPyeong: [8, 13], sampleCount: 100 },
    전세: { depositRange: [10000, 20000], typicalPyeong: [8, 13], sampleCount: 50 },
  },
};

type DistrictTier = "mid-low" | "mid" | "mid-high" | "high";

/** 지역별 시세 등급. 관악·성북·동대문(mid-low)을 기준으로 종로·마포는 소폭, 강남·송파는 크게 높다 */
const DISTRICT_TIER: Record<MarketDistrict, DistrictTier> = {
  관악구: "mid-low",
  성북구: "mid-low",
  동대문구: "mid-low",
  동작구: "mid",
  서대문구: "mid",
  광진구: "mid",
  마포구: "mid-high",
  종로구: "mid-high",
  강남구: "high",
  송파구: "high",
};

interface TierAdjustment {
  priceMultiplier: number;
  pyeongDelta: number;
  sampleMultiplier: number;
}

const TIER_ADJUSTMENTS: Record<DistrictTier, TierAdjustment> = {
  "mid-low": { priceMultiplier: 1, pyeongDelta: 0, sampleMultiplier: 1 },
  mid: { priceMultiplier: 1.08, pyeongDelta: 0, sampleMultiplier: 0.85 },
  "mid-high": { priceMultiplier: 1.18, pyeongDelta: -1, sampleMultiplier: 0.7 },
  high: { priceMultiplier: 1.45, pyeongDelta: -1, sampleMultiplier: 0.45 },
};

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function scaleRange(range: [number, number], multiplier: number, step: number): [number, number] {
  return [roundTo(range[0] * multiplier, step), roundTo(range[1] * multiplier, step)];
}

function scalePyeong(range: [number, number], delta: number): [number, number] {
  const MIN_PYEONG = 4;
  return [Math.max(MIN_PYEONG, range[0] + delta), Math.max(MIN_PYEONG, range[1] + delta)];
}

function buildBand(
  district: MarketDistrict,
  propertyType: MarketPropertyType,
  dealType: MarketDealType,
): MarketBand {
  const base = BASE_BANDS[propertyType][dealType];
  const tier = TIER_ADJUSTMENTS[DISTRICT_TIER[district]];

  return {
    district,
    propertyType,
    dealType,
    depositRange: scaleRange(base.depositRange, tier.priceMultiplier, 50),
    monthlyRange: base.monthlyRange
      ? scaleRange(base.monthlyRange, tier.priceMultiplier, 5)
      : undefined,
    typicalPyeong: scalePyeong(base.typicalPyeong, tier.pyeongDelta),
    sampleCount: Math.max(10, roundTo(base.sampleCount * tier.sampleMultiplier, 5)),
  };
}

const PROPERTY_TYPES: MarketPropertyType[] = ["원룸", "투룸이상", "오피스텔"];
const DEAL_TYPES: MarketDealType[] = ["월세", "전세"];

/** 구 × 매물 유형 × 거래 유형 전체 조합의 시세 밴드 */
export const MARKET_BANDS: MarketBand[] = MARKET_DISTRICTS.flatMap((district) =>
  PROPERTY_TYPES.flatMap((propertyType) =>
    DEAL_TYPES.map((dealType) => buildBand(district, propertyType, dealType)),
  ),
);

export function findMarketBand(
  district: string,
  propertyType: MarketPropertyType,
  dealType: MarketDealType,
): MarketBand | undefined {
  return MARKET_BANDS.find(
    (band) =>
      band.district === district && band.propertyType === propertyType && band.dealType === dealType,
  );
}

const BAND_PROPERTY_TYPES: MarketPropertyType[] = ["원룸", "투룸이상", "오피스텔"];

/** 시세 데이터가 있는 매물종류(원룸·투룸이상·오피스텔)인지 판별한다. 아파트·빌라 등은 지원하지 않아 null */
export function toMarketPropertyType(propertyType: string | undefined): MarketPropertyType | null {
  return BAND_PROPERTY_TYPES.includes(propertyType as MarketPropertyType)
    ? (propertyType as MarketPropertyType)
    : null;
}

/** 시세 데이터가 있는 거래유형(월세·전세)인지 판별한다. 매매는 지원하지 않아 null */
export function toMarketDealType(dealType: string | undefined): MarketDealType | null {
  return dealType === "월세" || dealType === "전세" ? dealType : null;
}

/** 구별 인접 지역 매핑(실제 서울 행정구역 인접 관계 기준). "인접 지역까지 넓혀보기" 제안에 쓰인다 */
export const ADJACENT_DISTRICTS: Record<MarketDistrict, string[]> = {
  관악구: ["동작구", "구로구", "금천구"],
  동작구: ["관악구", "영등포구", "용산구"],
  서대문구: ["마포구", "종로구", "은평구"],
  마포구: ["서대문구", "용산구", "영등포구"],
  종로구: ["서대문구", "성북구", "중구"],
  성북구: ["종로구", "동대문구", "강북구"],
  광진구: ["동대문구", "성동구", "강동구"],
  동대문구: ["종로구", "성북구", "광진구"],
  강남구: ["서초구", "송파구", "성동구"],
  송파구: ["강남구", "강동구", "광진구"],
};
