"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import Container from "@/components/layout/Container";
import PageSection from "@/components/layout/PageSection";
import GradientButton from "@/components/ui/GradientButton";
import MatchBadge from "@/components/ui/MatchBadge";
import PropertyCard from "@/components/ui/PropertyCard";
import { useToast } from "@/components/ui/Toast";
import SegmentControl from "@/components/ui/SegmentControl";
import { useApp } from "@/context/AppContext";
import { getRecommendations } from "@/lib/api";
import { Property, SearchConditions } from "@/lib/types";
import { formatPropertyPrice, shuffle } from "@/lib/utils";

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
  district: "",
  areaPyeong: 0,
  moveInAfter: new Date().toISOString().slice(0, 10),
  priorities: ["역세권", "신축", "보안", "반려동물", "즉시입주"],
};

function priceSortValue(property: Property): number {
  if (property.dealType === "매매" && property.price !== undefined) {
    return property.price;
  }
  return property.deposit + (property.monthlyRent ?? 0) * 100;
}

export default function ResultsPage() {
  const router = useRouter();
  const showToast = useToast();
  const { state, toggleWishlist, addToVisitCart } = useApp();
  const conditions = state.conditions ?? FALLBACK_CONDITIONS;

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortKey>("match");

  useEffect(() => {
    let active = true;
    setLoading(true);
    getRecommendations(conditions).then((list) => {
      if (!active) return;
      setProperties(list);
      setLoading(false);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleReshuffle = async () => {
    setLoading(true);
    const list = await getRecommendations(conditions);
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

  return (
    <main>
      <PageSection>
        <Container size="wide">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-[28px] font-bold text-ink md:text-[32px]">
                {state.user.name || "회원"} 님을 위한 추천 매물 리스트
              </h1>
              <p className="mt-2 text-[14px] text-slate">
                총 {sortedProperties.length}개 매물 · 입력하신 조건 기준 정렬
              </p>
            </div>
            <SegmentControl options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              sortedProperties.map((property, index) => {
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
