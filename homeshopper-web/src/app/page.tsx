"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  FileCheck2,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Timer,
  Users,
} from "lucide-react";
import Container from "@/components/layout/Container";
import PageSection from "@/components/layout/PageSection";
import GlassCard from "@/components/ui/GlassCard";
import PropertyCard from "@/components/ui/PropertyCard";
import StartDealModal from "@/components/domain/StartDealModal";
import { getProperty } from "@/lib/api";
import { Property } from "@/lib/types";
import { formatPropertyPrice } from "@/lib/utils";

const TRUST_BADGES = [
  { icon: PhoneCall, label: "전담 담당자 24시간 연락" },
  { icon: FileCheck2, label: "서류 검증" },
  { icon: ShieldCheck, label: "에스크로 안전거래" },
];

const SERVICE_HIGHLIGHTS = [
  {
    icon: Sparkles,
    title: "압축 추천",
    desc: "조건 5가지로 꼭 맞는 매물만 골라드려요.",
    href: "/about#recommend",
  },
  {
    icon: Users,
    title: "동행 임장",
    desc: "전담 담당자가 함께 매물을 확인해요.",
    href: "/about#visit",
  },
  {
    icon: ClipboardCheck,
    title: "서류 체크",
    desc: "등기부·건축물대장을 꼼꼼히 짚어드려요.",
    href: "/about#analysis",
  },
  {
    icon: Timer,
    title: "거래 타임라인",
    desc: "계약부터 잔금까지 일정을 관리해요.",
    href: "/about#timeline",
  },
];

export default function Home() {
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [heroProperties, setHeroProperties] = useState<Property[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all([getProperty("p1"), getProperty("p3")]).then(([front, back]) => {
      if (!active) return;
      setHeroProperties([front, back].filter((p): p is Property => Boolean(p)));
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main>
      {/* 섹션 1 — 히어로 */}
      <section className="flex min-h-[70vh] items-center py-16 md:min-h-[78vh] md:py-0">
        <Container size="wide">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[55%_45%]">
            <div>
              <p className="animate-fade-up bg-grad-primary bg-clip-text text-[15px] font-semibold text-transparent md:text-[16px]">
                매물 찾기부터 안전 결제까지 다 해드려요
              </p>
              <h1 className="mt-2 animate-fade-up text-[34px] font-extrabold leading-tight text-ink [animation-delay:50ms] md:text-[58px] md:leading-[1.1]">
                부동산 거래,
                <br />
                모든 과정을
                <br />
                함께합니다.
              </h1>
              <p className="mt-4 animate-fade-up text-[22px] text-slate [animation-delay:100ms] md:text-[24px]">
                수수료는 법정 상한 요율의{" "}
                <span className="bg-grad-primary bg-clip-text font-bold text-transparent">
                  절반
                </span>
                만 주세요.
              </p>
              <div className="mt-6 flex animate-fade-up flex-wrap gap-2 [animation-delay:200ms]">
                {TRUST_BADGES.map((badge) => (
                  <span
                    key={badge.label}
                    className="glass-surface inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium text-ink"
                  >
                    <badge.icon className="h-3.5 w-3.5 text-brand-blue" />
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="animate-fade-up [animation-delay:150ms]">
              <GlassCard padding={32} className="relative mx-auto w-full max-w-md">
                <div className="relative pb-4 pt-10">
                  {heroProperties[1] && (
                    <div className="absolute -right-3 top-0 hidden w-[82%] rotate-6 opacity-70 sm:block">
                      <PropertyCard
                        layout="grid"
                        imageUrl={heroProperties[1].thumbnail}
                        title={heroProperties[1].title}
                        dealType={heroProperties[1].dealType}
                        address={heroProperties[1].address}
                        price={formatPropertyPrice(heroProperties[1])}
                        area={`${heroProperties[1].areaPyeong}평`}
                        hasElevator={heroProperties[1].elevator}
                        tags={heroProperties[1].tags.slice(0, 2)}
                        consultAvailable={heroProperties[1].badges.includes("상담가능")}
                        verified={heroProperties[1].badges.includes("서류인증완료")}
                        className="pointer-events-none shadow-xl"
                      />
                    </div>
                  )}
                  {heroProperties[0] ? (
                    <div className="relative z-10 -rotate-2">
                      <PropertyCard
                        layout="grid"
                        imageUrl={heroProperties[0].thumbnail}
                        title={heroProperties[0].title}
                        dealType={heroProperties[0].dealType}
                        address={heroProperties[0].address}
                        price={formatPropertyPrice(heroProperties[0])}
                        area={`${heroProperties[0].areaPyeong}평`}
                        hasElevator={heroProperties[0].elevator}
                        tags={heroProperties[0].tags.slice(0, 2)}
                        consultAvailable={heroProperties[0].badges.includes("상담가능")}
                        verified={heroProperties[0].badges.includes("서류인증완료")}
                        className="pointer-events-none !bg-white shadow-2xl"
                      />
                    </div>
                  ) : (
                    <div className="relative z-10 -rotate-2 animate-pulse overflow-hidden rounded-card bg-white/60">
                      <div className="aspect-[16/10] w-full bg-black/5" />
                      <div className="space-y-2 p-5">
                        <div className="h-4 w-2/3 rounded bg-black/10" />
                        <div className="h-3 w-1/2 rounded bg-black/10" />
                        <div className="h-5 w-1/3 rounded bg-black/10" />
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        </Container>
      </section>

      {/* 섹션 2 — 2갈래 진입 카드 */}
      <PageSection className="!pt-0">
        <Container size="wide">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setStartModalOpen(true)}
              className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-card bg-grad-primary p-8 text-left text-white shadow-[0_20px_50px_rgba(0,131,255,0.25)] transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_28px_64px_rgba(0,131,255,0.35)] active:scale-[0.99]"
            >
              <div>
                <span className="text-4xl">🏠</span>
                <h3 className="mt-4 text-2xl font-bold">홈쇼퍼를 통해 거래하기</h3>
                <p className="mt-2 text-white/80">매물 찾기·임장·계약까지 한 번에</p>
              </div>
              <span className="ml-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/20 transition-transform duration-200 group-hover:translate-x-1">
                <ArrowRight className="h-5 w-5" />
              </span>
            </button>

            <Link
              href="/services"
              className="group glass relative flex min-h-[220px] flex-col justify-between p-8 text-ink transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(31,41,72,0.18),0_0_0_1px_rgba(0,131,255,0.12),inset_0_1px_0_rgba(255,255,255,0.7)]"
            >
              <div>
                <span className="text-4xl">🧰</span>
                <h3 className="mt-4 text-2xl font-bold text-ink">다른 서비스 알아보기</h3>
                <p className="mt-2 text-slate">이사·하자보수·대출 조회</p>
              </div>
              <span className="ml-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/5 text-ink transition-transform duration-200 group-hover:translate-x-1">
                <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
          </div>
        </Container>
      </PageSection>

      {/* 섹션 3 — 서비스 훑어보기 */}
      <PageSection className="!pt-0">
        <Container size="wide">
          <h2 className="text-2xl font-bold text-ink md:text-[28px]">서비스 훑어보기</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {SERVICE_HIGHLIGHTS.map((item) => (
              <GlassCard key={item.title} padding={24} className="flex flex-col">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-[16px] font-bold text-ink">{item.title}</h3>
                <p className="mt-1 text-[13px] text-slate">{item.desc}</p>
                <Link
                  href={item.href}
                  className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-brand-blue hover:underline"
                >
                  서비스 설명 보기 <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </GlassCard>
            ))}
          </div>
        </Container>
      </PageSection>

      <StartDealModal open={startModalOpen} onClose={() => setStartModalOpen(false)} />
    </main>
  );
}
