"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import Container from "@/components/layout/Container";
import PageSection from "@/components/layout/PageSection";
import GradientButton from "@/components/ui/GradientButton";
import PropertyCard from "@/components/ui/PropertyCard";
import { useToast } from "@/components/ui/Toast";
import { useApp } from "@/context/AppContext";
import { getProperty } from "@/lib/api";
import { Property } from "@/lib/types";
import { formatPropertyPrice } from "@/lib/utils";

export default function WishlistPage() {
  const router = useRouter();
  const showToast = useToast();
  const { state, toggleWishlist, addToVisitCart } = useApp();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const wishlistKey = state.wishlist.join(",");

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all(state.wishlist.map((id) => getProperty(id))).then((list) => {
      if (!active) return;
      setProperties(list.filter((property): property is Property => Boolean(property)));
      setLoading(false);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wishlistKey]);

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

  const showEmptyState = !loading && properties.length === 0;

  return (
    <main>
      <PageSection>
        <Container size="wide">
          <h1 className="text-[28px] font-bold text-ink md:text-[32px]">
            {state.user.name || "회원"} 님이 찜한 매물 리스트
          </h1>
          <p className="mt-2 text-[14px] text-slate">총 {properties.length}개 매물</p>

          {showEmptyState && (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/5">
                <Heart className="h-7 w-7 text-slate" />
              </div>
              <p className="text-[16px] font-semibold text-ink">아직 찜한 매물이 없어요</p>
              <Link href="/results">
                <GradientButton type="button" className="mt-2">
                  추천 매물 보러가기
                </GradientButton>
              </Link>
            </div>
          )}

          {!showEmptyState && (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {loading &&
                Array.from({ length: 3 }).map((_, index) => (
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
                properties.map((property, index) => {
                  const inCart = state.visitCart.some(
                    (item) => item.propertyId === property.id,
                  );
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
                        liked
                        onLikeToggle={() => toggleWishlist(property.id)}
                        footer={
                          <GradientButton
                            type="button"
                            fullWidth
                            size="md"
                            variant={inCart ? "secondary" : "primary"}
                            onClick={() => handleCartToggle(property)}
                          >
                            {inCart ? "담김 ✓" : "임장 장바구니 담기"}
                          </GradientButton>
                        }
                      />
                    </div>
                  );
                })}
            </div>
          )}
        </Container>
      </PageSection>
    </main>
  );
}
