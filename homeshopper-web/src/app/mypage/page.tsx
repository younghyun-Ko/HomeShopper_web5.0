"use client";

import { useEffect, useMemo, useState } from "react";
import Container from "@/components/layout/Container";
import PageSection from "@/components/layout/PageSection";
import LoginRequiredNotice from "@/components/auth/LoginRequiredNotice";
import { useApp } from "@/context/AppContext";
import { getProperty } from "@/lib/api";
import { Property } from "@/lib/types";
import ActiveDealCard from "./_components/ActiveDealCard";
import AnalysisHistorySection from "./_components/AnalysisHistorySection";
import ListingApplicationsSection from "./_components/ListingApplicationsSection";
import ServiceUsageSection from "./_components/ServiceUsageSection";
import VisitScheduleSection from "./_components/VisitScheduleSection";
import WishlistShortcutCard from "./_components/WishlistShortcutCard";

export default function MyPage() {
  const { state } = useApp();
  const [properties, setProperties] = useState<Record<string, Property>>({});

  const activeDeal = useMemo(
    () => [...state.deals].reverse().find((deal) => deal.stage !== "완료"),
    [state.deals],
  );

  const neededPropertyIds = useMemo(() => {
    const ids = new Set<string>();
    if (activeDeal) ids.add(activeDeal.propertyId);
    state.visitCart.forEach((item) => {
      if (item.scheduledAt) ids.add(item.propertyId);
    });
    return Array.from(ids);
  }, [activeDeal, state.visitCart]);
  const neededPropertyKey = neededPropertyIds.join(",");

  useEffect(() => {
    if (neededPropertyIds.length === 0) {
      setProperties({});
      return;
    }
    let active = true;
    Promise.all(neededPropertyIds.map((id) => getProperty(id))).then((results) => {
      if (!active) return;
      const map: Record<string, Property> = {};
      results.forEach((property) => {
        if (property) map[property.id] = property;
      });
      setProperties(map);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [neededPropertyKey]);

  if (!state.user.isLoggedIn) {
    return <LoginRequiredNotice />;
  }

  return (
    <main>
      <PageSection>
        <Container size="wide">
          <h1 className="text-[28px] font-bold text-ink md:text-[32px]">마이페이지</h1>
          <p className="mt-2 text-[14px] text-slate">{state.user.name}님, 안녕하세요.</p>

          <div className="mt-8">
            <ActiveDealCard
              deal={activeDeal}
              property={activeDeal ? properties[activeDeal.propertyId] : undefined}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <VisitScheduleSection properties={properties} />
            <WishlistShortcutCard count={state.wishlist.length} />
            <ListingApplicationsSection applications={state.listingApplications} />
            <AnalysisHistorySection items={state.analysisHistory} />
            <ServiceUsageSection items={state.serviceUsage} />
          </div>
        </Container>
      </PageSection>
    </main>
  );
}
