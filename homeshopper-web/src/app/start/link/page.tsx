"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight, ImagePlus, Plus, X } from "lucide-react";
import Container from "@/components/layout/Container";
import PageSection from "@/components/layout/PageSection";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import Modal from "@/components/ui/Modal";
import StepHeader from "@/components/ui/StepHeader";
import { useToast } from "@/components/ui/Toast";
import { parsePropertyLink } from "@/lib/api";
import { Property } from "@/lib/types";
import { cn, formatPropertyPrice } from "@/lib/utils";

const STEPS = ["입력", "담당자 배정", "24시간 내 연락"];

function VerticalSteps({ current }: { current: number }) {
  return (
    <ol>
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === current;
        const isDone = stepNumber < current;
        const isLast = index === STEPS.length - 1;

        return (
          <li key={step} className={cn("relative flex items-start gap-3", !isLast && "pb-6")}>
            {!isLast && (
              <span className="absolute left-4 top-8 h-full w-px -translate-x-1/2 bg-black/10" />
            )}
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold",
                isDone || isActive ? "bg-grad-primary text-white" : "bg-black/5 text-slate",
              )}
            >
              {stepNumber}
            </span>
            <p
              className={cn(
                "pt-1 text-[15px] font-semibold",
                isActive ? "text-ink" : "text-slate",
              )}
            >
              {step}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

export default function StartLinkPage() {
  const router = useRouter();
  const showToast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [urlInput, setUrlInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [addedProperties, setAddedProperties] = useState<Property[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [branchModalOpen, setBranchModalOpen] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddProperty = async () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      showToast({
        title: "링크나 주소를 입력해주세요",
        variant: "caution",
      });
      return;
    }
    setIsParsing(true);
    try {
      const parsed = await parsePropertyLink(trimmed);
      setAddedProperties((prev) => [...prev, parsed]);
      setUrlInput("");
      handleRemoveImage();
    } finally {
      setIsParsing(false);
    }
  };

  const handleRemoveProperty = (id: string) => {
    setAddedProperties((prev) => prev.filter((property) => property.id !== id));
  };

  /** 입력창에 남은 링크가 있으면 자동으로 추가한 뒤 확정 모달을 띄운다 (다른 매물 추가하기를 누르지 않아도 됨) */
  const handleConfirm = async () => {
    const trimmed = urlInput.trim();
    if (trimmed) {
      setIsParsing(true);
      try {
        const parsed = await parsePropertyLink(trimmed);
        setAddedProperties((prev) => [...prev, parsed]);
        setUrlInput("");
        handleRemoveImage();
      } finally {
        setIsParsing(false);
      }
    }
    setBranchModalOpen(true);
  };

  const goTo = (href: string) => {
    setBranchModalOpen(false);
    router.push(href);
  };

  const hasProperties = addedProperties.length > 0;

  return (
    <main>
      <PageSection>
        <Container size="wide">
          <div className="mb-8 md:hidden">
            <StepHeader current={1} total={3} title="매물 알려주기" />
            <p className="mt-3 text-[15px] text-slate">
              거래하고 싶은 매물 링크 혹은 주소를 입력해주세요
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-[40%_60%] md:gap-12">
            <div className="hidden md:block">
              <h1 className="text-3xl font-bold text-ink">매물 알려주기</h1>
              <p className="mt-3 text-[15px] text-slate">
                거래하고 싶은 매물 링크 혹은 주소를 입력해주세요
              </p>
              <div className="mt-10">
                <VerticalSteps current={1} />
              </div>
              <p className="mt-10 text-xs text-slate">네이버·직방·다방 링크 지원</p>
            </div>

            <div>
              <GlassCard padding={32}>
                <label htmlFor="property-url" className="text-sm font-semibold text-ink">
                  매물 링크 또는 주소
                </label>
                <input
                  id="property-url"
                  type="text"
                  value={urlInput}
                  onChange={(event) => setUrlInput(event.target.value)}
                  placeholder="네이버부동산·직방·다방 링크 또는 주소를 붙여넣어주세요"
                  className="glass-surface mt-2 h-14 w-full rounded-2xl px-5 text-[15px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
                />

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="glass-surface inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:bg-white/70"
                  >
                    <ImagePlus className="h-4 w-4" />
                    이미지 첨부하기
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="첨부 이미지 미리보기"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        aria-label="이미지 제거"
                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                <GradientButton
                  type="button"
                  variant="secondary"
                  onClick={handleAddProperty}
                  loading={isParsing}
                  disabled={!urlInput.trim() || isParsing}
                  className="mt-4 w-full"
                >
                  <Plus className="h-4 w-4" />
                  추가하기
                </GradientButton>

                {hasProperties && (
                  <div className="mt-6 space-y-3">
                    <p className="text-sm font-semibold text-ink">
                      추가된 매물 {addedProperties.length}개
                    </p>
                    {addedProperties.map((property) => (
                      <div
                        key={property.id}
                        className="glass-surface flex items-center gap-3 rounded-2xl p-3"
                      >
                        <Image
                          src={property.thumbnail}
                          alt={property.title}
                          width={56}
                          height={56}
                          className="h-14 w-14 shrink-0 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[14px] font-semibold text-ink">
                            {property.title}
                          </p>
                          <p className="truncate text-[12px] text-slate">{property.address}</p>
                          <p className="text-[13px] font-bold text-brand-blue">
                            {formatPropertyPrice(property)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveProperty(property.id)}
                          aria-label="매물 삭제"
                          className="shrink-0 rounded-full p-2 text-slate transition-colors hover:bg-black/5 hover:text-danger"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <GradientButton
                  size="lg"
                  fullWidth
                  disabled={(!hasProperties && !urlInput.trim()) || isParsing}
                  loading={isParsing}
                  onClick={handleConfirm}
                  className="mt-8"
                >
                  확정
                </GradientButton>
              </GlassCard>
            </div>
          </div>
        </Container>
      </PageSection>

      <Modal
        open={branchModalOpen}
        onClose={() => setBranchModalOpen(false)}
        maxWidth="sm"
        title="무엇을 할까요?"
      >
        <h3 className="text-lg font-bold text-ink">무엇을 할까요?</h3>
        <div className="mt-4 space-y-3">
          <GlassCard
            as="button"
            padding={16}
            onClick={() =>
              goTo(`/results?seed=${encodeURIComponent(addedProperties[0]?.id ?? "")}`)
            }
            className="flex w-full items-center justify-between gap-3 text-left"
          >
            <div>
              <p className="font-semibold text-ink">🔍 이 매물 + 유사 매물 추천 받기</p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-slate" />
          </GlassCard>
          <GlassCard
            as="button"
            padding={16}
            onClick={() =>
              goTo(
                `/consult?prefill=${encodeURIComponent(
                  addedProperties.map((property) => property.id).join(","),
                )}`,
              )
            }
            className="flex w-full items-center justify-between gap-3 text-left"
          >
            <div>
              <p className="font-semibold text-ink">🤝 이 매물로 중개 요청하기</p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-slate" />
          </GlassCard>
        </div>
      </Modal>
    </main>
  );
}
