"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import SegmentControl from "@/components/ui/SegmentControl";
import { useToast } from "@/components/ui/Toast";
import { useApp } from "@/context/AppContext";
import { getProperty, submitConsult } from "@/lib/api";
import { DealType, Property } from "@/lib/types";
import { useRequireLogin } from "@/lib/useRequireLogin";
import { digitsOnly, formatThousands } from "@/lib/utils";
import GlassSelect from "./GlassSelect";

const DEAL_TYPE_OPTIONS: { label: string; value: DealType }[] = [
  { label: "월세", value: "월세" },
  { label: "전세", value: "전세" },
  { label: "매매", value: "매매" },
];

const SEOUL_DISTRICTS = [
  "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구",
  "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구",
  "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구",
];

export interface BuyerRenterFormProps {
  prefillIds: string[];
}

export default function BuyerRenterForm({ prefillIds }: BuyerRenterFormProps) {
  const showToast = useToast();
  const { state } = useApp();
  const { requireLogin, guardModal } = useRequireLogin();

  const [dealType, setDealType] = useState<DealType>("월세");
  const [district, setDistrict] = useState("");
  const [budget, setBudget] = useState("");
  const [propertyLink, setPropertyLink] = useState("");
  const [phone, setPhone] = useState(state.user.phone);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (prefillIds.length === 0) return;
    let active = true;
    Promise.all(prefillIds.map((id) => getProperty(id))).then((results) => {
      if (!active) return;
      const found = results.filter((property): property is Property => Boolean(property));
      if (found.length === 0) return;
      const first = found[0];
      setDealType(first.dealType);
      setDistrict(first.district);
      const basePrice = first.dealType === "매매" ? first.price ?? 0 : first.deposit;
      setBudget(String(Math.round(basePrice / 10_000)));
      setPropertyLink(found.map((property) => property.title).join(", "));
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillIds.join(",")]);

  const canSubmit = district !== "" && budget.trim() !== "" && phone.trim() !== "";

  const submitRequest = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    const message = [
      `거래유형: ${dealType}`,
      `지역: ${district}`,
      `예산: ${formatThousands(budget)}만원`,
      propertyLink ? `관심 매물: ${propertyLink}` : null,
    ]
      .filter(Boolean)
      .join(" · ");
    await submitConsult({ name: state.user.name, phone, message });
    setSubmitting(false);
    showToast({
      title: "상담 신청이 접수됐어요",
      description: "24시간 이내에 연락드릴게요.",
      variant: "success",
    });
  };

  const handleSubmit = () => requireLogin(submitRequest);

  return (
    <>
      <GlassCard padding={40}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-ink">거래 유형</p>
          <SegmentControl
            className="mt-2"
            fullWidth
            options={DEAL_TYPE_OPTIONS}
            value={dealType}
            onChange={setDealType}
          />
        </div>
        <div>
          <label htmlFor="consult-district" className="text-sm font-semibold text-ink">
            지역
          </label>
          <GlassSelect
            id="consult-district"
            className="mt-2"
            value={district}
            onChange={setDistrict}
            options={SEOUL_DISTRICTS}
            placeholder="지역 구를 선택하세요"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="consult-budget" className="text-sm font-semibold text-ink">
            예산
          </label>
          <div className="relative mt-2">
            <input
              id="consult-budget"
              type="text"
              inputMode="numeric"
              value={formatThousands(budget)}
              onChange={(event) => setBudget(digitsOnly(event.target.value))}
              placeholder="0"
              className="glass-surface h-12 w-full rounded-2xl px-4 pr-14 text-right text-[15px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-slate">
              만원
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="consult-property-link" className="text-sm font-semibold text-ink">
          관심 매물 링크 (선택)
        </label>
        <input
          id="consult-property-link"
          type="text"
          value={propertyLink}
          onChange={(event) => setPropertyLink(event.target.value)}
          placeholder="관심 있는 매물 링크나 이름을 남겨주세요"
          className="glass-surface mt-2 h-12 w-full rounded-2xl px-4 text-[15px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="consult-phone" className="text-sm font-semibold text-ink">
          연락처*
        </label>
        <input
          id="consult-phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="010-0000-0000"
          className="glass-surface mt-2 h-12 w-full rounded-2xl px-4 text-[15px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
        />
      </div>

      <GradientButton
        type="button"
        size="lg"
        fullWidth
        className="mt-8"
        disabled={!canSubmit}
        loading={submitting}
        onClick={handleSubmit}
      >
        상담 신청
      </GradientButton>
      </GlassCard>
      {guardModal}
    </>
  );
}
