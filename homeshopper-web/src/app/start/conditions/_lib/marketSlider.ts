import type { MergedMarketBand } from "@/lib/api";

export interface SliderBounds {
  min: number;
  max: number;
}

/** 실제 시세 밴드가 없을 때(매매, 아파트·빌라 등) 쓰는 기본 슬라이더 범위. 단위: 만원 */
const FALLBACK_DEPOSIT_BOUNDS: SliderBounds = { min: 0, max: 50_000 };
const FALLBACK_MONTHLY_BOUNDS: SliderBounds = { min: 0, max: 300 };

/** 밴드 min의 0.5배 ~ max의 1.5배로 슬라이더 범위를 넉넉하게 잡는다 */
export function depositSliderBounds(band: MergedMarketBand | null): SliderBounds {
  if (!band) return FALLBACK_DEPOSIT_BOUNDS;
  const [min, max] = band.depositRange;
  return { min: Math.round(min * 0.5), max: Math.round(max * 1.5) };
}

export function monthlySliderBounds(band: MergedMarketBand | null): SliderBounds {
  if (!band?.monthlyRange) return FALLBACK_MONTHLY_BOUNDS;
  const [min, max] = band.monthlyRange;
  return { min: Math.round(min * 0.5), max: Math.round(max * 1.5) };
}

export type PriceTier = "low" | "mid" | "high";

/** 슬라이더 전체 구간을 3등분해 시세 하위/중간/상위 프리셋 범위를 만든다 */
export function tierPreset(bounds: SliderBounds, tier: PriceTier): [number, number] {
  const third = (bounds.max - bounds.min) / 3;
  if (tier === "low") return [bounds.min, Math.round(bounds.min + third)];
  if (tier === "high") return [Math.round(bounds.max - third), bounds.max];
  return [Math.round(bounds.min + third), Math.round(bounds.max - third)];
}

export function rangesEqual(a: [number, number], b: [number, number]): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

export function isUnsetRange(range: [number, number]): boolean {
  return range[0] === 0 && range[1] === 0;
}
