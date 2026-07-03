import { Property, PropertyMatch } from "@/lib/types";

type ClassValue = string | number | boolean | null | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}

export function formatManwon(amount: number): string {
  return `${Math.round(amount / 10_000).toLocaleString("ko-KR")}만`;
}

export function formatPropertyPrice(property: Property): string {
  if (property.dealType === "매매" && property.price !== undefined) {
    return formatManwon(property.price);
  }
  if (property.dealType === "월세" && property.monthlyRent !== undefined) {
    return `보증금 ${formatManwon(property.deposit)} / 월 ${formatManwon(property.monthlyRent)}`;
  }
  return `보증금 ${formatManwon(property.deposit)}`;
}

/** 입력값에서 숫자만 남긴다 (콤마 등 서식 문자 제거) */
export function digitsOnly(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

/** 숫자 문자열에 천단위 콤마를 붙인다 */
export function formatThousands(digits: string): string {
  if (!digits) return "";
  return Number(digits).toLocaleString("ko-KR");
}

/** Fisher-Yates 셔플. 원본 배열은 변경하지 않는다 */
export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** 매물 태그와 사용자 고려사항(priorities)을 비교해 충족 여부를 계산한다 */
export function computePropertyMatch(
  property: Property,
  priorities: string[],
): PropertyMatch | undefined {
  if (priorities.length === 0) return property.matched;

  const satisfied = priorities.filter((priority) =>
    property.tags.some((tag) => tag.includes(priority) || priority.includes(tag)),
  );
  const unsatisfied = priorities.filter((priority) => !satisfied.includes(priority));

  return { total: priorities.length, satisfied, unsatisfied };
}
