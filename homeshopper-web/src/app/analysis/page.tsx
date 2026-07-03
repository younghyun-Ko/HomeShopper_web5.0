import { Suspense } from "react";
import type { Metadata } from "next";
import PageSection from "@/components/layout/PageSection";
import AnalysisPageContent from "./_components/AnalysisPageContent";

export const metadata: Metadata = {
  title: "매물 서류 분석 | 홈쇼퍼",
  description: "등기부등본·건축물대장을 바탕으로 확인이 필요한 항목을 안내해 드려요.",
};

export default function AnalysisPage() {
  return (
    <main>
      <PageSection>
        <Suspense fallback={null}>
          <AnalysisPageContent />
        </Suspense>
      </PageSection>
    </main>
  );
}
