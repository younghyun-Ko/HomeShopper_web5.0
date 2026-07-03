"use client";

import { useRouter } from "next/navigation";
import AgentAssignedCard from "@/components/domain/AgentAssignedCard";
import Container from "@/components/layout/Container";
import PageSection from "@/components/layout/PageSection";
import { useToast } from "@/components/ui/Toast";
import type { ConsultMethod } from "@/components/domain/AgentAssignedCard";

const CONSULT_METHOD_LABEL: Record<ConsultMethod, string> = {
  phone: "전화 상담",
  kakao: "카카오톡 알림 및 상담",
  app: "앱 알림 및 상담",
};

export default function StartLinkAssignedPage() {
  const router = useRouter();
  const showToast = useToast();

  const handleComplete = (method: ConsultMethod) => {
    showToast({
      title: "상담 방식이 설정됐어요",
      description: `${CONSULT_METHOD_LABEL[method]}로 안내드릴게요.`,
      variant: "success",
    });
    router.push("/");
  };

  return (
    <main>
      <PageSection>
        <Container size="wide">
          <AgentAssignedCard
            role="전담 매니저"
            message="회원님 전담 담당자가 배정되었습니다. 담당자가 해당 매물의 거래 정보, 허위매물 여부 등을 점검하여 24시간 내로 연락드리겠습니다."
            onComplete={handleComplete}
          />
        </Container>
      </PageSection>
    </main>
  );
}
