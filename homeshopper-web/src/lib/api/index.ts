import {
  Agent,
  AnalysisResult,
  Deal,
  DealFee,
  DealStage,
  LoanProduct,
  Property,
  SearchConditions,
  ServiceVendor,
  ServiceVendorCategory,
  VisitCartItem,
} from "@/lib/types";
import { getPropertyById, properties } from "@/lib/mock/properties";
import { cautionCase, getAnalysisByPropertyId, safeCase } from "@/lib/mock/analysis";
import { getAgentByRole } from "@/lib/mock/agents";
import { loans } from "@/lib/mock/loans";
import { vendors } from "@/lib/mock/vendors";
import { computePropertyMatch } from "@/lib/utils";

// ---------- internal helpers ----------

/** 300~600ms 사이의 지연을 흉내내 실제 네트워크 호출처럼 동작하게 한다 */
function delay<T>(value: T): Promise<T> {
  const ms = 300 + Math.random() * 300;
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

function hashString(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// ---------- property link parsing ----------

/** 네이버부동산·직방·다방 등에서 붙여넣은 매물 링크를 파싱하는 것을 흉내낸다 */
export async function parsePropertyLink(url: string): Promise<Property> {
  const seed = hashString(url);
  const base = properties[seed % properties.length];
  const parsed: Property = {
    ...base,
    id: `parsed-${seed}`,
  };
  return delay(parsed);
}

// ---------- recommendations ----------

function scoreProperty(property: Property, conditions: SearchConditions): number {
  let score = 0;

  if (property.dealType === conditions.dealType) score += 3;

  if (conditions.district && property.district.includes(conditions.district)) {
    score += 2;
  }

  if (property.areaPyeong >= conditions.areaPyeong) score += 1;

  const budgetBase =
    property.dealType === "매매" ? property.price ?? 0 : property.deposit;
  if (budgetBase >= conditions.budgetMin && budgetBase <= conditions.budgetMax) {
    score += 2;
  }

  if (
    conditions.monthlyRentMax !== undefined &&
    property.monthlyRent !== undefined &&
    property.monthlyRent <= conditions.monthlyRentMax
  ) {
    score += 1;
  }

  conditions.priorities.forEach((priority) => {
    const matchesPriority = property.tags.some(
      (tag) => tag.includes(priority) || priority.includes(tag),
    );
    if (matchesPriority) score += 1;
  });

  return score;
}

function attachMatch(property: Property, conditions: SearchConditions): Property {
  const matched = computePropertyMatch(property, conditions.priorities);
  return matched ? { ...property, matched } : property;
}

export async function getRecommendations(
  conditions: SearchConditions,
): Promise<Property[]> {
  const ranked = [...properties]
    .map((property) => ({ property, score: scoreProperty(property, conditions) }))
    .sort((a, b) => b.score - a.score)
    .map(({ property }) => attachMatch(property, conditions));

  return delay(ranked);
}

// ---------- single property ----------

export async function getProperty(id: string): Promise<Property | undefined> {
  return delay(getPropertyById(id));
}

// ---------- visit scheduling ----------

const ALL_VISIT_SLOTS = [
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

export async function getVisitSlots(date: string): Promise<string[]> {
  const seed = hashString(date);
  const bookedIndexA = seed % ALL_VISIT_SLOTS.length;
  const bookedIndexB = Math.floor(seed / 7) % ALL_VISIT_SLOTS.length;

  const available = ALL_VISIT_SLOTS.filter(
    (_, index) => index !== bookedIndexA && index !== bookedIndexB,
  );

  return delay(available);
}

export async function createVisit(
  propertyId: string,
  date: string,
  time: string,
): Promise<VisitCartItem> {
  const item: VisitCartItem = {
    propertyId,
    scheduledAt: { date, time },
    visited: false,
  };
  return delay(item);
}

// ---------- document analysis ----------

export async function getAnalysis(propertyId: string): Promise<AnalysisResult> {
  const found = getAnalysisByPropertyId(propertyId);
  if (found) return delay(found);

  // 전용 mock이 없는 매물(주소 입력으로 생성된 매물 포함)은 id를 기준으로
  // 안전/주의 케이스를 번갈아 보여준다 (데모용)
  const template = hashString(propertyId) % 2 === 0 ? safeCase : cautionCase;
  return delay({ ...template, propertyId });
}

// ---------- deals ----------

const STANDARD_FEE: DealFee = { standard: 800_000, homeshopper: 400_000 };

let deals: Deal[] = [
  {
    id: "deal1",
    propertyId: "p1",
    stage: "협상중",
    proposedPrice: 20_000_000,
    fee: STANDARD_FEE,
    events: [
      { id: "e1", dday: -2, title: "임장 방문", date: "2026-07-01", alarmOn: true },
      { id: "e2", dday: 3, title: "계약금 입금 예정", date: "2026-07-06", alarmOn: true },
    ],
    tasks: [
      { id: "t1", label: "신분증 사본 제출", done: true, actionType: "upload" },
      { id: "t2", label: "계약금 입금", done: false, actionType: "pay" },
      { id: "t3", label: "특약사항 확인", done: false, actionType: "confirm" },
    ],
  },
];

export async function getDeal(id: string): Promise<Deal | undefined> {
  return delay(deals.find((deal) => deal.id === id));
}

export async function updateDealStage(
  dealId: string,
  stage: DealStage,
): Promise<Deal | undefined> {
  const existing = deals.find((deal) => deal.id === dealId);
  if (!existing) return delay(undefined);

  const updated: Deal = { ...existing, stage };
  deals = deals.map((deal) => (deal.id === dealId ? updated : deal));
  return delay(updated);
}

/** 다른 매수·임차 희망자의 최고 제안가를 매물 호가 기준으로 그럴듯하게 만들어낸다 (데모용) */
function computeHighestCompetingOffer(basePrice: number, seed: string): number {
  const variance = 0.85 + (hashString(seed) % 30) / 100; // 0.85 ~ 1.14
  return Math.round((basePrice * variance) / 10_000) * 10_000;
}

export async function submitOffer(
  propertyId: string,
  proposedPrice: number,
  message?: string,
): Promise<Deal> {
  const existing = deals.find((deal) => deal.propertyId === propertyId);
  const submittedAt = new Date().toISOString().slice(0, 10);

  if (existing) {
    const updated: Deal = {
      ...existing,
      proposedPrice,
      stage: "협상중",
      message: message ?? existing.message,
      submittedAt,
    };
    deals = deals.map((deal) => (deal.id === existing.id ? updated : deal));
    return delay(updated);
  }

  const property = getPropertyById(propertyId);
  const basePrice = property
    ? property.dealType === "매매"
      ? property.price ?? proposedPrice
      : property.deposit
    : proposedPrice;
  const moveInDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const created: Deal = {
    id: generateId("deal"),
    propertyId,
    stage: "제안",
    proposedPrice,
    highestCompetingOffer: computeHighestCompetingOffer(basePrice, propertyId),
    moveInDate,
    submittedAt,
    message,
    fee: STANDARD_FEE,
    events: [],
    tasks: [
      { id: generateId("task"), label: "제안서 검토 대기", done: false, actionType: "confirm" },
    ],
  };
  deals = [...deals, created];
  return delay(created);
}

// ---------- agents ----------

export async function getAgent(role: Agent["role"]): Promise<Agent | undefined> {
  return delay(getAgentByRole(role));
}

// ---------- vendors ----------

export async function getVendors(
  category?: ServiceVendorCategory,
  location?: string,
): Promise<ServiceVendor[]> {
  const filtered = category
    ? vendors.filter((vendor) => vendor.category === category)
    : vendors;

  const sorted = [...filtered].sort((a, b) => {
    if (location) {
      const aMatches = a.address.includes(location) ? 0 : 1;
      const bMatches = b.address.includes(location) ? 0 : 1;
      if (aMatches !== bMatches) return aMatches - bMatches;
    }
    return a.distanceKm - b.distanceKm;
  });

  return delay(sorted);
}

// ---------- loans ----------

export interface LoanInquiryInput {
  loanMethod?: string;
  budgetMax?: number;
}

export async function getLoanProducts(
  input?: LoanInquiryInput,
): Promise<LoanProduct[]> {
  // mock: 실제로는 input의 소득·한도 조건에 따라 상품을 필터링/정렬한다
  void input;
  return delay(loans);
}

// ---------- consult ----------

export interface ConsultForm {
  name: string;
  phone: string;
  message?: string;
}

export interface ConsultSubmission {
  success: true;
  consultId: string;
}

export async function submitConsult(form: ConsultForm): Promise<ConsultSubmission> {
  void form;
  return delay({ success: true, consultId: generateId("consult") });
}
