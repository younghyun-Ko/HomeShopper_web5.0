import { DealType, Property } from "@/lib/types";
import { propertyImages } from "@/lib/mock/properties";

export type SimilarGender = "여성" | "남성" | "선택 안 함";
export type SimilarAgeBand = "20대 초반" | "20대 후반" | "30대 초반" | "30대 후반" | "40대 이상";
export type SimilarLivingWith = "1인 거주" | "커플·부부" | "룸메이트 동거" | "가족과 거주";
export type SimilarCommute = "30분 이내" | "1시간 이내" | "1시간~1시간 30분" | "1시간 30분 이상";

export interface SimilarUserInput {
  gender: SimilarGender;
  ageBand: SimilarAgeBand;
  district: string;
  dealType: DealType;
  livingWith: SimilarLivingWith;
  hasPet: boolean;
  hasCar: boolean;
  commute: SimilarCommute;
}

export interface SimilarUserExample {
  segmentLabel: string;
  property: Property;
  behaviorAnalysis: string;
}

interface Persona extends SimilarUserExample {
  match: Partial<{
    gender: SimilarGender;
    ageBands: SimilarAgeBand[];
    livingWith: SimilarLivingWith;
    hasPet: boolean;
    hasCar: boolean;
    commute: SimilarCommute[];
    dealType: DealType;
  }>;
}

const PERSONAS: Persona[] = [
  {
    segmentLabel: "자취 시작하는 사회초년생 여성 1인가구",
    match: { gender: "여성", ageBands: ["20대 초반", "20대 후반"], livingWith: "1인 거주", commute: ["30분 이내", "1시간 이내"], dealType: "월세" },
    property: {
      id: "similar-01",
      title: "서울대입구역 도보 4분 보안특화 원룸",
      address: "서울 관악구 봉천동 산101-2",
      district: "관악구",
      dealType: "월세",
      deposit: 8_000_000,
      monthlyRent: 550_000,
      areaPyeong: 6,
      rooms: 1,
      floor: 3,
      tags: ["역세권", "보안 CCTV", "여성 안심 매물", "즉시입주 가능"],
      badges: ["상담가능", "서류인증완료"],
      thumbnail: "/images/house/house-01.png",
      images: propertyImages(1, 2, 1),
      source: "네이버",
      elevator: true,
      description: "첫 독립을 시작하는 사회초년생을 위한 보안 특화 원룸이에요.",
    },
    behaviorAnalysis:
      "최근 3개월간 20대 여성 1인가구는 보증금 1,000만원 이하 · 월세 60만원 이하의 역세권 원룸을 가장 많이 계약했어요. 경비 상주·CCTV 등 보안 옵션이 있는 매물의 계약 전환율이 그렇지 않은 매물보다 뚜렷하게 높았고, 첫 계약이라 임장 동행과 서류 검증 서비스 이용률도 평균보다 높은 편이었어요.",
  },
  {
    segmentLabel: "결혼 준비 중인 20대 후반~30대 초반 커플",
    match: { ageBands: ["20대 후반", "30대 초반"], livingWith: "커플·부부", dealType: "전세", commute: ["1시간 이내"] },
    property: {
      id: "similar-02",
      title: "합정역 도보 8분 신축급 투룸 오피스텔",
      address: "서울 마포구 합정동 366-8",
      district: "마포구",
      dealType: "전세",
      deposit: 320_000_000,
      areaPyeong: 14,
      rooms: 2,
      floor: 9,
      tags: ["신축급", "역세권", "풀옵션", "커뮤니티 시설"],
      badges: ["상담가능", "서류인증완료"],
      thumbnail: "/images/house/house-03.png",
      images: propertyImages(3, 4, 2),
      source: "직방",
      elevator: true,
      description: "신혼 생활을 시작하는 커플들이 선호하는 신축 투룸 오피스텔이에요.",
    },
    behaviorAnalysis:
      "예비 신혼부부는 전세자금대출 활용 비중이 70% 이상으로 매우 높고, 방 2개 이상 신축 매물을 선호했어요. 두 사람의 직장 중간 지점이나 더블 역세권 입지를 우선순위로 꼽는 경우가 많았고, 빌트인 가전이 갖춰진 풀옵션 매물의 만족도가 높았어요.",
  },
  {
    segmentLabel: "반려동물과 함께하는 30대 1인가구",
    match: { ageBands: ["30대 초반", "30대 후반"], livingWith: "1인 거주", hasPet: true },
    property: {
      id: "similar-03",
      title: "홍대입구역 도보 5분 반려동물 동반 원룸",
      address: "서울 마포구 서교동 371-9",
      district: "마포구",
      dealType: "월세",
      deposit: 15_000_000,
      monthlyRent: 750_000,
      areaPyeong: 8,
      rooms: 1,
      floor: 2,
      tags: ["반려동물 가능", "역세권", "감성 인테리어"],
      badges: ["상담가능"],
      thumbnail: "/images/house/house-05.png",
      images: propertyImages(5, 6, 3),
      source: "다방",
      elevator: false,
      description: "반려동물과 함께 지내기 좋은 저층 원룸이에요.",
    },
    behaviorAnalysis:
      "반려동물을 키우는 1인가구는 전체 매물 중 '반려동물 가능' 태그가 붙은 매물만 후보에 남기는 경향이 뚜렷했어요. 산책이 쉬운 저층·1층 매물, 층간소음에서 자유로운 빌라·저층 오피스텔 계약 비중이 높았고, 예산은 다소 높더라도 관리비에 청소·소독 서비스가 포함된 매물을 선호했어요.",
  },
  {
    segmentLabel: "차량 보유 통근형 30대 직장인",
    match: { ageBands: ["30대 초반", "30대 후반"], hasCar: true, commute: ["1시간~1시간 30분", "1시간 30분 이상"] },
    property: {
      id: "similar-04",
      title: "강남역 도보 10분 주차 완비 오피스텔 매매",
      address: "서울 서초구 서초동 1330-2",
      district: "서초구",
      dealType: "매매",
      deposit: 0,
      price: 420_000_000,
      areaPyeong: 16,
      rooms: 2,
      floor: 12,
      tags: ["주차 가능", "역세권", "투자용"],
      badges: ["서류인증완료"],
      thumbnail: "/images/house/house-07.png",
      images: propertyImages(7, 8, 4),
      source: "네이버",
      elevator: true,
      description: "장거리 출퇴근에도 주차가 편한 오피스텔이에요.",
    },
    behaviorAnalysis:
      "자차로 출퇴근하는 직장인은 세대당 주차대수 1대 이상을 필수 조건으로 두는 경우가 대부분이었고, 통근 거리가 먼 만큼 매매를 통한 정착을 고려하는 비중이 높았어요. 주차장 접근성과 관리사무소 운영 시간을 꼼꼼히 확인하는 문의가 많았어요.",
  },
  {
    segmentLabel: "룸메이트와 함께하는 20대 대학원생·사회초년생",
    match: { ageBands: ["20대 초반", "20대 후반"], livingWith: "룸메이트 동거", dealType: "월세" },
    property: {
      id: "similar-05",
      title: "혜화역 도보 6분 채광 좋은 셰어형 투룸",
      address: "서울 종로구 명륜3가 27-4",
      district: "종로구",
      dealType: "월세",
      deposit: 15_000_000,
      monthlyRent: 850_000,
      areaPyeong: 10,
      rooms: 2,
      floor: 2,
      tags: ["대학가 인접", "남향 채광", "공간 넉넉"],
      badges: ["상담가능"],
      thumbnail: "/images/house/house-09.png",
      images: propertyImages(9, 10, 5),
      source: "다방",
      elevator: false,
      description: "룸메이트와 나눠 쓰기 좋은 방 2개 구조의 채광 좋은 매물이에요.",
    },
    behaviorAnalysis:
      "룸메이트와 동거하는 20대는 1인당 부담 월세를 낮추기 위해 보증금·월세를 나눠 낼 수 있는 투룸 이상 매물을 주로 계약했어요. 방마다 독립된 창이 있는지, 현관에서 각 방까지의 동선이 분리되는지를 특히 꼼꼼히 확인하는 경향이 있었어요.",
  },
  {
    segmentLabel: "부모님과 함께 거주할 아파트를 찾는 40대",
    match: { ageBands: ["40대 이상"], livingWith: "가족과 거주", dealType: "매매" },
    property: {
      id: "similar-06",
      title: "건대입구역 도보 7분 패밀리형 신축 아파트",
      address: "서울 광진구 자양동 227-1",
      district: "광진구",
      dealType: "매매",
      deposit: 0,
      price: 780_000_000,
      areaPyeong: 24,
      rooms: 3,
      floor: 7,
      tags: ["신축", "커뮤니티 시설", "학군 인접"],
      badges: ["상담가능", "서류인증완료"],
      thumbnail: "/images/house/house-11.png",
      images: propertyImages(11, 12, 6),
      source: "직방",
      elevator: true,
      description: "3대가 함께 지내기 좋은 방 3개 구조의 신축 아파트예요.",
    },
    behaviorAnalysis:
      "가족과 함께 거주할 집을 찾는 40대는 방 3개 이상, 단지 내 커뮤니티 시설과 학군을 최우선으로 고려했어요. 대출을 낀 매매 계약 비중이 높고, 등기부·건축물대장 서류 검증을 여러 번 요청하는 등 의사결정에 신중한 편이었어요.",
  },
  {
    segmentLabel: "장거리 통근을 감수하는 저예산 20대",
    match: { ageBands: ["20대 초반", "20대 후반"], commute: ["1시간 30분 이상"], dealType: "월세" },
    property: {
      id: "similar-07",
      title: "신림역 고시촌 초저가 리모델링 원룸",
      address: "서울 관악구 신림동 1523-7",
      district: "관악구",
      dealType: "월세",
      deposit: 3_000_000,
      monthlyRent: 420_000,
      areaPyeong: 4.5,
      rooms: 1,
      floor: 3,
      tags: ["초저가", "즉시입주", "보안 CCTV"],
      badges: [],
      thumbnail: "/images/house/house-13.png",
      images: propertyImages(13, 14, 7),
      source: "다방",
      elevator: false,
      description: "고정비 부담을 최소화한 초저가 리모델링 원룸이에요.",
    },
    behaviorAnalysis:
      "예산을 최우선으로 두는 20대는 통근 시간이 길어지더라도 보증금·월세가 낮은 외곽 매물을 선택하는 경향이 뚜렷했어요. 관리비 포함 여부와 고정비 총액을 꼼꼼히 비교했고, 계약 기간을 짧게(1년 이하) 가져가는 경우가 많았어요.",
  },
  {
    segmentLabel: "대출로 첫 내집마련하는 30대 후반 무주택자",
    match: { ageBands: ["30대 후반"], dealType: "매매" },
    property: {
      id: "similar-08",
      title: "가산디지털단지역 도보 9분 대출활용 오피스텔 매매",
      address: "서울 금천구 가산동 345-6",
      district: "금천구",
      dealType: "매매",
      deposit: 0,
      price: 320_000_000,
      areaPyeong: 13,
      rooms: 2,
      floor: 6,
      tags: ["역세권", "투자용", "즉시입주 가능"],
      badges: ["서류인증완료"],
      thumbnail: "/images/house/house-15.png",
      images: propertyImages(15, 16, 8),
      source: "네이버",
      elevator: true,
      description: "생애최초 대출 한도를 활용하기 좋은 실거주·투자 겸용 오피스텔이에요.",
    },
    behaviorAnalysis:
      "생애최초 내집마련을 준비하는 30대 후반은 정책 대출 한도에 맞춰 매매가를 역산하는 경우가 많았고, 역세권·직주근접 오피스텔을 실거주 겸 투자용으로 선택하는 비중이 높았어요. 대출 상담과 금리 비교에 들이는 시간이 다른 세그먼트보다 길었어요.",
  },
];

function scorePersona(persona: Persona, input: SimilarUserInput): number {
  const m = persona.match;
  let score = 0;
  if (m.gender && m.gender === input.gender) score += 2;
  if (m.ageBands && m.ageBands.includes(input.ageBand)) score += 3;
  if (m.livingWith && m.livingWith === input.livingWith) score += 3;
  if (m.hasPet !== undefined && m.hasPet === input.hasPet) score += input.hasPet ? 2 : 0;
  if (m.hasCar !== undefined && m.hasCar === input.hasCar) score += input.hasCar ? 2 : 0;
  if (m.commute && m.commute.includes(input.commute)) score += 2;
  if (m.dealType && m.dealType === input.dealType) score += 2;
  if (persona.property.district === input.district) score += 1;
  return score;
}

/**
 * 입력한 인적 조건과 가장 비슷한 소비자 군 5개를 골라 예시 매물·소비 분석과 함께 반환한다.
 * excludeIds를 넘기면 그 매물들은 제외한 나머지 후보 중에서 고른다("다른 매물 찾아보기").
 * 제외하고 나면 5개가 안 남는 경우 전체 페르소나 풀로 되돌아가 처음부터 다시 순환한다.
 */
export function pickSimilarUserExamples(
  input: SimilarUserInput,
  excludeIds: string[] = [],
): SimilarUserExample[] {
  const remaining = PERSONAS.filter((persona) => !excludeIds.includes(persona.property.id));
  const pool = remaining.length >= 5 ? remaining : PERSONAS;

  return [...pool]
    .map((persona) => ({ persona, score: scorePersona(persona, input) + Math.random() * 1.5 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ persona }) => ({
      segmentLabel: persona.segmentLabel,
      property: persona.property,
      behaviorAnalysis: persona.behaviorAnalysis,
    }));
}

/** 상세페이지(/properties/[id])에서 예시 매물 id로 다시 조회할 때 쓰는 조회 함수 */
export function getPersonaPropertyById(id: string): Property | undefined {
  return PERSONAS.find((persona) => persona.property.id === id)?.property;
}
