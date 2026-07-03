"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/components/layout/Container";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import PropertyCard from "@/components/ui/PropertyCard";
import { useApp } from "@/context/AppContext";
import { getAnalysis, getProperty, parsePropertyLink } from "@/lib/api";
import { AnalysisResult, Property } from "@/lib/types";
import { formatPropertyPrice } from "@/lib/utils";
import AnalysisResultView from "./AnalysisResultView";

const LOADING_DURATION_MS = 1500;

type Phase = "input" | "loading" | "result";

export default function AnalysisPageContent() {
  const searchParams = useSearchParams();
  const propertyIdParam = searchParams.get("propertyId");
  const { addAnalysisHistory } = useApp();

  const [property, setProperty] = useState<Property | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [phase, setPhase] = useState<Phase>(propertyIdParam ? "loading" : "input");
  const [address, setAddress] = useState("");
  const [addressSubmitting, setAddressSubmitting] = useState(false);

  // propertyId 쿼리로 진입한 경우 매물 정보를 불러온다
  useEffect(() => {
    if (!propertyIdParam) return;
    let active = true;
    getProperty(propertyIdParam).then((result) => {
      if (active && result) setProperty(result);
    });
    return () => {
      active = false;
    };
  }, [propertyIdParam]);

  // 매물이 정해지면 분석을 시작한다 (최소 1.5초는 로딩 화면을 유지한다)
  useEffect(() => {
    if (!property) return;
    let active = true;
    setPhase("loading");
    const startedAt = Date.now();
    getAnalysis(property.id).then((result) => {
      if (!active) return;
      const remaining = Math.max(0, LOADING_DURATION_MS - (Date.now() - startedAt));
      window.setTimeout(() => {
        if (!active) return;
        setAnalysis(result);
        setPhase("result");

        const checkpoints = [
          result.registry[0],
          result.registry[1],
          result.building[0],
          result.priceCheck,
        ].filter(Boolean);
        addAnalysisHistory({
          id: `analysis-${Date.now()}`,
          propertyId: property.id,
          propertyTitle: property.title,
          headline: result.headline,
          overallOk: checkpoints.every((checkpoint) => checkpoint.level === "ok"),
          analyzedAt: new Date().toISOString().slice(0, 10),
        });
      }, remaining);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property]);

  const handleAddressSubmit = async () => {
    if (!address.trim()) return;
    setAddressSubmitting(true);
    const result = await parsePropertyLink(address.trim());
    setAddressSubmitting(false);
    setProperty(result);
  };

  return (
    <Container size="wide">
      {property && (
        <div className="mb-8">
          <PropertyCard
            layout="row"
            imageUrl={property.thumbnail}
            title={property.title}
            dealType={property.dealType}
            address={property.address}
            price={formatPropertyPrice(property)}
          />
        </div>
      )}

      {phase === "input" && (
        <div className="mx-auto max-w-[640px]">
          <GlassCard padding={40}>
            <p className="text-lg font-bold text-ink">분석할 매물 주소를 입력하세요</p>
            <input
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="예: 서울 관악구 봉천동 산101-2"
              className="glass-surface mt-4 h-12 w-full rounded-2xl px-4 text-[15px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
            />
            <GradientButton
              type="button"
              fullWidth
              className="mt-4"
              disabled={!address.trim()}
              loading={addressSubmitting}
              onClick={handleAddressSubmit}
            >
              서류 불러오기
            </GradientButton>
          </GlassCard>
        </div>
      )}

      {phase === "loading" && (
        <GlassCard
          padding={48}
          className="mx-auto flex w-full max-w-[640px] flex-col items-center justify-center gap-4 py-16 text-center"
        >
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-transparent [border-right-color:var(--purple)] [border-top-color:var(--blue)]" />
          <p className="text-[15px] font-semibold text-ink">
            등기부등본·건축물대장 불러오는 중...
          </p>
        </GlassCard>
      )}

      {phase === "result" && analysis && property && (
        <AnalysisResultView property={property} analysis={analysis} />
      )}
    </Container>
  );
}
