import { Property, PropertyType, SearchConditions } from "@/lib/types";
import { IMAGE_SETS, propertyImages } from "@/lib/mock/properties";

const DISTRICT_LANDMARKS: Record<string, string[]> = {
  강남구: ["강남역", "역삼동", "논현동"],
  서초구: ["서초역", "교대역", "방배동"],
  송파구: ["잠실역", "문정동", "가락동"],
  강동구: ["천호역", "길동", "명일동"],
  마포구: ["홍대입구역", "합정동", "망원동"],
  서대문구: ["신촌역", "이대역", "홍제동"],
  종로구: ["혜화역", "대학로", "명륜동"],
  중구: ["을지로", "충무로역", "신당동"],
  용산구: ["이태원역", "한남동", "효창동"],
  광진구: ["건대입구역", "자양동", "구의동"],
  성동구: ["성수역", "왕십리역", "옥수동"],
  동대문구: ["회기역", "청량리역", "전농동"],
  중랑구: ["상봉역", "면목동", "신내동"],
  성북구: ["성신여대입구역", "안암동", "정릉동"],
  강북구: ["미아사거리역", "수유동", "번동"],
  도봉구: ["창동역", "쌍문동", "방학동"],
  노원구: ["노원역", "중계동", "상계동"],
  은평구: ["연신내역", "불광동", "응암동"],
  양천구: ["목동역", "신정동", "오목교역"],
  강서구: ["까치산역", "화곡동", "발산역"],
  구로구: ["구로디지털단지역", "신도림역", "개봉동"],
  금천구: ["가산디지털단지역", "독산동"],
  영등포구: ["영등포역", "여의도동", "당산역"],
  동작구: ["사당역", "노량진역", "상도동"],
  관악구: ["서울대입구역", "신림역", "봉천동"],
};

const GENERIC_LANDMARKS = ["동네 중심가", "역 인근 대로변", "조용한 주택가 안쪽"];

const DESCRIPTORS = [
  "신축급",
  "리모델링을 마친",
  "채광 좋은",
  "조용한 주택가에 자리한",
  "깔끔하게 관리된",
  "풀옵션",
  "감성 인테리어의",
  "볕이 잘 드는",
];

const PROPERTY_TYPE_ROTATION: PropertyType[] = ["원룸", "투룸이상", "오피스텔", "아파트", "빌라"];

const SOURCES = ["네이버", "직방", "다방"] as const;

const PRIORITY_TAGS: Record<string, string> = {
  "역세권(도보 10분 이내)": "역세권",
  "상권 및 편의시설 인접": "상권 및 편의시설 인접",
  "우수 학군 및 학원가": "대학가 인접",
  "자연환경 인접": "조용한 주택가",
  "신축(준공 5년 이내)": "신축급",
  "커뮤니티 시설 유무": "보안 CCTV 완비",
};

const EXTRA_TAGS = ["즉시입주 가능", "반려동물 가능", "주차 가능", "풀옵션", "초역세권"];

function hashString(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function roomsFor(propertyType: PropertyType, seed: number): number {
  if (propertyType === "원룸") return 1;
  if (propertyType === "투룸이상") return 2 + (seed % 2);
  if (propertyType === "빌라") return 1 + (seed % 2);
  return 2 + (seed % 2); // 오피스텔·아파트
}

function elevatorFor(propertyType: PropertyType, seed: number): boolean {
  if (propertyType === "아파트" || propertyType === "오피스텔") return true;
  return seed % 2 === 0;
}

/** 구조 요청 문구에서 언급된 공간 키워드를 뽑아 태그·설명에 반영한다 */
function structureKeywordsFrom(requestText: string): string[] {
  const found: string[] = [];
  if (/펜트리/.test(requestText)) found.push("펜트리 있음");
  if (/옷방|드레스룸/.test(requestText)) found.push("드레스룸 넉넉");
  if (/베란다|발코니/.test(requestText)) found.push("베란다 있음");
  if (/복층/.test(requestText)) found.push("복층 구조");
  if (/주차/.test(requestText)) found.push("주차 공간 여유");
  if (/수납/.test(requestText)) found.push("수납공간 풍부");
  return found;
}

function buildOne(
  imageSet: [number, number, number],
  index: number,
  conditions: SearchConditions,
): Property {
  const runSeed = Math.floor(Math.random() * 1_000_000);
  const seed = runSeed + index * 97 + hashString(conditions.district || "seoul");

  const propertyType: PropertyType =
    conditions.propertyType || PROPERTY_TYPE_ROTATION[index % PROPERTY_TYPE_ROTATION.length];
  const landmarks = DISTRICT_LANDMARKS[conditions.district] ?? GENERIC_LANDMARKS;
  const landmark = landmarks[seed % landmarks.length];
  const walk = 2 + (seed % 13);
  const descriptor = DESCRIPTORS[Math.floor(seed / 3) % DESCRIPTORS.length];
  const isStation = landmark.endsWith("역");

  const title = `${landmark} 도보 ${walk}분 ${descriptor} ${propertyType}`;

  const currentHome = conditions.currentHome;
  const structureKeywords = currentHome?.requestText
    ? structureKeywordsFrom(currentHome.requestText)
    : [];

  let areaPyeong = Math.max(4, (conditions.areaPyeong || 10) + ((seed % 7) - 3));
  let rooms = roomsFor(propertyType, seed);
  if (currentHome?.structure) {
    // "지금 집보다 넓게" 요청을 반영해 지금 집 구조 대비 최소 기준을 넘도록 보정한다
    areaPyeong = Math.max(areaPyeong, currentHome.structure.areaPyeong + 1);
    if (structureKeywords.length > 0) {
      rooms = Math.max(rooms, currentHome.structure.roomCount);
    }
  }

  const floor = 1 + (Math.floor(seed / 5) % 12);
  const elevator = elevatorFor(propertyType, seed);
  const source = SOURCES[seed % SOURCES.length];

  const budgetMax = conditions.budgetMax > 0 ? conditions.budgetMax : 100_000_000;
  const priceFactor = 0.75 + ((seed % 40) / 100);

  const deposit =
    conditions.dealType === "매매"
      ? 0
      : Math.max(1_000_000, Math.round((budgetMax * priceFactor) / 10_000) * 10_000);
  const monthlyRent =
    conditions.dealType === "월세"
      ? Math.max(
          200_000,
          Math.round(((conditions.monthlyRentMax || 600_000) * priceFactor) / 10_000) * 10_000,
        )
      : undefined;
  const price =
    conditions.dealType === "매매"
      ? Math.max(50_000_000, Math.round((budgetMax * priceFactor) / 10_000) * 10_000)
      : undefined;

  const tags: string[] = [];
  conditions.priorities.forEach((priority, priorityIndex) => {
    const tag = PRIORITY_TAGS[priority];
    if (tag && (seed + priorityIndex) % 3 !== 0) tags.push(tag);
  });
  if (isStation && walk <= 10 && !tags.includes("역세권")) tags.push("역세권");
  if (!tags.length) tags.push(EXTRA_TAGS[seed % EXTRA_TAGS.length]);
  tags.push(EXTRA_TAGS[(seed + 1) % EXTRA_TAGS.length]);
  structureKeywords.forEach((keyword) => {
    if (!tags.includes(keyword)) tags.push(keyword);
  });

  const descriptionParts: string[] = [
    `${landmark}에서 도보 ${walk}분 거리의 ${descriptor} ${propertyType}예요.`,
  ];
  if (conditions.priorities.length > 0) {
    descriptionParts.push(
      `${conditions.priorities.slice(0, 2).join(", ")} 등 남겨주신 우선순위를 고려해 골라드렸어요.`,
    );
  }
  if (conditions.customRequest?.trim()) {
    descriptionParts.push(`"${conditions.customRequest.trim()}" 요청도 함께 반영했어요.`);
  }
  if (currentHome?.requestText?.trim()) {
    descriptionParts.push(
      structureKeywords.length > 0
        ? `지금 사시는 집(${currentHome.address}) 대비 ${structureKeywords
            .map((k) => k.replace(/\s*(있음|넉넉|여유|풍부|구조)$/, ""))
            .join("·")}을 갖춘 구조예요.`
        : `지금 사시는 집(${currentHome.address}) 구조보다 넉넉한 공간을 우선으로 골라드렸어요.`,
    );
  }

  const id = `p${index + 1}`;
  const [houseA, houseB, bathroom] = imageSet;

  return {
    id,
    title,
    address: `서울 ${conditions.district || "관악구"} ${landmark.replace(/역$/, "")} 인근`,
    district: conditions.district || "관악구",
    dealType: conditions.dealType,
    deposit,
    monthlyRent,
    price,
    areaPyeong,
    rooms,
    floor,
    tags,
    badges: seed % 2 === 0 ? ["상담가능", "서류인증완료"] : ["상담가능"],
    thumbnail: `/images/house/house-${String(houseA).padStart(2, "0")}.png`,
    images: propertyImages(houseA, houseB, bathroom),
    source,
    elevator,
    description: descriptionParts.join(" "),
  };
}

/**
 * 8개의 고정 이미지 세트를 그대로 재사용하되, 제목·설명·가격·태그는 검색 조건(지역·거래유형·
 * 예산·평수·우선순위·직접 입력한 요청사항·지금 집 구조)에 맞춰 매번 새로 생성한다.
 */
export function buildRecommendedProperties(conditions: SearchConditions): Property[] {
  return IMAGE_SETS.map((imageSet, index) => buildOne(imageSet, index, conditions));
}
