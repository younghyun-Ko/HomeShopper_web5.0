"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AgentAssignedCard from "@/components/domain/AgentAssignedCard";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import Modal from "@/components/ui/Modal";
import PropertyCard from "@/components/ui/PropertyCard";
import { useToast } from "@/components/ui/Toast";
import { useApp } from "@/context/AppContext";
import { createVisit } from "@/lib/api";
import { Property } from "@/lib/types";
import { useRequireLogin } from "@/lib/useRequireLogin";
import { formatPropertyPrice } from "@/lib/utils";
import { formatMonthDay, formatTimeLabel } from "../_lib/date-utils";
import { useIsDesktop } from "../_lib/useIsDesktop";
import ScheduleWidget from "./ScheduleWidget";

export interface CartTabProps {
  properties: Record<string, Property>;
  loading: boolean;
  onApplied: () => void;
}

export default function CartTab({ properties, loading, onApplied }: CartTabProps) {
  const router = useRouter();
  const showToast = useToast();
  const isDesktop = useIsDesktop();
  const { state, scheduleVisit } = useApp();
  const { requireLogin, guardModal } = useRequireLogin();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);

  const scheduledCount = state.visitCart.filter((item) => item.scheduledAt).length;
  const selectedItem = state.visitCart.find((item) => item.propertyId === selectedId);
  const selectedProperty = selectedId ? properties[selectedId] : undefined;

  const handleSelectSchedule = (propertyId: string) => {
    setSelectedId(propertyId);
    if (!isDesktop) setMobileModalOpen(true);
  };

  const handleConfirm = (propertyId: string) => (date: string, time: string) => {
    scheduleVisit(propertyId, date, time);
    showToast({ title: "임장 일정을 담았어요", variant: "success" });
    setMobileModalOpen(false);
  };

  const submitApplication = async () => {
    const scheduled = state.visitCart.filter((item) => item.scheduledAt);
    if (scheduled.length === 0) return;
    setSubmitting(true);
    await Promise.all(
      scheduled.map((item) =>
        createVisit(item.propertyId, item.scheduledAt!.date, item.scheduledAt!.time),
      ),
    );
    setSubmitting(false);
    setCompleteOpen(true);
  };

  const handleSubmit = () => requireLogin(submitApplication);

  if (!loading && state.visitCart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <p className="text-[16px] font-semibold text-ink">임장 장바구니가 비어있어요</p>
        <p className="text-[14px] text-slate">추천 매물에서 관심 있는 곳을 담아보세요.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:items-start">
        {/* 좌측 60% */}
        <div className="space-y-4 lg:col-span-3">
          {state.visitCart.map((item) => {
            const property = properties[item.propertyId];
            if (!property) return null;
            return (
              <div key={item.propertyId}>
                <PropertyCard
                  layout="row"
                  href={`/properties/${property.id}`}
                  imageUrl={property.thumbnail}
                  title={property.title}
                  dealType={property.dealType}
                  address={property.address}
                  price={formatPropertyPrice(property)}
                  actionSlot={
                    <div className="flex flex-col items-end gap-2">
                      {item.scheduledAt && (
                        <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-[12px] font-semibold text-brand-blue">
                          {formatMonthDay(item.scheduledAt.date)} ·{" "}
                          {formatTimeLabel(item.scheduledAt.time)}
                        </span>
                      )}
                      {item.visited ? (
                        <GradientButton
                          type="button"
                          size="md"
                          onClick={() => router.push(`/analysis?propertyId=${item.propertyId}`)}
                        >
                          매물 서류 분석
                        </GradientButton>
                      ) : (
                        <GradientButton
                          type="button"
                          size="md"
                          variant={selectedId === item.propertyId ? "primary" : "secondary"}
                          onClick={() => handleSelectSchedule(item.propertyId)}
                        >
                          {item.scheduledAt ? "일정 변경" : "임장 일정 선택"}
                        </GradientButton>
                      )}
                    </div>
                  }
                />
                {item.visited && (
                  <p className="mt-2 px-1 text-[12px] text-slate">
                    플랫폼이 해당 매물의 등기부등본·건축물대장 위험요소를 점검해 드려요
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* 우측 40% sticky — 데스크톱 전용 */}
        <div className="hidden lg:col-span-2 lg:block">
          <GlassCard padding={24} className="lg:sticky lg:top-28">
            {selectedProperty ? (
              <ScheduleWidget
                key={selectedProperty.id}
                property={selectedProperty}
                initialDate={selectedItem?.scheduledAt?.date}
                initialTime={selectedItem?.scheduledAt?.time}
                onConfirm={handleConfirm(selectedProperty.id)}
              />
            ) : (
              <p className="py-10 text-center text-[14px] text-slate">
                좌측에서 매물의 &quot;임장 일정 선택&quot;을 눌러주세요.
              </p>
            )}
          </GlassCard>
        </div>
      </div>

      {/* 모바일 바텀시트 */}
      <Modal
        open={mobileModalOpen}
        onClose={() => setMobileModalOpen(false)}
        title="임장 일정 선택"
      >
        {selectedProperty && (
          <ScheduleWidget
            key={selectedProperty.id}
            property={selectedProperty}
            initialDate={selectedItem?.scheduledAt?.date}
            initialTime={selectedItem?.scheduledAt?.time}
            onConfirm={handleConfirm(selectedProperty.id)}
          />
        )}
      </Modal>

      <div className="mt-8">
        <GradientButton
          type="button"
          size="lg"
          fullWidth
          disabled={scheduledCount === 0}
          loading={submitting}
          onClick={handleSubmit}
        >
          임장 신청하기 ({scheduledCount}건)
        </GradientButton>
      </div>

      <Modal
        open={completeOpen}
        onClose={() => setCompleteOpen(false)}
        title="임장 신청 완료"
      >
        <AgentAssignedCard
          role="임장 중개보조원"
          message="회원님 전담 임장 중개 보조원이 배정되었습니다. 담당자가 약속 장소 선정을 위해 2시간 내로 연락드리겠습니다."
          completeLabel="확인"
          onComplete={() => {
            setCompleteOpen(false);
            onApplied();
          }}
        />
      </Modal>
      {guardModal}
    </div>
  );
}
