// ---------- Property ----------

export type DealType = "월세" | "전세" | "매매";

export type PropertyBadge = "상담가능" | "서류인증완료";

export type PropertySource = "네이버" | "직방" | "다방";

export interface PropertyMatch {
  /** total number of conditions being matched against (usually equals priorities.length) */
  total: number;
  satisfied: string[];
  unsatisfied: string[];
}

export interface Property {
  id: string;
  title: string;
  address: string;
  district: string;
  dealType: DealType;
  /** 보증금(원). 매매 매물은 개념상 보증금이 없으므로 0을 사용 */
  deposit: number;
  /** 월세(원). 월세 매물에만 존재 */
  monthlyRent?: number;
  /** 매매가(원). 매매 매물에만 존재 */
  price?: number;
  areaPyeong: number;
  rooms: number;
  floor: number;
  tags: string[];
  badges: PropertyBadge[];
  thumbnail: string;
  /** 상세 페이지 갤러리용 이미지 목록 (집 내부 사진 2장 + 화장실 사진 1장) */
  images: string[];
  source: PropertySource;
  elevator: boolean;
  description: string;
  matched?: PropertyMatch;
}

// ---------- Search conditions ----------

export type PropertyType = "원룸" | "투룸이상" | "오피스텔" | "아파트" | "빌라";

/** 건축물대장 조회 결과(mock). 현재 거주 중인 집의 구조 정보 */
export interface BuildingStructureInfo {
  builtYear: number;
  structureType: "계단식" | "복도식" | "타워식";
  totalFloors: number;
  unitFloor: number;
  roomCount: number;
  bathroomCount: number;
  areaPyeong: number;
  hasDressRoom: boolean;
  hasPantry: boolean;
}

/** 조건 위저드 4단계에서 입력하는 "지금 집 기준" 정보 (선택) */
export interface CurrentHomeInput {
  address: string;
  /** 예: "지금 살고 있는 집보다 옷방이 더 넓고, 펜트리가 있었으면 좋겠어요." */
  requestText?: string;
  structure?: BuildingStructureInfo;
}

export interface SearchConditions {
  dealType: DealType;
  propertyType?: PropertyType;
  budgetMin: number;
  budgetMax: number;
  monthlyRentMax?: number;
  loanPlanned: boolean;
  loanMethod?: string;
  district: string;
  areaPyeong: number;
  /** ISO date string (YYYY-MM-DD) — 이 날짜 이후 입주 희망 */
  moveInAfter: string;
  /** 배열 순서 = 우선순위. 최대 5개 */
  priorities: string[];
  /** 보기 항목에 없는 요청사항을 자유 텍스트로 남긴 내용 (선택) */
  customRequest?: string;
  /** 지금 집 주소 기준으로 원하는 구조를 설명한 내용 (선택) */
  currentHome?: CurrentHomeInput;
}

// ---------- Visit cart ----------

export interface VisitCartItem {
  propertyId: string;
  scheduledAt?: {
    date: string;
    time: string;
  };
  visited: boolean;
}

// ---------- Deal ----------

export type DealStage =
  | "제안"
  | "협상중"
  | "수락"
  | "계약전"
  | "계약금입금"
  | "소유권이전"
  | "완료";

export interface DealFee {
  /** 법정 상한 요율 기준 중개보수(원) */
  standard: number;
  /** 홈쇼퍼 정찰 수수료(원, 법정 상한의 1/2) */
  homeshopper: number;
}

export interface DealEvent {
  id: string;
  /** 기준일 대비 남은/지난 일수 (예: -3, 0, 5) */
  dday: number;
  title: string;
  date: string;
  alarmOn: boolean;
}

export type DealTaskActionType = "upload" | "pay" | "confirm";

export interface DealTask {
  id: string;
  label: string;
  done: boolean;
  actionType?: DealTaskActionType;
}

export interface Deal {
  id: string;
  propertyId: string;
  stage: DealStage;
  proposedPrice: number;
  /** 다른 매수·임차 희망자의 최고 제안가(원). 협상 화면의 경쟁 현황에 쓰인다 */
  highestCompetingOffer?: number;
  /** 희망 입주일 (ISO date) */
  moveInDate?: string;
  /** 현재 제안이 접수된 날짜 (ISO date) */
  submittedAt?: string;
  /** 제안 시 함께 남긴 메시지 */
  message?: string;
  fee: DealFee;
  events: DealEvent[];
  tasks: DealTask[];
}

// ---------- Analysis ----------

export type CheckPointLevel = "ok" | "caution" | "danger";

export interface CheckPoint {
  level: CheckPointLevel;
  title: string;
  status: string;
  description: string;
  whyItMatters?: string;
  questionsForAgent?: string[];
}

export interface AnalysisResult {
  propertyId: string;
  /** 종합 헤더 카드에 쓰는 짧은 한 줄 타이틀 (RECOMMENDATION 섹션의 긴 본문과는 별개) */
  headline: string;
  registry: CheckPoint[];
  building: CheckPoint[];
  priceCheck: CheckPoint;
  recommendation: string;
}

// ---------- Services ----------

export type ServiceVendorCategory = "이사" | "인테리어" | "유지보수" | "해충퇴치";

export interface ServiceVendor {
  id: string;
  category: ServiceVendorCategory;
  name: string;
  rating: number;
  priceRange: string;
  distanceKm: number;
  address: string;
  desc: string;
  contact: string;
}

// ---------- Loans ----------

export interface LoanProduct {
  id: string;
  name: string;
  bank: string;
  rateRange: string;
  limit: string;
  summary: string;
}

// ---------- Agent ----------

export type AgentRole = "전담 매니저" | "임장 중개보조원" | "전담 중개사";

export interface Agent {
  name: string;
  role: AgentRole;
  phone: string;
  photo: string;
}

// ---------- User ----------

export type AuthMethod = "kakao" | "email";
export type UserIntent = "매수" | "매도";

export interface User {
  name: string;
  phone: string;
  isLoggedIn: boolean;
  authMethod?: AuthMethod;
  /** 이메일 로그인 계정을 구분하는 식별자 (소문자 정규화) */
  email?: string;
  /** 온보딩에서 고른 매수/매도 성향 */
  intent?: UserIntent;
  /** 온보딩에서 고른 관심 지역 (구 단위, 복수 선택) */
  interestedDistricts?: string[];
}

// ---------- Mypage history ----------

export interface AnalysisHistoryItem {
  id: string;
  propertyId: string;
  propertyTitle: string;
  headline: string;
  overallOk: boolean;
  analyzedAt: string;
}

export interface ServiceUsageItem {
  id: string;
  category: string;
  label: string;
  requestedAt: string;
}

// ---------- Listing application (매도·임대 매물 등록 신청) ----------

export interface ListingApplication {
  id: string;
  name: string;
  phone: string;
  email?: string;
  dealType: DealType;
  address: string;
  /** 업로드한 인증 서류 항목명 목록 (선택) */
  documents: string[];
  submittedAt: string;
}
