"use client";

import { FileCheck } from "lucide-react";
import GradientButton from "@/components/ui/GradientButton";
import ResponsiveTable, { ResponsiveTableColumn } from "@/components/ui/ResponsiveTable";

interface ChecklistRow {
  category: string;
  item: string;
  point: string;
}

const PREP_COLUMNS: ResponsiveTableColumn<ChecklistRow>[] = [
  {
    key: "category",
    label: "구분",
    width: "15%",
    render: (row) => (
      <span className="inline-flex items-center rounded-full bg-brand-blue/10 px-2.5 py-1 text-[12px] font-semibold text-brand-blue">
        {row.category}
      </span>
    ),
  },
  {
    key: "item",
    label: "항목",
    width: "20%",
    render: (row) => <span className="font-bold text-ink">{row.item}</span>,
  },
  { key: "point", label: "핵심 포인트", width: "65%" },
];

const PREP_ROWS: ChecklistRow[] = [
  {
    category: "사전 준비",
    item: "이체 한도",
    point: "계약금(통상 10%) 현장 이체용 1일 한도 증액 및 OTP 작동 확인",
  },
  {
    category: "사전 준비",
    item: "서류 열람",
    point: "계약 당일 발급된 등기부등본(권리관계) 및 건축물대장(불법건축물) 확인",
  },
  {
    category: "당일 지참",
    item: "신분증",
    point: "실물 신분증(주민등록증, 운전면허증 등) 또는 모바일 신분증",
  },
  {
    category: "당일 지참",
    item: "도장",
    point: "막도장 가능 (서명이나 지장도 효력 있으나 관행상 도장 지참 권장)",
  },
];

const CHECKLIST_ROWS: ChecklistRow[] = [
  {
    category: "확인",
    item: "신분 대조",
    point: "매도인·매수인 신분증과 등기부등본상 명의가 일치하는지 확인합니다.",
  },
  {
    category: "확인",
    item: "대리인 계약",
    point: "대리인 참석 시 위임장·인감증명서·대리인 신분증을 반드시 확인합니다.",
  },
  {
    category: "특약",
    item: "하자 담보",
    point: "잔금일 전 발견된 중대한 누수나 하자는 매도인이 책임지고 수리한다 명문화",
  },
  {
    category: "특약",
    item: "권리 보전",
    point:
      "잔금일(소유권 이전 등기일) 익일까지 새로운 근저당 설정 금지, 위반 시 배액 배상 명문화",
  },
];

const DOCUMENTS = [
  "부동산 매매계약서 원본",
  "계약금 영수증(매도인 서명 또는 날인 필수)",
  "중개대상물 확인·설명서",
  "공제증서",
];

export interface Step1PreContractProps {
  onComplete: () => void;
  submitting?: boolean;
}

export default function Step1PreContract({ onComplete, submitting }: Step1PreContractProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-ink">계약 체결 준비물</h2>
      </div>

      <div>
        <h3 className="text-[15px] font-bold text-ink">매수자 준비 및 확인 사항</h3>
        <ResponsiveTable columns={PREP_COLUMNS} rows={PREP_ROWS} rowKey={(row) => row.item} className="mt-3" />
      </div>

      <div>
        <h3 className="text-[15px] font-bold text-ink">현장 계약 필수 체크리스트</h3>
        <ResponsiveTable
          columns={PREP_COLUMNS}
          rows={CHECKLIST_ROWS}
          rowKey={(row) => row.item}
          className="mt-3"
        />
      </div>

      <div>
        <h3 className="text-[15px] font-bold text-ink">계약 직후 챙겨야 할 서류 목록</h3>
        <ul className="mt-3 space-y-2">
          {DOCUMENTS.map((document) => (
            <li
              key={document}
              className="glass-surface flex items-center gap-2.5 rounded-2xl px-4 py-3 text-[14px] text-ink"
            >
              <FileCheck className="h-4 w-4 shrink-0 text-brand-blue" />
              {document}
            </li>
          ))}
        </ul>
      </div>

      <GradientButton type="button" size="lg" fullWidth loading={submitting} onClick={onComplete}>
        계약 체결 완료
      </GradientButton>
    </div>
  );
}
