import { Suspense } from "react";
import type { Metadata } from "next";
import PageSection from "@/components/layout/PageSection";
import ConsultPageContent from "./_components/ConsultPageContent";

export const metadata: Metadata = {
  title: "상담·매물 등록 신청 | 홈쇼퍼",
  description: "매수·임차 상담 신청 또는 매도·임대 매물 등록을 신청해요.",
};

export default function ConsultPage() {
  return (
    <main>
      <PageSection>
        <Suspense fallback={null}>
          <ConsultPageContent />
        </Suspense>
      </PageSection>
    </main>
  );
}
