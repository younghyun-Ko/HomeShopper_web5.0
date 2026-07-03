"use client";

import { Check, Clock } from "lucide-react";
import GradientButton from "@/components/ui/GradientButton";
import { cn } from "@/lib/utils";

interface OwnershipChecklistItem {
  label: string;
  description: string;
  done: boolean;
}

const CHECKLIST: OwnershipChecklistItem[] = [
  {
    label: "서류 및 상태 확인",
    description: "전달 받은 서류 및 부동산 상태 재점검",
    done: true,
  },
  {
    label: "등기 신청",
    description: "소유권 이전 등기 신청",
    done: true,
  },
  {
    label: "최종 지급 승인",
    description: "가상 계좌 내 대금 지급",
    done: false,
  },
];

export interface Step3OwnershipTransferProps {
  onComplete: () => void;
  submitting?: boolean;
}

export default function Step3OwnershipTransfer({
  onComplete,
  submitting,
}: Step3OwnershipTransferProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ink">소유권 이전 확인</h2>
        <p className="mt-1 text-[13px] font-semibold text-brand-blue">체크리스트 : 매수자</p>
      </div>

      <div className="space-y-3">
        {CHECKLIST.map((item) => (
          <div
            key={item.label}
            className="glass-surface flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5"
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  item.done ? "bg-success/15 text-success" : "bg-black/5 text-slate",
                )}
              >
                {item.done ? <Check className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
              </span>
              <div>
                <p className="text-[14px] font-bold text-ink">{item.label}</p>
                <p className="text-[12px] text-slate">{item.description}</p>
              </div>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                item.done ? "bg-success/10 text-success" : "bg-black/5 text-slate",
              )}
            >
              {item.done ? "완료" : "미완료"}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[12px] font-medium text-danger">
        ※ 기한 내 미승인 시 플랫폼 자체 검토 후 자동 지급
      </p>

      <GradientButton type="button" size="lg" fullWidth loading={submitting} onClick={onComplete}>
        대금 지급 승인
      </GradientButton>
    </div>
  );
}
