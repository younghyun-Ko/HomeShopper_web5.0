"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Bell, MessageCircle, PhoneCall } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import { getAgent } from "@/lib/api";
import { Agent } from "@/lib/types";
import { cn } from "@/lib/utils";

export type ConsultMethod = "phone" | "kakao" | "app";

interface ConsultMethodOption {
  value: ConsultMethod;
  label: string;
  /** 버튼 안에서는 이 줄 단위로 줄바꿈해서 보여준다 (label은 토스트 등 다른 곳에서 한 줄로 계속 사용) */
  displayLines: string[];
  description: string;
  icon: LucideIcon;
}

const CONSULT_METHODS: ConsultMethodOption[] = [
  {
    value: "phone",
    label: "전화 상담",
    displayLines: ["전화 상담"],
    description: "담당자가 직접 전화드려요",
    icon: PhoneCall,
  },
  {
    value: "kakao",
    label: "카카오톡 알림 및 상담",
    displayLines: ["카카오톡 알림 및", "상담"],
    description: "카카오톡으로 안내드려요",
    icon: MessageCircle,
  },
  {
    value: "app",
    label: "앱 알림 및 상담",
    displayLines: ["앱 알림 및 상담"],
    description: "앱 푸시로 안내드려요",
    icon: Bell,
  },
];

/** 첫 문장과 나머지 문장 사이에서 줄바꿈하기 위해 안내문구를 둘로 나눈다 */
function splitMessageLines(message: string): [string, string | null] {
  const match = message.match(/^(.*?[.!?])\s+([\s\S]*)$/);
  return match ? [match[1], match[2]] : [message, null];
}

export interface AgentAssignedCardProps {
  /** 배정된 담당자의 역할 (예: '전담 매니저') */
  role: Agent["role"];
  /** 배정 안내문구 */
  message: string;
  /** 상담 방식을 선택하고 완료 버튼을 눌렀을 때 호출된다 */
  onComplete: (method: ConsultMethod) => void;
  completeLabel?: string;
  className?: string;
}

export default function AgentAssignedCard({
  role,
  message,
  onComplete,
  completeLabel = "확인",
  className,
}: AgentAssignedCardProps) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [method, setMethod] = useState<ConsultMethod>("phone");
  const [firstLine, secondLine] = splitMessageLines(message);

  useEffect(() => {
    let active = true;
    getAgent(role).then((result) => {
      if (active) setAgent(result ?? null);
    });
    return () => {
      active = false;
    };
  }, [role]);

  return (
    <GlassCard padding={40} className={cn("mx-auto w-full max-w-[640px]", className)}>
      <div className="flex flex-col items-center text-center">
        {agent ? (
          <Image
            src={agent.photo}
            alt={agent.name}
            width={80}
            height={80}
            className="h-20 w-20 rounded-full object-cover shadow-md"
          />
        ) : (
          <div className="h-20 w-20 animate-pulse rounded-full bg-black/10" />
        )}
        <p className="mt-4 text-lg font-bold text-ink">
          {agent ? `${agent.name} ${agent.role}` : "담당자 배정 중이에요"}
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-slate">
          {firstLine}
          {secondLine && (
            <>
              <br />
              {secondLine}
            </>
          )}
        </p>
      </div>

      <div className="mt-8">
        <p className="text-sm font-semibold text-ink">원하는 상담 방식을 선택해주세요</p>
        <div
          role="radiogroup"
          aria-label="상담 방식"
          className="mt-3 grid grid-cols-1 items-stretch gap-3 md:grid-cols-3"
        >
          {CONSULT_METHODS.map((option) => {
            const selected = method === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setMethod(option.value)}
                className={cn(
                  "flex h-full min-h-[128px] rounded-2xl p-[2px] text-left transition-all duration-200",
                  selected ? "bg-grad-primary" : "bg-black/10 hover:bg-black/15",
                )}
              >
                <span className="glass-surface flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-[14px] bg-white/70 px-4 py-5 text-center">
                  <option.icon
                    className={cn("h-5 w-5", selected ? "text-brand-blue" : "text-slate")}
                  />
                  <span className="text-[14px] font-semibold leading-snug text-ink">
                    {option.displayLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                  <span className="text-[12px] text-slate">{option.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <GradientButton
        size="lg"
        fullWidth
        className="mt-8"
        onClick={() => onComplete(method)}
      >
        {completeLabel}
      </GradientButton>
    </GlassCard>
  );
}
