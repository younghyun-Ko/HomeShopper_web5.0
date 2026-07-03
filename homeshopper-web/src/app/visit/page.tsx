"use client";

import { useEffect, useState } from "react";
import Container from "@/components/layout/Container";
import PageSection from "@/components/layout/PageSection";
import SegmentControl from "@/components/ui/SegmentControl";
import { useApp } from "@/context/AppContext";
import { getProperty } from "@/lib/api";
import { Property } from "@/lib/types";
import CartTab from "./_components/CartTab";
import StatusTab from "./_components/StatusTab";

type VisitTab = "cart" | "status";

const TAB_OPTIONS: { label: string; value: VisitTab }[] = [
  { label: "임장 장바구니", value: "cart" },
  { label: "내 임장 현황", value: "status" },
];

export default function VisitPage() {
  const { state } = useApp();
  const [tab, setTab] = useState<VisitTab>("cart");
  const [properties, setProperties] = useState<Record<string, Property>>({});
  const [loading, setLoading] = useState(true);
  const cartKey = state.visitCart.map((item) => item.propertyId).join(",");

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all(state.visitCart.map((item) => getProperty(item.propertyId))).then((list) => {
      if (!active) return;
      const map: Record<string, Property> = {};
      list.forEach((property) => {
        if (property) map[property.id] = property;
      });
      setProperties(map);
      setLoading(false);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartKey]);

  return (
    <main>
      <PageSection>
        <Container size="wide">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <h1 className="text-[28px] font-bold text-ink md:text-[32px]">임장·관리</h1>
            <SegmentControl options={TAB_OPTIONS} value={tab} onChange={setTab} />
          </div>

          <div className="mt-10">
            {tab === "cart" ? (
              <CartTab properties={properties} loading={loading} onApplied={() => setTab("status")} />
            ) : (
              <StatusTab properties={properties} loading={loading} onEdit={() => setTab("cart")} />
            )}
          </div>
        </Container>
      </PageSection>
    </main>
  );
}
