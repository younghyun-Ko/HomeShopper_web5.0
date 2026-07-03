"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/components/layout/Container";
import SegmentControl from "@/components/ui/SegmentControl";
import BuyerRenterForm from "./BuyerRenterForm";
import InfoSidebar, { ConsultTab } from "./InfoSidebar";
import SellerLandlordForm from "./SellerLandlordForm";

const TAB_OPTIONS: { label: string; value: ConsultTab }[] = [
  { label: "매수·임차", value: "buyer" },
  { label: "매도·임대", value: "seller" },
];

export default function ConsultPageContent() {
  const searchParams = useSearchParams();
  const prefillParam = searchParams.get("prefill");
  const prefillIds = useMemo(
    () => (prefillParam ? prefillParam.split(",").filter(Boolean) : []),
    [prefillParam],
  );
  const [tab, setTab] = useState<ConsultTab>("buyer");

  return (
    <Container size="wide">
      <SegmentControl options={TAB_OPTIONS} value={tab} onChange={setTab} />

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[40%_60%] md:gap-12">
        <InfoSidebar tab={tab} />
        <div>
          {tab === "buyer" ? (
            <BuyerRenterForm prefillIds={prefillIds} />
          ) : (
            <SellerLandlordForm />
          )}
        </div>
      </div>
    </Container>
  );
}
