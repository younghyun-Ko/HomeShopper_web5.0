"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Upload } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import Modal from "@/components/ui/Modal";
import { useApp } from "@/context/AppContext";
import { DealType, ListingApplication } from "@/lib/types";
import { useRequireLogin } from "@/lib/useRequireLogin";
import { cn } from "@/lib/utils";

const DEAL_TYPE_OPTIONS: DealType[] = ["매매", "전세", "월세"];

const DOCUMENT_ITEMS = [
  "등기부등본",
  "건축물 대장",
  "국세 납부 증명서",
  "지방세 납부 증명서",
  "전입세대 확인서",
  "신분증",
];

export default function SellerLandlordForm() {
  const { addListingApplication } = useApp();
  const { requireLogin, guardModal } = useRequireLogin();
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dealType, setDealType] = useState<DealType | "">("");
  const [address, setAddress] = useState("");
  const [documents, setDocuments] = useState<Record<string, File | null>>(
    Object.fromEntries(DOCUMENT_ITEMS.map((item) => [item, null])),
  );
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleFileChange = (item: string, file: File | null) => {
    setDocuments((prev) => ({ ...prev, [item]: file }));
  };

  const canSubmit =
    name.trim() !== "" && phone.trim() !== "" && dealType !== "" && address.trim() !== "" && agreed;

  const submitApplication = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 700));

    const application: ListingApplication = {
      id: `listing-${Date.now()}`,
      name,
      phone,
      email: email.trim() || undefined,
      dealType: dealType as DealType,
      address,
      documents: Object.entries(documents)
        .filter(([, file]) => file)
        .map(([label]) => label),
      submittedAt: new Date().toISOString().slice(0, 10),
    };
    addListingApplication(application);

    setSubmitting(false);
    setConfirmOpen(true);
  };

  const handleSubmit = () => requireLogin(submitApplication);

  return (
    <>
      <GlassCard padding={40}>
      <h2 className="text-xl font-bold text-ink">매물 등록 신청</h2>
      <p className="mt-2 text-[14px] leading-relaxed text-slate">
        매물 정보를 알려주시면 전담 매니저가 서류 검토 후, 24시간 이내에 연락드리겠습니다.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="seller-name" className="text-sm font-semibold text-ink">
            이름*
          </label>
          <input
            id="seller-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="이름을 입력해주세요"
            className="glass-surface mt-2 h-12 w-full rounded-2xl px-4 text-[15px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
          />
        </div>
        <div>
          <label htmlFor="seller-phone" className="text-sm font-semibold text-ink">
            연락처*
          </label>
          <input
            id="seller-phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="010-0000-0000"
            className="glass-surface mt-2 h-12 w-full rounded-2xl px-4 text-[15px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="seller-email" className="text-sm font-semibold text-ink">
          이메일 (선택)
        </label>
        <input
          id="seller-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="example@email.com"
          className="glass-surface mt-2 h-12 w-full rounded-2xl px-4 text-[15px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
        />
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold text-ink">희망 거래 유형*</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {DEAL_TYPE_OPTIONS.map((option) => {
            const selected = option === dealType;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setDealType(option)}
                aria-pressed={selected}
                className={cn(
                  "rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-200",
                  selected
                    ? "bg-grad-primary text-white shadow-[0_8px_20px_rgba(0,131,255,0.25)]"
                    : "glass-surface text-ink hover:bg-white/70",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="seller-address" className="text-sm font-semibold text-ink">
          매물 주소*
        </label>
        <input
          id="seller-address"
          type="text"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="예: 서울시 강남구 역삼동 123-45"
          className="glass-surface mt-2 h-12 w-full rounded-2xl px-4 text-[15px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
        />
      </div>

      <div className="mt-8 border-t border-black/5 pt-6">
        <p className="text-sm font-semibold text-ink">인증 배지 발급 (선택)</p>
        <p className="mt-1 text-[12px] text-slate">
          서류를 업로드하시면 매물에 인증 배지가 발급됩니다
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {DOCUMENT_ITEMS.map((item) => {
            const file = documents[item];
            return (
              <div key={item}>
                <input
                  ref={(element) => {
                    fileInputRefs.current[item] = element;
                  }}
                  type="file"
                  hidden
                  onChange={(event) =>
                    handleFileChange(item, event.target.files?.[0] ?? null)
                  }
                />
                <button
                  type="button"
                  onClick={() => fileInputRefs.current[item]?.click()}
                  className="glass-surface flex w-full items-center justify-between gap-2 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-white/70"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold text-ink">
                      {item}
                    </span>
                    {file && (
                      <span className="block truncate text-[11px] text-success">
                        {file.name}
                      </span>
                    )}
                  </span>
                  {file ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  ) : (
                    <Upload className="h-4 w-4 shrink-0 text-slate" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <label className="mt-8 flex items-start gap-3 text-[13px] leading-relaxed text-ink">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-black/20 accent-[var(--blue)]"
        />
        <span>
          <span className="font-semibold text-danger">[필수]</span> 개인정보 수집 및 이용에
          동의합니다.
          <br />
          <span className="text-[12px] text-slate">
            수집 항목: 이름, 연락처, 이메일, 매물 주소 | 이용 목적: 매물 등록 신청 및 안내 | 보유
            기간: 신청 완료 후 1년
          </span>
        </span>
      </label>

      <GradientButton
        type="button"
        size="lg"
        fullWidth
        className="mt-8"
        disabled={!canSubmit}
        loading={submitting}
        onClick={handleSubmit}
      >
        🚀 매물 등록 신청하기
      </GradientButton>
      <p className="mt-3 text-center text-[12px] text-slate">
        전담 매니저가 24시간 내 연락드리겠습니다.
      </p>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="sm"
        title="매물 등록 신청 완료"
      >
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <p className="mt-4 text-lg font-bold text-ink">매물 등록 신청이 접수됐어요</p>
          <p className="mt-2 text-[14px] leading-relaxed text-slate">
            전담 매니저가 서류 검토 후 24시간 이내에 연락드릴게요. 마이페이지 신청 내역에서
            진행 상황을 확인하실 수 있어요.
          </p>
          <GradientButton fullWidth className="mt-6" onClick={() => setConfirmOpen(false)}>
            확인
          </GradientButton>
        </div>
      </Modal>
      </GlassCard>
      {guardModal}
    </>
  );
}
