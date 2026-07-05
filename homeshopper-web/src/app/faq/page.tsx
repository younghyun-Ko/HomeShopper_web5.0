import type { Metadata } from "next";
import PageSection from "@/components/layout/PageSection";
import FaqPageContent from "./_components/FaqPageContent";

export const metadata: Metadata = {
  title: "자주 묻는 질문 | 홈쇼퍼",
  description: "수수료·결제, 매물·추천, 임장·계약, 서류·분석까지 홈쇼퍼 이용이 궁금할 때 찾아보세요.",
};

export default function FaqPage() {
  return (
    <main>
      <PageSection>
        <FaqPageContent />
      </PageSection>
    </main>
  );
}
