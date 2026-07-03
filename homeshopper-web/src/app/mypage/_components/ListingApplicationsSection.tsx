"use client";

import GlassCard from "@/components/ui/GlassCard";
import { ListingApplication } from "@/lib/types";

export interface ListingApplicationsSectionProps {
  applications: ListingApplication[];
}

export default function ListingApplicationsSection({
  applications,
}: ListingApplicationsSectionProps) {
  return (
    <GlassCard padding={24}>
      <h2 className="text-[15px] font-bold text-ink">신청 내역</h2>
      {applications.length === 0 ? (
        <p className="mt-4 text-[13px] text-slate">매물 등록 신청 내역이 없어요.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {applications.map((application) => (
            <div key={application.id} className="rounded-2xl bg-black/[0.03] px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[13px] font-semibold text-ink">
                  {application.address}
                </p>
                <span className="shrink-0 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                  접수완료
                </span>
              </div>
              <p className="mt-1 text-[12px] text-slate">
                {application.dealType} · {application.submittedAt}
              </p>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
