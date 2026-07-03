"use client";

import Image from "next/image";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import { Agent } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface AgentSidebarProps {
  agent: Agent;
  className?: string;
}

function MaskedRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-left">
      <span className="shrink-0 text-[12px] text-slate">{label}</span>
      <span className="text-right text-[13px] font-medium text-ink">{value}</span>
    </div>
  );
}

export default function AgentSidebar({ agent, className }: AgentSidebarProps) {
  return (
    <GlassCard padding={24} className={cn("text-center", className)}>
      <span className="inline-flex items-center gap-1 rounded-full bg-caution/10 px-2.5 py-1 text-[11px] font-semibold text-caution">
        Safe Trader 👑
      </span>

      <Image
        src={agent.photo}
        alt={agent.name}
        width={80}
        height={80}
        className="mx-auto mt-4 h-20 w-20 rounded-full object-cover shadow-md"
      />
      <p className="mt-3 text-[16px] font-bold text-ink">{agent.name}</p>
      <p className="text-[12px] text-slate">{agent.role}</p>

      <div className="mt-4 space-y-2 border-t border-black/5 pt-4">
        <MaskedRow label="주민등록번호" value="650110-XXXXXXX" />
        <MaskedRow label="주소" value="서울특별시 서초구 서초대로 46길 XX" />
        <MaskedRow label="안심번호" value="0505-432-XXXX" />
      </div>

      <div className="mt-6 flex gap-2">
        <GradientButton
          type="button"
          variant="secondary"
          fullWidth
          onClick={() => alert(`${agent.name} 중개사에게 전화를 겁니다. (mock)`)}
        >
          통화하기
        </GradientButton>
        <GradientButton
          type="button"
          fullWidth
          onClick={() => alert(`${agent.name} 중개사와 채팅을 시작합니다. (mock)`)}
        >
          채팅하기
        </GradientButton>
      </div>
    </GlassCard>
  );
}
