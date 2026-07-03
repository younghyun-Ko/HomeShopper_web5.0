"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";
import PageSection from "@/components/layout/PageSection";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import Modal from "@/components/ui/Modal";
import SegmentControl from "@/components/ui/SegmentControl";
import StepHeader from "@/components/ui/StepHeader";
import PropertyCard from "@/components/ui/PropertyCard";
import MatchBadge from "@/components/ui/MatchBadge";
import { useToast } from "@/components/ui/Toast";

type DealType = "sale" | "jeonse" | "monthly";

const SEGMENT_OPTIONS: { label: string; value: DealType }[] = [
  { label: "매매", value: "sale" },
  { label: "전세", value: "jeonse" },
  { label: "월세", value: "monthly" },
];

function ShowcaseBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <GlassCard className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-slate">{title}</h2>
      {children}
    </GlassCard>
  );
}

export default function ComponentsShowcasePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [segment, setSegment] = useState<DealType>("jeonse");
  const [liked, setLiked] = useState(false);
  const showToast = useToast();

  return (
    <main>
      <PageSection>
        <Container size="wide">
          <h1 className="text-3xl font-bold text-ink">컴포넌트 쇼케이스</h1>
          <p className="mt-2 text-slate">
            src/components/ui/ 9종 시각 검수용 페이지 (GlobalNav는 상단/하단에서 확인)
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <ShowcaseBlock title="GlassCard">
              <GlassCard onClick={() => {}} padding={20} className="bg-white/40">
                <p className="text-ink">클릭 가능한 글래스 카드 (hover lift + glow)</p>
              </GlassCard>
              <GlassCard padding={20} className="bg-white/40">
                <p className="text-ink">클릭 불가 (기본 상태)</p>
              </GlassCard>
            </ShowcaseBlock>

            <ShowcaseBlock title="GradientButton">
              <div className="flex flex-wrap gap-3">
                <GradientButton variant="primary">임장 예약하기</GradientButton>
                <GradientButton variant="secondary">더 알아보기</GradientButton>
                <GradientButton variant="danger">취소하기</GradientButton>
                <GradientButton variant="ghost">건너뛰기</GradientButton>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <GradientButton size="lg">큰 버튼</GradientButton>
                <GradientButton size="md">중간 버튼</GradientButton>
                <GradientButton loading>로딩 중</GradientButton>
                <GradientButton disabled>비활성</GradientButton>
              </div>
            </ShowcaseBlock>

            <ShowcaseBlock title="Modal">
              <GradientButton onClick={() => setModalOpen(true)}>
                모달 열기
              </GradientButton>
              <p className="text-xs text-slate">
                데스크톱: 중앙 모달 / 390px 이하: 하단 바텀시트
              </p>
              <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                maxWidth="md"
                title="서류 분석 결과"
              >
                <h3 className="text-lg font-bold text-ink">서류 분석 결과</h3>
                <p className="mt-2 text-sm text-slate">
                  확인이 필요한 항목이 있어요. 데스크톱에서는 중앙 모달, 모바일에서는
                  바텀시트로 표시됩니다.
                </p>
                <p className="mt-4 text-xs text-slate">
                  본 안내는 참고용이며 법적 효력이 없습니다. 전문가 확인을 권장합니다.
                </p>
                <GradientButton
                  className="mt-6"
                  fullWidth
                  onClick={() => setModalOpen(false)}
                >
                  확인했어요
                </GradientButton>
              </Modal>
            </ShowcaseBlock>

            <ShowcaseBlock title="SegmentControl">
              <SegmentControl
                options={SEGMENT_OPTIONS}
                value={segment}
                onChange={setSegment}
              />
              <SegmentControl
                options={SEGMENT_OPTIONS}
                value={segment}
                onChange={setSegment}
                fullWidth
              />
            </ShowcaseBlock>

            <ShowcaseBlock title="StepHeader">
              <StepHeader
                current={2}
                total={4}
                title="원하는 조건을 알려주세요"
                onBack={() => {}}
              />
            </ShowcaseBlock>

            <ShowcaseBlock title="MatchBadge">
              <MatchBadge
                criteria={[
                  { label: "역세권", met: true },
                  { label: "신축", met: true },
                  { label: "반려동물", met: false },
                  { label: "주차 가능", met: true },
                  { label: "엘리베이터", met: false },
                ]}
              />
            </ShowcaseBlock>

            <ShowcaseBlock title="Toast">
              <GradientButton
                onClick={() =>
                  showToast({
                    title: "임장 예약이 완료됐어요",
                    description: "담당 매니저가 24시간 이내에 연락드려요.",
                    variant: "success",
                    action: { label: "예약 보기", onClick: () => {} },
                  })
                }
              >
                토스트 띄우기
              </GradientButton>
            </ShowcaseBlock>

            <div className="md:col-span-2 xl:col-span-3">
              <h2 className="mb-3 text-sm font-semibold text-slate">
                PropertyCard — grid
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <PropertyCard
                  imageUrl="https://picsum.photos/seed/homeshopper1/640/400"
                  title="역삼 센트럴 빌라 302호"
                  dealType="전세"
                  address="서울 강남구 역삼동"
                  price="보증금 2,000만 / 월 90만"
                  area="23㎡"
                  hasElevator
                  tags={["역세권", "신축"]}
                  consultAvailable
                  liked={liked}
                  onLikeToggle={() => setLiked((prev) => !prev)}
                />
                <PropertyCard
                  imageUrl="https://picsum.photos/seed/homeshopper2/640/400"
                  title="합정 라움 오피스텔 1104호"
                  dealType="월세"
                  address="서울 마포구 합정동"
                  price="보증금 500만 / 월 65만"
                  area="19㎡"
                  tags={["풀옵션"]}
                  verified
                />
              </div>
            </div>

            <div className="md:col-span-2 xl:col-span-3">
              <h2 className="mb-3 text-sm font-semibold text-slate">
                PropertyCard — row
              </h2>
              <div className="space-y-3">
                <PropertyCard
                  layout="row"
                  imageUrl="https://picsum.photos/seed/homeshopper3/200/200"
                  title="망원 그린빌 501호"
                  dealType="매매"
                  address="서울 마포구 망원동"
                  price="3억 8,000만"
                  consultAvailable
                  actionSlot={<GradientButton size="md">상담 신청</GradientButton>}
                />
              </div>
            </div>
          </div>
        </Container>
      </PageSection>
    </main>
  );
}
