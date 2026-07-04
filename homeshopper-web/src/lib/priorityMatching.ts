import { Property } from "@/lib/types";

export interface PriorityOption {
  label: string;
  /** 매물이 이 고려사항을 충족하는지 판단한다 (태그·층수 등 실제 데이터 기반) */
  matches: (property: Property) => boolean;
}

function hasTag(property: Property, ...keywords: string[]): boolean {
  return property.tags.some((tag) => keywords.some((keyword) => tag.includes(keyword)));
}

/**
 * 조건 설정 마법사(5단계)에서 사용자가 고르는 고려사항 옵션 목록.
 * 라벨은 사용자에게 보여주는 설명형 문구를, matches는 매물 태그·속성과의
 * 실제 매칭 규칙을 담당해 문구가 달라도 매칭이 끊기지 않도록 한다.
 */
export const PRIORITY_OPTIONS: PriorityOption[] = [
  {
    label: "역세권(도보 10분 이내)",
    matches: (property) => hasTag(property, "역세권"),
  },
  {
    label: "상권 및 편의시설 인접",
    matches: (property) => hasTag(property, "상권", "인접", "인프라"),
  },
  {
    label: "우수 학군 및 학원가",
    matches: (property) => hasTag(property, "대학가", "여대", "대학로", "고시촌"),
  },
  {
    label: "자연환경 인접",
    matches: (property) => hasTag(property, "남향", "채광", "조용한"),
  },
  {
    label: "신축(준공 5년 이내)",
    matches: (property) => hasTag(property, "신축"),
  },
  {
    label: "대단지 선호",
    matches: (property) => hasTag(property, "오피스텔") || property.title.includes("아파트"),
  },
  {
    label: "로열층",
    matches: (property) => property.floor >= 3 && property.floor <= 10,
  },
  {
    label: "커뮤니티 시설 유무",
    matches: (property) => hasTag(property, "보안", "CCTV", "풀옵션", "경비"),
  },
];

export function getPriorityMatcher(label: string): ((property: Property) => boolean) | undefined {
  return PRIORITY_OPTIONS.find((option) => option.label === label)?.matches;
}
