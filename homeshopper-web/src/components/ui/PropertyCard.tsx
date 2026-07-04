"use client";

import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export type PropertyCardLayout = "grid" | "row";

export interface PropertyCardProps {
  /** 'grid': result-grid card (default). 'row': cart/list horizontal card */
  layout?: PropertyCardLayout;
  imageUrl: string;
  title: string;
  dealType: string;
  address: string;
  /** formatted price string, e.g. "보증금 2,000만 / 월 90만" */
  price: string;
  area?: string;
  hasElevator?: boolean;
  tags?: string[];
  /** shows a green "상담가능" badge */
  consultAvailable?: boolean;
  /** shows a purple "서류 인증 완료" badge */
  verified?: boolean;
  liked?: boolean;
  onLikeToggle?: () => void;
  /** action buttons rendered on the right side of the 'row' layout */
  actionSlot?: ReactNode;
  /** wraps the image + info area in a link to the detail page (both 'grid' and 'row' layouts) */
  href?: string;
  /** 'grid' layout only: rendered below the tags, outside the link (e.g. match badge + CTA) */
  footer?: ReactNode;
  className?: string;
}

function StatusBadges({
  consultAvailable,
  verified,
}: Pick<PropertyCardProps, "consultAvailable" | "verified">) {
  return (
    <>
      {consultAvailable && (
        <span className="rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
          상담가능
        </span>
      )}
      {verified && (
        <span className="rounded-full bg-brand-purple/10 px-2.5 py-1 text-[11px] font-semibold text-brand-purple">
          서류 인증 완료
        </span>
      )}
    </>
  );
}

export default function PropertyCard({
  layout = "grid",
  imageUrl,
  title,
  dealType,
  address,
  price,
  area,
  hasElevator,
  tags = [],
  consultAvailable,
  verified,
  liked = false,
  onLikeToggle,
  actionSlot,
  href,
  footer,
  className,
}: PropertyCardProps) {
  if (layout === "row") {
    const rowBody = (
      <>
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-medium text-slate">
              {dealType}
            </span>
            <StatusBadges consultAvailable={consultAvailable} verified={verified} />
          </div>
          <h3 className="mt-1 truncate text-[15px] font-bold text-ink">{title}</h3>
          <p className="truncate text-[13px] text-slate">{address}</p>
          <p className="mt-1 text-[16px] font-bold text-brand-blue">{price}</p>
        </div>
      </>
    );

    return (
      <div className={cn("glass flex items-center gap-4 p-4", className)}>
        {href ? (
          <Link href={href} className="flex min-w-0 flex-1 items-center gap-4">
            {rowBody}
          </Link>
        ) : (
          rowBody
        )}
        {actionSlot && <div className="shrink-0">{actionSlot}</div>}
      </div>
    );
  }

  const cardBody = (
    <>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-card">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onLikeToggle?.();
          }}
          aria-label="찜하기"
          aria-pressed={liked}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 backdrop-blur-md transition-transform active:scale-90"
        >
          <Heart
            className={cn("h-[18px] w-[18px]", liked ? "text-danger" : "text-ink")}
            fill={liked ? "currentColor" : "none"}
          />
        </button>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-medium text-slate">
            {dealType}
          </span>
          <StatusBadges consultAvailable={consultAvailable} verified={verified} />
        </div>
        <h3 className="mt-2 text-[16px] font-bold text-ink">{title}</h3>
        <p className="mt-0.5 text-[13px] text-slate">{address}</p>
        <p className="mt-2 text-[18px] font-bold text-brand-blue">{price}</p>
        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-black/5 pt-3 text-center text-[12px] text-slate">
          <div>{dealType}</div>
          <div>{area ?? "-"}</div>
          <div>{hasElevator ? "엘리베이터 O" : "엘리베이터 X"}</div>
        </div>
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-brand-blue/10 px-2.5 py-1 text-[11px] font-medium text-brand-blue"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className={cn("glass overflow-hidden p-0", className)}>
      {href ? (
        <Link href={href} className="block">
          {cardBody}
        </Link>
      ) : (
        cardBody
      )}
      {footer && <div className="px-5 pb-5">{footer}</div>}
    </div>
  );
}
