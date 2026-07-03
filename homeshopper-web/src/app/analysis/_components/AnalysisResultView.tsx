"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import { AnalysisResult, Property } from "@/lib/types";
import { cn } from "@/lib/utils";
import CheckpointCard from "./CheckpointCard";

export interface AnalysisResultViewProps {
  property: Property;
  analysis: AnalysisResult;
}

export default function AnalysisResultView({ property, analysis }: AnalysisResultViewProps) {
  const router = useRouter();

  const checkpoints = [
    analysis.registry[0],
    analysis.registry[1],
    analysis.building[0],
    analysis.priceCheck,
  ].filter(Boolean);

  const overallOk = checkpoints.every((checkpoint) => checkpoint.level === "ok");
  const hasRightsRisk = [...analysis.registry, ...analysis.building].some(
    (checkpoint) => checkpoint.level !== "ok",
  );
  const hasPriceRisk = analysis.priceCheck.level !== "ok";
  const summaryLine = `권리관계와 임대차 리스크 관련 ${
    hasRightsRisk ? "확인이 필요한 항목이 있고" : "특이사항이 확인되지 않았고"
  } 보증금/월세 조건은 ${hasPriceRisk ? "시세보다 다소 높게" : "시세 범위로"} 확인되었습니다.`;

  return (
    <div className="mt-8">
      {/* 종합 헤더 카드 */}
      <GlassCard padding={32} className="flex items-start gap-5">
        <span
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-full",
            overallOk ? "bg-success/15 text-success" : "bg-caution/15 text-caution",
          )}
        >
          {overallOk ? (
            <CheckCircle2 className="h-7 w-7" />
          ) : (
            <AlertTriangle className="h-7 w-7" />
          )}
        </span>
        <div className="min-w-0">
          <span
            className={cn(
              "inline-block rounded-full px-2.5 py-1 text-[12px] font-semibold",
              overallOk ? "bg-success/10 text-success" : "bg-caution/10 text-caution",
            )}
          >
            {overallOk ? "특이사항 없음" : "확인 필요"}
          </span>
          <h2 className="mt-2 text-[20px] font-bold text-ink">{analysis.headline}</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-slate">{summaryLine}</p>
        </div>
      </GlassCard>

      {/* 체크포인트 2x2 그리드 */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {checkpoints.map((checkpoint) => (
          <CheckpointCard key={checkpoint.title} checkpoint={checkpoint} />
        ))}
      </div>

      {/* RECOMMENDATION */}
      <div
        className="mt-6 rounded-card border border-brand-purple/20 p-8"
        style={{
          background: "rgba(140, 100, 240, 0.10)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          boxShadow: "0 8px 32px rgba(31,41,72,0.10), inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
      >
        <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-brand-purple">
          Recommendation
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-ink">{analysis.recommendation}</p>
      </div>

      {/* CTA */}
      <div className="mt-8 flex justify-center">
        <GradientButton
          type="button"
          size="lg"
          onClick={() => router.push(`/properties/${property.id}`)}
        >
          이 매물로 거래 진행하기
        </GradientButton>
      </div>

      {/* 법적 고지 — 항상 고정 노출 */}
      <p className="mt-8 text-center text-[12px] text-slate">
        ※ 본 안내는 참고용이며 법적 효력이 없습니다. 전문가 확인을 권장합니다.
      </p>
    </div>
  );
}
