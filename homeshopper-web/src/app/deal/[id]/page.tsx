"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import PageSection from "@/components/layout/PageSection";
import LoginRequiredNotice from "@/components/auth/LoginRequiredNotice";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import { useApp } from "@/context/AppContext";
import { getAgent, getDeal, getProperty, updateDealStage } from "@/lib/api";
import { Agent, Deal, DealStage, Property } from "@/lib/types";
import AgentSidebar from "./_components/AgentSidebar";
import StageProgressBar from "./_components/StageProgressBar";
import Step1PreContract from "./_components/steps/Step1PreContract";
import Step2Escrow from "./_components/steps/Step2Escrow";
import Step3OwnershipTransfer from "./_components/steps/Step3OwnershipTransfer";
import Step4Complete from "./_components/steps/Step4Complete";
import TimelineView from "./_components/TimelineView";
import { nextDashboardStage } from "./_lib/dashboard-utils";

type ViewMode = "steps" | "timeline";

const DASHBOARD_STAGES: DealStage[] = ["계약전", "계약금입금", "소유권이전", "완료"];

export default function DealDashboardPage({ params }: { params: { id: string } }) {
  const { state: appState, upsertDeal } = useApp();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("steps");

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([getDeal(params.id), getAgent("전담 중개사")]).then(
      async ([dealResult, agentResult]) => {
        if (!active) return;
        if (dealResult) {
          setDeal(dealResult);
          const relatedProperty = await getProperty(dealResult.propertyId);
          if (active) setProperty(relatedProperty ?? null);
        }
        setAgent(agentResult ?? null);
        setLoading(false);
      },
    );
    return () => {
      active = false;
    };
  }, [params.id]);

  const handleAdvance = async () => {
    if (!deal) return;
    setAdvancing(true);
    const updated = await updateDealStage(deal.id, nextDashboardStage(deal.stage));
    setAdvancing(false);
    if (updated) {
      setDeal(updated);
      upsertDeal(updated);
    }
  };

  if (!appState.user.isLoggedIn) {
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

  if (!deal || !property || !agent) {
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

  if (!DASHBOARD_STAGES.includes(deal.stage)) {
    return (
      <main>
        <PageSection>
          <Container size="narrow">
            <GlassCard padding={40} className="text-center">
              <p className="text-lg font-bold text-ink">아직 거래가 수락되지 않았어요</p>
              <p className="mt-2 text-[14px] text-slate">
                거래 수락 후 안전 거래 대시보드를 이용할 수 있어요.
              </p>
              <Link href={`/deal/${deal.id}/negotiate`}>
                <GradientButton className="mt-6" fullWidth>
                  거래 협상으로 이동하기
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[28px] font-bold text-ink md:text-[32px]">
                안전 거래 대시보드
              </h1>
              <p className="mt-1 text-[14px] text-slate">{property.title}</p>
            </div>
            <button
              type="button"
              onClick={() => setViewMode((prev) => (prev === "steps" ? "timeline" : "steps"))}
              className="glass-surface inline-flex items-center gap-1.5 self-start rounded-full px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:bg-white/70 sm:self-auto"
            >
              {viewMode === "steps" ? "타임라인 보기" : "단계별 보기"}
            </button>
          </div>

          <StageProgressBar stage={deal.stage} className="mt-8" />

          <div className="mt-10">
            {viewMode === "timeline" ? (
              <TimelineView
                onSubtasksAllDone={() => {
                  if (deal.stage === "계약금입금") handleAdvance();
                }}
              />
            ) : (
              <div className="flex flex-col gap-8 lg:flex-row">
                <div className="w-full lg:w-[320px] lg:shrink-0">
                  <AgentSidebar agent={agent} className="lg:sticky lg:top-28" />
                </div>

                <div className="min-w-0 flex-1">
                  {deal.stage === "계약전" && (
                    <Step1PreContract onComplete={handleAdvance} submitting={advancing} />
                  )}
                  {deal.stage === "계약금입금" && (
                    <Step2Escrow deal={deal} onComplete={handleAdvance} submitting={advancing} />
                  )}
                  {deal.stage === "소유권이전" && (
                    <Step3OwnershipTransfer onComplete={handleAdvance} submitting={advancing} />
                  )}
                  {deal.stage === "완료" && <Step4Complete deal={deal} />}
                </div>
              </div>
            )}
          </div>
        </Container>
      </PageSection>
    </main>
  );
}
