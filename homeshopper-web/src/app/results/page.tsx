"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, RefreshCw, X } from "lucide-react";
import Container from "@/components/layout/Container";
import PageSection from "@/components/layout/PageSection";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import MatchBadge from "@/components/ui/MatchBadge";
import PropertyCard from "@/components/ui/PropertyCard";
import { useToast } from "@/components/ui/Toast";
import SegmentControl from "@/components/ui/SegmentControl";
import { useApp } from "@/context/AppContext";
import { getRecommendations } from "@/lib/api";
import { Property, SearchConditions } from "@/lib/types";
import { cn, formatPropertyPrice, shuffle } from "@/lib/utils";
import {
  ConditionEvaluation,
  evaluateConditions,
  Suggestion,
  SuggestionKind,
} from "@/lib/utils/market";

type SortKey = "match" | "price";

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: "충족도순", value: "match" },
  { label: "가격순", value: "price" },
];

/** 위저드를 거치지 않고 바로 들어온 경우를 위한 기본 조건 */
const FALLBACK_CONDITIONS: SearchConditions = {
  dealType: "월세",
  budgetMin: 0,
  budgetMax: 1_000_000_000,
  loanPlanned: false,
  districts: [],
  areaPyeongRange: null,
  moveInAfter: new Date().toISOString().slice(0, 10),
  priorities: ["역세권", "신축", "보안", "반려동물", "즉시입주"],
};

const SUGGESTION_CHIP_LABEL: Record<SuggestionKind, string> = {
  budget: "예산 조정됨",
  districts: "지역 넓힘",
  area: "크기 조정됨",
};

function priceSortValue(property: Property): number {
  if (property.dealType === "매매" && property.price !== undefined) {
    return property.price;
  }
  return property.deposit + (property.monthlyRent ?? 0) * 100;
}

function districtSummary(districts: string[]): string {
  if (districts.length === 0) return "";
  if (districts.length === 1) return districts[0];
  return `${districts[0]} 외 ${districts.length - 1}곳`;
}

/** 병목 원인에 맞춰 안내 카드 본문을 시세 근거와 함께 문장으로 만든다 */
function describeMismatch(evaluation: ConditionEvaluation, conditions: SearchConditions): string {
  const band = evaluation.band;
  if (!band) return "";
  const districtLabel = conditions.districts.join("·");
  const propertyLabel = conditions.propertyType ?? "매물";
  const budgetManwon = Math.round(conditions.budgetMax / 10_000).toLocaleString("ko-KR");

  if (evaluation.bottleneck === "크기") {
    return `${districtLabel} ${propertyLabel} ${conditions.dealType}의 일반적인 크기는 ${band.typicalPyeong[0]}~${band.typicalPyeong[1]}평이에요. 입력하신 희망 평수는 이 예산대에서 찾기 어려워요.`;
  }
  if (evaluation.bottleneck === "지역") {
    return `${districtLabel} ${propertyLabel} ${conditions.dealType}은 등록된 매물 표본이 ${band.sampleCount}건으로 적은 편이에요. 인접 지역까지 넓히면 더 많은 매물을 볼 수 있어요.`;
  }
  return `${districtLabel} ${propertyLabel} ${conditions.dealType} 보증금은 보통 ${band.depositRange[0].toLocaleString(
    "ko-KR",
  )}~${band.depositRange[1].toLocaleString("ko-KR")}만이에요. 입력하신 예산(${budgetManwon}만)으로는 매물이 거의 없어요.`;
}

export default function ResultsPage() {
  const router = useRouter();
  const showToast = useToast();
  const { state, toggleWishlist, addToVisitCart, setConditions } = useApp();
  const baseConditions = state.conditions ?? FALLBACK_CONDITIONS;

  const [appliedSuggestions, setAppliedSuggestions] = useState<Suggestion[]>([]);
  const effectiveConditions = useMemo<SearchConditions>(
    () => appliedSuggestions.reduce((acc, suggestion) => ({ ...acc, ...suggestion.patch }), baseConditions),
    [baseConditions, appliedSuggestions],
  );

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortKey>("match");
  const [evaluation, setEvaluation] = useState<ConditionEvaluation | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([getRecommendations(effectiveConditions), evaluateConditions(effectiveConditions)]).then(
      ([list, evalResult]) => {
        if (!active) return;
        setProperties(list);
        setEvaluation(evalResult);
        setLoading(false);
      },
    );
    return () => {
      active = false;
    };
  }, [effectiveConditions]);

  useEffect(() => {
    setBannerDismissed(false);
  }, [evaluation?.feasibility]);

  const sortedProperties = useMemo(() => {
    const list = [...properties];
    if (sortBy === "match") {
      list.sort(
        (a, b) => (b.matched?.satisfied.length ?? 0) - (a.matched?.satisfied.length ?? 0),
      );
    } else {
      list.sort((a, b) => priceSortValue(a) - priceSortValue(b));
    }
    return list;
  }, [properties, sortBy]);

  const isUnrealistic = evaluation?.feasibility === "unrealistic";
  const displayedProperties = isUnrealistic ? sortedProperties.slice(0, 4) : sortedProperties;

  const handleReshuffle = async () => {
    setLoading(true);
    const list = await getRecommendations(effectiveConditions);
    setProperties(shuffle(list));
    setLoading(false);
  };

  const handleLikeToggle = (property: Property) => {
    const liked = state.wishlist.includes(property.id);
    toggleWishlist(property.id);
    if (!liked) {
      showToast({ title: "찜한 매물에 담았어요", variant: "success" });
    }
  };

  const handleCartToggle = (property: Property) => {
    const inCart = state.visitCart.some((item) => item.propertyId === property.id);
    if (inCart) {
      router.push("/visit");
      return;
    }
    addToVisitCart(property.id);
    showToast({
      title: "임장 장바구니에 담았어요",
      variant: "success",
      action: { label: "보러가기", onClick: () => router.push("/visit") },
    });
  };

  const handleApplySuggestion = (suggestion: Suggestion) => {
    setAppliedSuggestions((prev) => [...prev.filter((item) => item.kind !== suggestion.kind), suggestion]);
  };

  const handleRevertSuggestion = (kind: SuggestionKind) => {
    setAppliedSuggestions((prev) => prev.filter((item) => item.kind !== kind));
  };

  const handleConsultWithCurrentConditions = () => {
    setConditions(effectiveConditions);
    router.push("/consult");
  };

  return (
    <main>
      <PageSection>
        <Container size="wide">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-[28px] font-bold text-ink md:text-[32px]">
                {state.user.name || "회원"} 님을 위한 추천 매물 리스트
                {effectiveConditions.districts.length > 0 && (
                  <span className="text-slate"> · {districtSummary(effectiveConditions.districts)}</span>
                )}
              </h1>
              <p className="mt-2 text-[14px] text-slate">
                총 {sortedProperties.length}개 매물 · 입력하신 조건 기준 정렬
              </p>
            </div>
            <SegmentControl options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} />
          </div>

          {appliedSuggestions.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {appliedSuggestions.map((suggestion) => (
                <span
                  key={suggestion.kind}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 py-1.5 pl-3 pr-1.5 text-[13px] font-semibold text-brand-blue"
                >
                  {SUGGESTION_CHIP_LABEL[suggestion.kind]}
                  <button
                    type="button"
                    onClick={() => handleRevertSuggestion(suggestion.kind)}
                    aria-label={`${SUGGESTION_CHIP_LABEL[suggestion.kind]} 되돌리기`}
                    className="flex h-4 w-4 items-center justify-center rounded-full text-brand-blue/70 hover:bg-brand-blue/20 hover:text-brand-blue"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {!loading && evaluation?.feasibility === "tight" && !bannerDismissed && (
            <div className="glass-surface mt-6 flex items-start gap-3 rounded-2xl border border-caution/30 px-5 py-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-caution" />
              <p className="flex-1 text-[14px] leading-relaxed text-ink">
                입력하신 예산은 {districtSummary(effectiveConditions.districts)} 시세의 하위 구간이에요. 조건에
                꼭 맞는 매물이 적을 수 있어 유사 조건 매물을 함께 보여드려요.
              </p>
              <button
                type="button"
                onClick={() => setBannerDismissed(true)}
                aria-label="닫기"
                className="shrink-0 text-slate hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {!loading && evaluation && isUnrealistic && (
            <GlassCard padding={32} className="mt-6">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-caution/15 text-caution">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-[17px] font-bold text-ink">
                    조건을 조금만 조정하면 선택지가 훨씬 넓어져요
                  </h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-slate">
                    {describeMismatch(evaluation, effectiveConditions)}
                  </p>
                </div>
              </div>

              {evaluation.suggestions.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {evaluation.suggestions.map((suggestion) => (
                    <button
                      key={suggestion.kind}
                      type="button"
                      onClick={() => handleApplySuggestion(suggestion)}
                      title={suggestion.description}
                      className="glass-surface rounded-full px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:bg-white/70"
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={handleConsultWithCurrentConditions}
                className="mt-5 inline-flex items-center gap-1 text-[13px] font-semibold text-brand-blue hover:underline"
              >
                그래도 이 조건으로 상담받기 <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </GlassCard>
          )}

          {!loading && isUnrealistic && displayedProperties.length > 0 && (
            <p className="mt-8 text-[14px] font-semibold text-ink">조건과 가장 가까운 매물이에요</p>
          )}

          <div
            className={cn(
              "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
              isUnrealistic ? "mt-4" : "mt-10",
            )}
          >
            {loading &&
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-card bg-white/60"
                >
                  <div className="aspect-[16/10] w-full bg-black/5" />
                  <div className="space-y-2 p-5">
                    <div className="h-4 w-2/3 rounded bg-black/10" />
                    <div className="h-3 w-1/2 rounded bg-black/10" />
                    <div className="h-5 w-1/3 rounded bg-black/10" />
                  </div>
                </div>
              ))}

            {!loading &&
              displayedProperties.map((property, index) => {
                const liked = state.wishlist.includes(property.id);
                const inCart = state.visitCart.some(
                  (item) => item.propertyId === property.id,
                );
                const criteria = property.matched
                  ? [
                      ...property.matched.satisfied.map((label) => ({
                        label,
                        met: true,
                      })),
                      ...property.matched.unsatisfied.map((label) => ({
                        label,
                        met: false,
                      })),
                    ]
                  : [];

                return (
                  <div
                    key={property.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <PropertyCard
                      layout="grid"
                      href={`/properties/${property.id}`}
                      imageUrl={property.thumbnail}
                      title={property.title}
                      dealType={property.dealType}
                      address={property.address}
                      price={formatPropertyPrice(property)}
                      area={`${property.areaPyeong}평`}
                      hasElevator={property.elevator}
                      tags={property.tags.slice(0, 3)}
                      consultAvailable={property.badges.includes("상담가능")}
                      verified={property.badges.includes("서류인증완료")}
                      liked={liked}
                      onLikeToggle={() => handleLikeToggle(property)}
                      footer={
                        <div className="flex flex-col gap-3 border-t border-black/5 pt-4">
                          {criteria.length > 0 && (
                            <MatchBadge criteria={criteria} expandable trigger="hover" />
                          )}
                          <GradientButton
                            type="button"
                            fullWidth
                            size="md"
                            variant={inCart ? "secondary" : "primary"}
                            onClick={() => handleCartToggle(property)}
                          >
                            {inCart ? "담김 ✓" : "임장 장바구니 담기"}
                          </GradientButton>
                        </div>
                      }
                    />
                  </div>
                );
              })}
          </div>

          {!loading && (
            <div className="mt-12 flex justify-center">
              <GradientButton
                type="button"
                variant="secondary"
                onClick={handleReshuffle}
              >
                <RefreshCw className="h-4 w-4" />
                다른 매물 찾아보기
              </GradientButton>
            </div>
          )}
        </Container>
      </PageSection>
    </main>
  );
}
