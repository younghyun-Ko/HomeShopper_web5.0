"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import Container from "@/components/layout/Container";
import PageSection from "@/components/layout/PageSection";
import GlassCard from "@/components/ui/GlassCard";
import { useToast } from "@/components/ui/Toast";
import { NAV_LABELS } from "@/lib/constants";
import { SERVICE_CATEGORIES } from "./_lib/categories";

export default function ServicesPage() {
  const showToast = useToast();
  const [manualOpen, setManualOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [locationLabel, setLocationLabel] = useState<string | null>(null);

  const handleUseCurrentLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      showToast({ title: "이 브라우저는 위치 확인을 지원하지 않아요", variant: "caution" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationLabel(
          `위도 ${position.coords.latitude.toFixed(3)}, 경도 ${position.coords.longitude.toFixed(3)}`,
        );
        setManualOpen(false);
        showToast({ title: "현재 위치를 확인했어요", variant: "success" });
      },
      () => {
        showToast({
          title: "위치 정보를 가져올 수 없어요",
          description: "브라우저 설정에서 위치 권한을 허용해주세요.",
          variant: "caution",
        });
      },
    );
  };

  return (
    <main>
      <PageSection>
        <Container size="wide">
          <h1 className="text-[28px] font-bold text-ink md:text-[32px]">
            {NAV_LABELS.linkedServices}
          </h1>
          <p className="mt-2 text-[15px] text-slate">어떤 도움이 필요하세요?</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="glass-surface inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-[14px] font-semibold text-ink transition-colors hover:bg-white/70"
            >
              <MapPin className="h-4 w-4 text-brand-blue" />
              현재 위치 사용
            </button>
            <button
              type="button"
              onClick={() => setManualOpen((prev) => !prev)}
              className="text-[13px] font-medium text-slate underline-offset-2 hover:text-ink hover:underline"
            >
              주소 직접 입력
            </button>
            {locationLabel && !manualOpen && (
              <span className="text-[13px] text-slate">{locationLabel}</span>
            )}
          </div>

          {manualOpen && (
            <input
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="주소를 입력하세요"
              className="glass-surface mt-3 h-12 w-full max-w-md rounded-2xl px-4 text-[15px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
            />
          )}

          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
            {SERVICE_CATEGORIES.map((category) => (
              <Link key={category.slug} href={category.href}>
                <GlassCard
                  padding={32}
                  onClick={() => undefined}
                  className="flex h-full flex-col items-center justify-center gap-3 text-center"
                >
                  <span className="text-5xl leading-none">{category.emoji}</span>
                  <span className="text-[17px] font-bold text-ink">{category.label}</span>
                </GlassCard>
              </Link>
            ))}
          </div>
        </Container>
      </PageSection>
    </main>
  );
}
