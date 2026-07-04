"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, CheckCircle2, ChevronLeft, Heart, MapPin, X } from "lucide-react";
import Container from "@/components/layout/Container";
import PageSection from "@/components/layout/PageSection";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import { useToast } from "@/components/ui/Toast";
import { useApp } from "@/context/AppContext";
import { getProperty } from "@/lib/api";
import { Property } from "@/lib/types";
import { useRequireLogin } from "@/lib/useRequireLogin";
import { cn, computePropertyMatch, formatManwon } from "@/lib/utils";
import DealOfferCard from "./_components/DealOfferCard";

const DOCUMENT_ITEMS = [
  "등기부등본",
  "건축물대장",
  "국세 납부 증명서",
  "지방세 납부 증명서",
  "전입세대 확인서",
  "신분증 인증",
];

const PRICE_LEVELS = ["저렴", "적정", "높음"] as const;

function priceLevelFor(id: string): (typeof PRICE_LEVELS)[number] {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return PRICE_LEVELS[hash % PRICE_LEVELS.length];
}

function galleryFor(property: Property): string[] {
  return property.images.length > 0 ? property.images : [property.thumbnail];
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const showToast = useToast();
  const { state, toggleWishlist, addToVisitCart } = useApp();
  const { requireLogin, guardModal } = useRequireLogin();

  const [property, setProperty] = useState<Property | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setActiveImage(0);
    getProperty(params.id).then((result) => {
      if (!active) return;
      setProperty(result);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [params.id]);

  const matched = useMemo(
    () =>
      property
        ? computePropertyMatch(property, state.conditions?.priorities ?? [])
        : undefined,
    [property, state.conditions],
  );

  if (loading) {
    return (
      <main>
        <PageSection>
          <Container size="wide">
            <div className="animate-pulse space-y-6">
              <div className="h-8 w-64 rounded bg-black/10" />
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <div className="aspect-[16/10] w-full rounded-card bg-black/5" />
                </div>
                <div className="lg:col-span-5">
                  <div className="h-64 w-full rounded-card bg-black/5" />
                </div>
              </div>
            </div>
          </Container>
        </PageSection>
      </main>
    );
  }

  if (!property) {
    return (
      <main>
        <PageSection>
          <Container size="narrow">
            <GlassCard padding={40} className="text-center">
              <p className="text-lg font-bold text-ink">매물을 찾을 수 없어요</p>
              <p className="mt-2 text-[14px] text-slate">
                삭제되었거나 잘못된 주소일 수 있어요.
              </p>
              <Link href="/results">
                <GradientButton className="mt-6" fullWidth>
                  추천 매물로 돌아가기
                </GradientButton>
              </Link>
            </GlassCard>
          </Container>
        </PageSection>
      </main>
    );
  }

  const liked = state.wishlist.includes(property.id);
  const inCart = state.visitCart.some((item) => item.propertyId === property.id);
  const isVisited = state.visitCart.some(
    (item) => item.propertyId === property.id && item.visited,
  );
  const consultAvailable = property.badges.includes("상담가능");
  const verified = property.badges.includes("서류인증완료");
  const gallery = galleryFor(property);

  const handleReserveVisit = () =>
    requireLogin(() => {
      if (!inCart) addToVisitCart(property.id);
      showToast({
        title: "임장 장바구니에 담았어요",
        variant: "success",
        action: { label: "보러가기", onClick: () => router.push("/visit") },
      });
      router.push("/visit");
    });

  const handleWishlistToggle = () => {
    toggleWishlist(property.id);
    if (!liked) {
      showToast({ title: "찜한 매물에 담았어요", variant: "success" });
    }
  };

  return (
    <main>
      <PageSection>
        <Container size="wide">
          {/* 상단 헤더 */}
          <button
            type="button"
            onClick={() => router.push("/results")}
            className="inline-flex items-center gap-1 text-[14px] font-medium text-slate transition-colors hover:text-ink"
          >
            <ChevronLeft className="h-4 w-4" />
            뒤로가기
          </button>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-black/5 px-2.5 py-1 text-[12px] font-medium text-slate">
              {property.dealType}
            </span>
            {consultAvailable && (
              <span className="rounded-full bg-success/10 px-2.5 py-1 text-[12px] font-semibold text-success">
                상담가능
              </span>
            )}
            {verified && (
              <span className="rounded-full bg-brand-purple/10 px-2.5 py-1 text-[12px] font-semibold text-brand-purple">
                ✓ 서류 인증 완료
              </span>
            )}
          </div>
          <h1 className="mt-2 text-[24px] font-bold text-ink md:text-[28px]">
            {property.title}
          </h1>
          <p className="mt-1 text-[14px] text-slate">{property.address}</p>

          {/* 본문 2단 — items-start를 주지 않아야 우측 컬럼이 좌측 높이만큼 늘어나 sticky가 동작할 여유 공간이 생긴다 */}
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* 좌측 */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/11] w-full overflow-hidden rounded-card bg-black/5">
                <Image
                  src={gallery[activeImage]}
                  alt={`${property.title} 사진 ${activeImage + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  priority
                  className="object-cover"
                />
                <span className="glass-surface absolute bottom-3 right-3 rounded-full px-3 py-1 text-[12px] font-medium text-ink">
                  {activeImage + 1} / {gallery.length}
                </span>
              </div>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {gallery.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`${index + 1}번째 사진 보기`}
                    aria-pressed={activeImage === index}
                    className={cn(
                      "relative h-16 w-24 shrink-0 overflow-hidden rounded-xl transition-all",
                      activeImage === index
                        ? "ring-2 ring-brand-blue ring-offset-2"
                        : "opacity-70 ring-1 ring-black/10 hover:opacity-100",
                    )}
                  >
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* 매물 상세 */}
              <section className="mt-12">
                <h2 className="text-xl font-bold text-ink">매물 상세</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-slate">
                  {property.description}
                </p>
              </section>

              {/* 고려사항 충족표 */}
              {matched && matched.total > 0 && (
                <section className="mt-12">
                  <h2 className="text-xl font-bold text-ink">
                    고려사항 충족표{" "}
                    <span className="text-brand-blue">
                      {matched.satisfied.length}/{matched.total}
                    </span>
                  </h2>
                  <div className="mt-4 space-y-2">
                    {[...matched.satisfied, ...matched.unsatisfied].map((label) => {
                      const met = matched.satisfied.includes(label);
                      return (
                        <div
                          key={label}
                          className="glass-surface flex items-center gap-3 rounded-2xl px-4 py-3"
                        >
                          <span
                            className={cn(
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                              met ? "bg-success/15 text-success" : "bg-black/5 text-slate",
                            )}
                          >
                            {met ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <X className="h-3.5 w-3.5" />
                            )}
                          </span>
                          <span className="text-[14px] font-medium text-ink">
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* 서류 인증 */}
              <section className="mt-12">
                <h2 className="text-xl font-bold text-ink">서류 인증</h2>
                <p className="mt-1 text-[13px] text-slate">
                  아래 서류가 모두 홈쇼퍼를 통해 검증되었습니다.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {DOCUMENT_ITEMS.map((label) => (
                    <div
                      key={label}
                      className="glass-surface flex items-center justify-between rounded-2xl px-4 py-3"
                    >
                      <span className="text-[14px] font-medium text-ink">{label}</span>
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-blue text-white">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[12px] text-slate">
                  본 안내는 참고용이며 법적 효력이 없습니다. 전문가 확인을 권장합니다.
                </p>
              </section>

              {/* 위치·주변 */}
              <section className="mt-12">
                <h2 className="text-xl font-bold text-ink">위치·주변</h2>
                <div className="mt-4 flex aspect-video w-full items-center justify-center gap-2 rounded-card bg-black/5 text-slate">
                  <MapPin className="h-5 w-5" />
                  지도 영역 (준비 중)
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[13px] text-slate">주변 시세 대비</span>
                  <span className="rounded-full bg-brand-blue/10 px-2.5 py-1 text-[12px] font-semibold text-brand-blue">
                    {priceLevelFor(property.id)}
                  </span>
                </div>
              </section>
            </div>

            {/* 우측 sticky */}
            <div className="lg:col-span-5">
              <div className="space-y-6 lg:sticky lg:top-28">
                <GlassCard padding={24}>
                  {property.dealType === "월세" ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[12px] text-slate">보증금</p>
                        <p className="mt-1 text-2xl font-bold text-ink">
                          {formatManwon(property.deposit)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[12px] text-slate">월세</p>
                        <p className="mt-1 text-2xl font-bold text-ink">
                          {formatManwon(property.monthlyRent ?? 0)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[12px] text-slate">
                        {property.dealType === "매매" ? "매매가" : "보증금"}
                      </p>
                      <p className="mt-1 text-3xl font-bold text-ink">
                        {formatManwon(
                          property.dealType === "매매"
                            ? property.price ?? 0
                            : property.deposit,
                        )}
                      </p>
                    </div>
                  )}
                </GlassCard>

                <GlassCard padding={24}>
                  <p className="text-[13px] font-semibold text-slate">주요 특징</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {property.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-brand-blue/10 px-3 py-1.5 text-[13px] font-medium text-brand-blue"
                      >
                        <Check className="h-3.5 w-3.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </GlassCard>

                {isVisited ? (
                  <>
                    <DealOfferCard property={property} />
                    <div className="space-y-3">
                      <GradientButton
                        type="button"
                        size="lg"
                        fullWidth
                        onClick={() =>
                          router.push(`/analysis?propertyId=${property.id}`)
                        }
                      >
                        이 매물 서류 분석하기
                      </GradientButton>
                      <GradientButton
                        type="button"
                        variant="secondary"
                        fullWidth
                        onClick={handleWishlistToggle}
                      >
                        <Heart
                          className="h-4 w-4"
                          fill={liked ? "currentColor" : "none"}
                        />
                        {liked ? "위시리스트에 담김" : "위시리스트에 담기"}
                      </GradientButton>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <GradientButton
                      type="button"
                      size="lg"
                      fullWidth
                      onClick={handleReserveVisit}
                    >
                      임장 예약하기
                    </GradientButton>
                    <GradientButton
                      type="button"
                      variant="secondary"
                      fullWidth
                      onClick={handleWishlistToggle}
                    >
                      <Heart
                        className="h-4 w-4"
                        fill={liked ? "currentColor" : "none"}
                      />
                      {liked ? "위시리스트에 담김" : "위시리스트에 담기"}
                    </GradientButton>
                    <GradientButton
                      type="button"
                      variant="ghost"
                      fullWidth
                      onClick={() =>
                        router.push(`/analysis?propertyId=${property.id}`)
                      }
                    >
                      이 매물 서류 분석하기
                    </GradientButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </PageSection>
      {guardModal}
    </main>
  );
}
