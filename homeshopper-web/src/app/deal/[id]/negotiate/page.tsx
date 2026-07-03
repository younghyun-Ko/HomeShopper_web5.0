"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import PageSection from "@/components/layout/PageSection";
import LoginRequiredNotice from "@/components/auth/LoginRequiredNotice";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import { useApp } from "@/context/AppContext";
import { getDeal, getProperty } from "@/lib/api";
import { Deal, Property } from "@/lib/types";
import NegotiationCard from "./_components/NegotiationCard";
import OfferReviewSection from "./_components/OfferReviewSection";

export default function DealNegotiatePage({ params }: { params: { id: string } }) {
  const { state } = useApp();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getDeal(params.id).then(async (result) => {
      if (!active) return;
      if (result) {
        setDeal(result);
        const relatedProperty = await getProperty(result.propertyId);
        if (active) setProperty(relatedProperty ?? null);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [params.id]);

  if (!state.user.isLoggedIn) {
    return <LoginRequiredNotice />;
  }

  if (loading) {
    return (
      <main>
        <PageSection>
          <Container size="wide">
            <div className="h-64 animate-pulse rounded-card bg-black/5" />
          </Container>
        </PageSection>
      </main>
    );
  }

  if (!deal || !property) {
    return (
      <main>
        <PageSection>
          <Container size="narrow">
            <GlassCard padding={40} className="text-center">
              <p className="text-lg font-bold text-ink">거래 정보를 찾을 수 없어요</p>
              <Link href="/visit">
                <GradientButton className="mt-6" fullWidth>
                  임장·관리로 돌아가기
                </GradientButton>
              </Link>
            </GlassCard>
          </Container>
        </PageSection>
      </main>
    );
  }

  return (
    <main>
      <PageSection>
        <Container size="wide">
          {deal.stage === "제안" ? (
            <OfferReviewSection deal={deal} property={property} onDealChange={setDeal} />
          ) : (
            <NegotiationCard deal={deal} property={property} onDealChange={setDeal} />
          )}
        </Container>
      </PageSection>
    </main>
  );
}
