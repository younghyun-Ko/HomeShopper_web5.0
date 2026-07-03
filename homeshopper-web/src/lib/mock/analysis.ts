import { AnalysisResult } from "@/lib/types";

/** 안전 케이스 — 확인이 필요한 항목이 거의 없는 서류 */
export const safeCase: AnalysisResult = {
  propertyId: "p1",
  headline: "계약 검토를 진행해도 좋은 조건입니다",
  registry: [
    {
      level: "ok",
      title: "근저당권",
      status: "설정 없음",
      description: "등기부상 선순위 담보권이 확인되지 않습니다.",
    },
    {
      level: "ok",
      title: "가압류·가처분",
      status: "해당 없음",
      description: "가압류, 가처분 등 권리침해 이력이 확인되지 않습니다.",
    },
  ],
  building: [
    {
      level: "ok",
      title: "위반건축물",
      status: "해당 없음",
      description: "건축물대장에 위반건축물로 등재되어 있지 않습니다.",
    },
  ],
  priceCheck: {
    level: "ok",
    title: "호가 적정성",
    status: "적정 범위",
    description: "주변 실거래가 대비 5% 이내의 적정한 가격대로 확인됩니다.",
  },
  recommendation:
    "등기부와 건축물대장에서 확인이 필요한 항목이 발견되지 않았어요. 계약 전 원본 서류는 꼭 다시 한 번 확인해 주세요.",
};

/** 주의 케이스 — 계약 전 반드시 확인이 필요한 항목이 있는 서류 */
export const cautionCase: AnalysisResult = {
  propertyId: "p3",
  headline: "계약 전 확인이 필요한 항목이 있습니다",
  registry: [
    {
      level: "caution",
      title: "근저당권",
      status: "확인 필요",
      description: "채권최고액 8,000만원의 근저당권이 설정되어 있습니다.",
      whyItMatters:
        "보증금보다 근저당 금액이 크면 경매 시 보증금을 돌려받지 못할 수 있어요.",
      questionsForAgent: [
        "근저당권 설정 이유가 무엇인가요?",
        "계약 전 말소가 가능한가요?",
      ],
    },
    {
      level: "ok",
      title: "가압류·가처분",
      status: "해당 없음",
      description: "가압류, 가처분 등 권리침해 이력이 확인되지 않습니다.",
    },
  ],
  building: [
    {
      level: "danger",
      title: "위반건축물",
      status: "위반건축물 등재",
      description: "옥탑 증축분이 위반건축물로 등재되어 있습니다.",
      whyItMatters: "위반건축물은 대출 제한 및 이행강제금 부과 대상이 될 수 있어요.",
      questionsForAgent: ["위반 사항이 언제 해소될 예정인가요?"],
    },
  ],
  priceCheck: {
    level: "caution",
    title: "호가 적정성",
    status: "다소 높음",
    description: "주변 실거래가 대비 8% 높게 책정되어 있습니다.",
    whyItMatters: "시세보다 높은 가격은 향후 매도나 재계약 시 불리하게 작용할 수 있어요.",
    questionsForAgent: ["호가 산정 근거를 확인할 수 있을까요?"],
  },
  recommendation:
    "근저당권 설정과 위반건축물 등재 등 확인이 필요한 항목이 있어요. 계약 전 중개사에게 반드시 확인해 주세요.",
};

export const analysisResults: AnalysisResult[] = [safeCase, cautionCase];

export function getAnalysisByPropertyId(propertyId: string): AnalysisResult | undefined {
  return analysisResults.find((result) => result.propertyId === propertyId);
}
