"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MessageCircle, Search, SearchX } from "lucide-react";
import Container from "@/components/layout/Container";
import FaqAccordion from "@/app/about/_components/FaqAccordion";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import SegmentControl from "@/components/ui/SegmentControl";
import { FAQ_CATEGORIES, FAQ_ITEMS, FaqCategory } from "@/lib/mock/faq";

type CategoryFilter = "전체" | FaqCategory;

const CATEGORY_OPTIONS: { label: string; value: CategoryFilter }[] = [
  { label: "전체", value: "전체" },
  ...FAQ_CATEGORIES.map((category) => ({ label: category, value: category })),
];

export default function FaqPageContent() {
  const [category, setCategory] = useState<CategoryFilter>("전체");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory = category === "전체" || item.category === category;
      const matchesKeyword =
        keyword.length === 0 ||
        item.question.toLowerCase().includes(keyword) ||
        item.answer.toLowerCase().includes(keyword);
      return matchesCategory && matchesKeyword;
    });
  }, [category, search]);

  return (
    <Container size="wide">
      <div className="mx-auto max-w-[800px]">
        <h1 className="text-center text-[28px] font-bold text-ink md:text-[32px]">
          자주 묻는 질문
        </h1>
        <p className="mt-2 text-center text-[14px] text-slate">
          궁금한 점을 검색하거나 카테고리로 찾아보세요
        </p>

        <div className="relative mt-8">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="질문을 검색해보세요"
            className="glass-surface h-12 w-full rounded-2xl pl-11 pr-4 text-[15px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
          />
        </div>

        <div className="mt-6 overflow-x-auto">
          <SegmentControl options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
        </div>

        <div className="mt-8">
          {filtered.length > 0 ? (
            <FaqAccordion key={`${category}-${search}`} items={filtered} />
          ) : (
            <GlassCard padding={40} className="text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                <SearchX className="h-6 w-6" />
              </span>
              <p className="mt-4 text-[15px] font-bold text-ink">검색 결과가 없어요</p>
              <p className="mt-2 text-[13px] text-slate">
                다른 키워드로 검색하거나 카테고리를 바꿔보세요.
              </p>
            </GlassCard>
          )}
        </div>

        <GlassCard padding={32} className="mt-16 flex flex-col items-center gap-4 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
            <MessageCircle className="h-6 w-6" />
          </span>
          <div>
            <p className="text-[16px] font-bold text-ink">원하는 답을 못 찾으셨나요?</p>
            <p className="mt-1 text-[13px] text-slate">
              전담 매니저에게 1:1로 직접 물어보세요.
            </p>
          </div>
          <Link href="/consult">
            <GradientButton>1:1 상담 신청하기</GradientButton>
          </Link>
        </GlassCard>
      </div>
    </Container>
  );
}
