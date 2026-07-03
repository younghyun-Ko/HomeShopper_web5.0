import { DealStage } from "@/lib/types";

/** 안전 거래 대시보드가 다루는 4단계 순서 */
export const DASHBOARD_STAGE_ORDER: DealStage[] = [
  "계약전",
  "계약금입금",
  "소유권이전",
  "완료",
];

export function dashboardStageIndex(stage: DealStage): number {
  const index = DASHBOARD_STAGE_ORDER.indexOf(stage);
  return index === -1 ? 0 : index;
}

export function nextDashboardStage(stage: DealStage): DealStage {
  const index = dashboardStageIndex(stage);
  return DASHBOARD_STAGE_ORDER[Math.min(DASHBOARD_STAGE_ORDER.length - 1, index + 1)];
}

export function formatFullDate(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function addDays(base: Date, days: number): Date {
  const result = new Date(base);
  result.setDate(result.getDate() + days);
  return result;
}

const KOREAN_DIGITS = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
const KOREAN_SMALL_UNITS = ["", "십", "백", "천"];
const KOREAN_BIG_UNITS = ["", "만", "억", "조"];

function readKoreanChunk(chunk: number): string {
  const digits = String(chunk);
  let result = "";
  for (let i = 0; i < digits.length; i += 1) {
    const digit = Number(digits[i]);
    const unitIndex = digits.length - i - 1;
    if (digit === 0) continue;
    const digitWord = digit === 1 && unitIndex > 0 ? "" : KOREAN_DIGITS[digit];
    result += digitWord + KOREAN_SMALL_UNITS[unitIndex];
  }
  return result;
}

/** 100_000_000 -> "금 일억원" */
export function formatKoreanAmount(won: number): string {
  const amount = Math.round(won);
  if (amount === 0) return "금 영원";

  const digits = String(amount);
  const groups: string[] = [];
  let end = digits.length;
  let bigUnitIndex = 0;
  while (end > 0) {
    const start = Math.max(0, end - 4);
    const chunk = Number(digits.slice(start, end));
    if (chunk > 0) {
      groups.unshift(readKoreanChunk(chunk) + KOREAN_BIG_UNITS[bigUnitIndex]);
    }
    end = start;
    bigUnitIndex += 1;
  }
  return `금 ${groups.join("")}원`;
}
