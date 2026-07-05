export type FaqCategory = "수수료·결제" | "매물·추천" | "임장·계약" | "서류·분석";

export interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  "수수료·결제",
  "매물·추천",
  "임장·계약",
  "서류·분석",
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "fee-1",
    category: "수수료·결제",
    question: "정말 수수료가 절반인가요?",
    answer:
      "네, 홈쇼퍼의 중개 수수료는 법정 상한 요율의 1/2, 정찰제예요. 매물 규모나 협상 여부와 관계없이 동일하게 적용돼요.",
  },
  {
    id: "fee-2",
    category: "수수료·결제",
    question: "수수료는 언제 결제하나요?",
    answer:
      "계약 체결 시 절반, 잔금일에 나머지 절반을 결제해요. 사전에 안내받은 정찰 금액 그대로 진행되니 추가 비용 걱정은 하지 않으셔도 돼요.",
  },
  {
    id: "fee-3",
    category: "수수료·결제",
    question: "에스크로 가상계좌는 안전한가요?",
    answer:
      "계약금·잔금은 제휴 금융사의 에스크로 가상계좌를 통해 거래돼요. 매도인에게 직접 송금하지 않아 송금 사고를 예방할 수 있어요.",
  },
  {
    id: "property-1",
    category: "매물·추천",
    question: "추천 매물은 어떤 기준으로 선별되나요?",
    answer:
      "보증금, 위치, 평수, 엘리베이터 유무 등 남겨주신 조건 5가지를 기준으로 조건에 맞는 매물만 추려서 보여드려요.",
  },
  {
    id: "property-2",
    category: "매물·추천",
    question: "원하는 매물이 추천에 없으면요?",
    answer: "조건을 다시 조정하시거나 담당자에게 원하시는 매물 특징을 말씀해 주시면 추가로 찾아드려요.",
  },
  {
    id: "property-3",
    category: "매물·추천",
    question: "이미 봐둔 매물로도 진행할 수 있나요?",
    answer: "네, 매물 링크만 남겨주시면 전담 담당자가 확인 후 이어서 진행해 드려요.",
  },
  {
    id: "visit-1",
    category: "임장·계약",
    question: "임장은 어떻게 진행되나요?",
    answer:
      "관심 매물을 장바구니에 담고 원하는 날짜·시간을 고르면, 담당자가 일정에 맞춰 함께 임장을 도와드려요.",
  },
  {
    id: "visit-2",
    category: "임장·계약",
    question: "여러 매물을 하루에 볼 수 있나요?",
    answer:
      "네, 관심 매물을 여러 개 담아두면 동선에 맞춰 묶어서 한 번에 도는 묶음 임장으로 진행할 수 있어요.",
  },
  {
    id: "visit-3",
    category: "임장·계약",
    question: "계약 당일 무엇을 준비해야 하나요?",
    answer: "신분증과 도장(또는 서명), 계약금을 준비해 주시면 돼요. 나머지 서류는 담당자가 미리 안내해 드려요.",
  },
  {
    id: "analysis-1",
    category: "서류·분석",
    question: "서류 분석은 법적 효력이 있나요?",
    answer:
      "아니요. 서류 분석은 계약 전 유심히 봐야 할 포인트를 안내해 드리는 참고용 서비스예요. 본 안내는 참고용이며 법적 효력이 없습니다. 전문가 확인을 권장합니다.",
  },
  {
    id: "analysis-2",
    category: "서류·분석",
    question: "어떤 서류를 확인해주나요?",
    answer: "등기부등본과 건축물대장을 중심으로 권리관계, 위반건축물 여부 등 핵심 항목을 확인해 드려요.",
  },
  {
    id: "analysis-3",
    category: "서류·분석",
    question: "확인이 필요한 항목은 어떻게 알 수 있나요?",
    answer:
      "체크포인트별로 '이상 없음'과 '확인 필요'로 구분해 안내해 드려요. 확인이 필요한 항목은 왜 중요한지와 중개사에게 물어볼 질문까지 함께 알려드려요.",
  },
];
