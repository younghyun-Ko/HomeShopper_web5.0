import { getMarketBand, MergedMarketBand } from "@/lib/api";
import { ADJACENT_DISTRICTS, MarketDistrict, toMarketDealType, toMarketPropertyType } from "@/lib/mock/marketPrice";
import { SearchConditions } from "@/lib/types";

export type BudgetComparison = "below" | "within" | "above";

interface DepositBand {
  depositRange: [number, number];
}

/** 예산(보증금/매입금, 만원 단위)이 시세 밴드 대비 낮은지·적정한지·높은지 판정한다 */
export function compareBudgetToBand(budget: number, band: DepositBand): BudgetComparison {
  const [min, max] = band.depositRange;
  if (budget < min) return "below";
  if (budget > max) return "above";
  return "within";
}

// ---------- 조건 괴리 판정 ----------

export type Feasibility = "ok" | "tight" | "unrealistic";
export type Bottleneck = "예산" | "지역" | "크기" | null;
export type SuggestionKind = "budget" | "districts" | "area";

export interface Suggestion {
  kind: SuggestionKind;
  label: string;
  description: string;
  /** conditions에 적용할 부분 변경 */
  patch: Partial<SearchConditions>;
}

export interface ConditionEvaluation {
  feasibility: Feasibility;
  bottleneck: Bottleneck;
  suggestions: Suggestion[];
  /** 판정 근거로 쓰인 병합 시세 밴드. 데이터가 없는 조합(매매·아파트·빌라 등)이면 없음 */
  band?: MergedMarketBand;
}

/** 예산이 밴드 하위 20% 구간 안에 들면 "빠듯함"으로 본다 */
const TIGHT_LOWER_FRACTION = 0.2;
/** 표본 수가 이 아래면 지역을 넓혀볼 만큼 매물이 적다고 본다 */
const LOW_SAMPLE_THRESHOLD = 40;

function formatManwonRange([min, max]: [number, number]): string {
  return `${min.toLocaleString("ko-KR")}~${max.toLocaleString("ko-KR")}만`;
}

function buildSuggestions(
  conditions: SearchConditions,
  band: MergedMarketBand,
  bottleneck: Bottleneck,
): Suggestion[] {
  const suggestions: Suggestion[] = [];

  if (bottleneck === "예산" || bottleneck === null) {
    const span = band.depositRange[1] - band.depositRange[0];
    const lowMid: [number, number] = [
      band.depositRange[0],
      Math.round(band.depositRange[0] + span * 0.5),
    ];
    suggestions.push({
      kind: "budget",
      label: "예산을 시세 구간으로 조정하기",
      description: `보증금 ${formatManwonRange(lowMid)}으로 예산을 넓혀요`,
      patch: { budgetMin: lowMid[0] * 10_000, budgetMax: lowMid[1] * 10_000 },
    });
  }

  const firstDistrict = conditions.districts[0] as MarketDistrict | undefined;
  const adjacentOptions = firstDistrict ? ADJACENT_DISTRICTS[firstDistrict] : undefined;
  const addition = adjacentOptions?.find((district) => !conditions.districts.includes(district));
  if (addition && conditions.districts.length < 3) {
    suggestions.push({
      kind: "districts",
      label: "인접 지역까지 넓혀보기",
      description: `${addition}까지 넓히면 매물이 더 많아져요`,
      patch: { districts: [...conditions.districts, addition] },
    });
  }

  if (conditions.areaPyeongRange) {
    const [min, max] = conditions.areaPyeongRange;
    const width = Math.max(1, max - min);
    const loweredMax = Math.max(4, min - 1);
    const loweredMin = Math.max(4, loweredMax - width);
    if (loweredMax < max) {
      suggestions.push({
        kind: "area",
        label: "크기를 한 단계 줄여보기",
        description: `${loweredMin}~${loweredMax}평대로 좁히면 선택지가 늘어나요`,
        patch: { areaPyeongRange: [loweredMin, loweredMax] },
      });
    }
  }

  return suggestions.slice(0, 3);
}

/**
 * 예산·지역·평수 조건이 실제 시세 대비 현실적인지 판정한다.
 * getMarketBand(시세 조회)와 compareBudgetToBand(예산 비교)를 조합한 mock 판정이다.
 */
export async function evaluateConditions(conditions: SearchConditions): Promise<ConditionEvaluation> {
  const bandPropertyType = toMarketPropertyType(conditions.propertyType);
  const bandDealType = toMarketDealType(conditions.dealType);

  if (conditions.districts.length === 0 || !bandPropertyType || !bandDealType) {
    return { feasibility: "ok", bottleneck: null, suggestions: [] };
  }

  const band = await getMarketBand(conditions.districts, bandPropertyType, bandDealType);
  if (!band) {
    return { feasibility: "ok", bottleneck: null, suggestions: [] };
  }

  const budgetMaxManwon = Math.round(conditions.budgetMax / 10_000);
  const comparison = compareBudgetToBand(budgetMaxManwon, band);
  const span = band.depositRange[1] - band.depositRange[0];
  const tightBoundaryManwon = band.depositRange[0] + span * TIGHT_LOWER_FRACTION;

  const sizeExceeds =
    Boolean(conditions.areaPyeongRange) && conditions.areaPyeongRange![0] > band.typicalPyeong[1];

  let feasibility: Feasibility = "ok";
  let bottleneck: Bottleneck = null;

  if (comparison === "below") {
    feasibility = "unrealistic";
    bottleneck = "예산";
  } else if (sizeExceeds) {
    feasibility = "unrealistic";
    bottleneck = "크기";
  } else if (comparison === "within" && budgetMaxManwon <= tightBoundaryManwon) {
    feasibility = "tight";
    bottleneck = "예산";
  } else if (band.sampleCount < LOW_SAMPLE_THRESHOLD) {
    feasibility = "tight";
    bottleneck = "지역";
  }

  const suggestions = feasibility === "ok" ? [] : buildSuggestions(conditions, band, bottleneck);

  return { feasibility, bottleneck, suggestions, band };
}
