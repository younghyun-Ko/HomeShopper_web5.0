"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, MapPin, Star } from "lucide-react";
import Container from "@/components/layout/Container";
import PageSection from "@/components/layout/PageSection";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import Modal from "@/components/ui/Modal";
import { useApp } from "@/context/AppContext";
import { getVendors } from "@/lib/api";
import { ServiceVendor } from "@/lib/types";
import { getCategoryLabel, isVendorCategory } from "../_lib/categories";

export default function ServiceCategoryPage({ params }: { params: { category: string } }) {
  const categorySlug = decodeURIComponent(params.category);
  const { addServiceUsage } = useApp();
  const [vendors, setVendors] = useState<ServiceVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<ServiceVendor | null>(null);

  const valid = isVendorCategory(categorySlug);

  useEffect(() => {
    if (!valid) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    getVendors(categorySlug).then((result) => {
      if (!active) return;
      setVendors(result);
      setLoading(false);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug]);

  if (!valid) {
    return (
      <main>
        <PageSection>
          <Container size="narrow">
            <GlassCard padding={40} className="text-center">
              <p className="text-lg font-bold text-ink">찾을 수 없는 카테고리예요</p>
              <Link href="/services">
                <GradientButton className="mt-6" fullWidth>
                  서비스 목록으로 돌아가기
                </GradientButton>
              </Link>
            </GlassCard>
          </Container>
        </PageSection>
      </main>
    );
  }

  return (
    <main>
      <PageSection>
        <Container size="wide">
          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-[14px] font-medium text-slate transition-colors hover:text-ink"
          >
            <ChevronLeft className="h-4 w-4" />
            서비스 목록
          </Link>

          <h1 className="mt-4 text-[28px] font-bold text-ink md:text-[32px]">
            {getCategoryLabel(categorySlug)} 업체
          </h1>
          <p className="mt-2 text-[14px] text-slate">
            {loading ? "업체를 불러오는 중이에요..." : `총 ${vendors.length}개 업체`}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading &&
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="glass animate-pulse space-y-3 p-6">
                  <div className="h-4 w-2/3 rounded bg-black/10" />
                  <div className="h-3 w-1/2 rounded bg-black/10" />
                  <div className="h-3 w-1/3 rounded bg-black/10" />
                </div>
              ))}

            {!loading &&
              vendors.map((vendor) => (
                <GlassCard
                  key={vendor.id}
                  padding={24}
                  onClick={() => setSelectedVendor(vendor)}
                >
                  <h3 className="text-[16px] font-bold text-ink">{vendor.name}</h3>
                  <div className="mt-2 flex items-center gap-1.5 text-[13px] text-slate">
                    <Star className="h-3.5 w-3.5 fill-caution text-caution" />
                    <span className="font-semibold text-ink">{vendor.rating.toFixed(1)}</span>
                  </div>
                  <p className="mt-3 text-[15px] font-bold text-brand-blue">
                    {vendor.priceRange}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-[12px] text-slate">
                    <MapPin className="h-3.5 w-3.5" />
                    {vendor.distanceKm}km
                  </div>
                </GlassCard>
              ))}
          </div>

          {!loading && vendors.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
              <p className="text-[16px] font-semibold text-ink">등록된 업체가 없어요</p>
              <p className="text-[14px] text-slate">곧 더 많은 업체를 만나보실 수 있어요.</p>
            </div>
          )}
        </Container>
      </PageSection>

      <Modal
        open={Boolean(selectedVendor)}
        onClose={() => setSelectedVendor(null)}
        maxWidth="md"
        title={selectedVendor?.name}
      >
        {selectedVendor && (
          <div>
            <h2 className="text-xl font-bold text-ink">{selectedVendor.name}</h2>
            <div className="mt-2 flex items-center gap-1.5 text-[14px] text-slate">
              <Star className="h-4 w-4 fill-caution text-caution" />
              <span className="font-semibold text-ink">{selectedVendor.rating.toFixed(1)}</span>
              <span className="text-black/20">·</span>
              <MapPin className="h-4 w-4" />
              {selectedVendor.distanceKm}km
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-black/5 pt-5">
              <div>
                <p className="text-[12px] text-slate">예상 비용 범위</p>
                <p className="mt-1 text-[16px] font-bold text-brand-blue">
                  {selectedVendor.priceRange}
                </p>
              </div>
              <div>
                <p className="text-[12px] text-slate">연락처</p>
                <p className="mt-1 text-[16px] font-bold text-ink">{selectedVendor.contact}</p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[13px] font-semibold text-ink">업체 소개</p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-slate">
                {selectedVendor.desc}
              </p>
            </div>

            <div className="mt-4">
              <p className="text-[13px] font-semibold text-ink">위치</p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-slate">
                {selectedVendor.address}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <GradientButton
                type="button"
                variant="secondary"
                fullWidth
                onClick={() => alert(`${selectedVendor.contact}로 전화를 겁니다. (mock)`)}
              >
                연락하기
              </GradientButton>
              <GradientButton
                type="button"
                fullWidth
                onClick={() => {
                  addServiceUsage({
                    id: `service-${Date.now()}`,
                    category: getCategoryLabel(categorySlug),
                    label: selectedVendor.name,
                    requestedAt: new Date().toISOString().slice(0, 10),
                  });
                  alert(`${selectedVendor.name}에 예약을 요청합니다. (mock)`);
                }}
              >
                예약하기
              </GradientButton>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}
