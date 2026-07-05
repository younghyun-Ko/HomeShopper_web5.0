"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Handshake, Heart, Home, MapPin, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Container from "@/components/layout/Container";
import StartDealModal from "@/components/domain/StartDealModal";
import { useApp } from "@/context/AppContext";
import { NAV_LABELS } from "@/lib/constants";
import GradientButton from "./GradientButton";
import { cn } from "@/lib/utils";

export interface GlobalNavProps {
  className?: string;
}

/** referenced from the hidden gradient <defs> below so the wishlist heart can render a brand-gradient fill */
const HEART_GRADIENT_ID = "gnb-heart-gradient";

type NavAction = { kind: "link"; href: string } | { kind: "start-modal" };

interface DesktopNavItem {
  label: string;
  action: NavAction;
  isActive: (pathname: string) => boolean;
}

interface MobileTabItem {
  label: string;
  icon: LucideIcon;
  action: NavAction;
  isActive: (pathname: string) => boolean;
}

const DESKTOP_LINKS: DesktopNavItem[] = [
  { label: "홈", action: { kind: "link", href: "/" }, isActive: (p) => p === "/" },
  { label: "거래", action: { kind: "start-modal" }, isActive: (p) => p.startsWith("/start") },
  {
    label: NAV_LABELS.linkedServices,
    action: { kind: "link", href: "/services" },
    isActive: (p) => p.startsWith("/services"),
  },
  {
    label: "임장·관리",
    action: { kind: "link", href: "/visit" },
    isActive: (p) => p.startsWith("/visit"),
  },
  { label: "서비스 소개", action: { kind: "link", href: "/about" }, isActive: (p) => p.startsWith("/about") },
];

const MOBILE_TABS: MobileTabItem[] = [
  { label: "홈", icon: Home, action: { kind: "link", href: "/" }, isActive: (p) => p === "/" },
  {
    label: "거래",
    icon: Handshake,
    action: { kind: "start-modal" },
    isActive: (p) => p.startsWith("/start"),
  },
  {
    label: "임장",
    icon: MapPin,
    action: { kind: "link", href: "/visit" },
    isActive: (p) => p.startsWith("/visit"),
  },
  {
    label: "내정보",
    icon: User,
    action: { kind: "link", href: "/mypage" },
    isActive: (p) => p.startsWith("/mypage"),
  },
];

export default function GlobalNav({ className }: GlobalNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, logout } = useApp();
  const [startModalOpen, setStartModalOpen] = useState(false);

  const wishlistCount = state.wishlist.length;
  const wishlistActive = pathname.startsWith("/wishlist");

  const renderWishlistButton = (size: "sm" | "md") => (
    <Link
      href="/wishlist"
      title="위시리스트"
      aria-label={`위시리스트${wishlistCount > 0 ? ` (${wishlistCount}개)` : ""}`}
      className={cn(
        "glass-surface relative inline-flex items-center justify-center rounded-full transition-colors hover:bg-white/70",
        size === "md" ? "h-11 w-11" : "h-10 w-10",
      )}
    >
      <Heart
        className="h-5 w-5"
        strokeWidth={2}
        {...(wishlistActive
          ? { fill: `url(#${HEART_GRADIENT_ID})`, stroke: `url(#${HEART_GRADIENT_ID})` }
          : { className: "h-5 w-5 text-slate" })}
      />
      {wishlistCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-grad-primary px-1 text-[10px] font-bold text-white shadow-md">
          {wishlistCount}
        </span>
      )}
    </Link>
  );

  return (
    <>
      {/* lucide 아이콘은 fill/stroke에 그라디언트를 직접 넣을 수 없어 숨겨진 <defs>를 참조하는 방식으로 처리 */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <linearGradient id={HEART_GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0083FF" />
            <stop offset="100%" stopColor="#4C2CE2" />
          </linearGradient>
        </defs>
      </svg>

      <header
        className={cn(
          "sticky top-0 z-40 hidden border-b border-white/40 bg-white/55 backdrop-blur-xl backdrop-saturate-[180%] md:block",
          className,
        )}
      >
        <Container size="wide">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="HomeShopper"
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg"
              />
              <span className="bg-grad-primary bg-clip-text text-2xl font-bold text-transparent">
                HomeShopper
              </span>
            </Link>
            <nav className="flex items-center gap-8">
              {DESKTOP_LINKS.map((item) => {
                const active = item.isActive(pathname);
                const linkClassName = cn(
                  "relative py-2 text-[15px] font-medium transition-colors",
                  active ? "text-ink" : "text-slate hover:text-ink",
                );
                const underline = active && (
                  <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-grad-primary" />
                );

                if (item.action.kind === "link") {
                  return (
                    <Link key={item.label} href={item.action.href} className={linkClassName}>
                      {item.label}
                      {underline}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setStartModalOpen(true)}
                    className={linkClassName}
                  >
                    {item.label}
                    {underline}
                  </button>
                );
              })}
            </nav>
            <div className="flex items-center gap-3">
              {renderWishlistButton("md")}
              {state.user.isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/mypage"
                    className="text-[14px] font-semibold text-ink hover:text-brand-blue"
                  >
                    {state.user.name}님
                  </Link>
                  <GradientButton
                    variant="secondary"
                    size="md"
                    onClick={() => {
                      logout();
                      router.push("/");
                    }}
                  >
                    로그아웃
                  </GradientButton>
                </div>
              ) : (
                <Link href="/login">
                  <GradientButton variant="secondary" size="md">
                    로그인
                  </GradientButton>
                </Link>
              )}
            </div>
          </div>
        </Container>
      </header>

      {/* 모바일 상단 간소 헤더 — 로고 + 위시리스트만 노출, 메인 내비게이션은 하단 탭바가 담당 */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/40 bg-white/55 px-4 backdrop-blur-xl backdrop-saturate-[180%] md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="HomeShopper"
            width={28}
            height={28}
            className="h-7 w-7 rounded-lg"
          />
          <span className="bg-grad-primary bg-clip-text text-lg font-bold text-transparent">
            HomeShopper
          </span>
        </Link>
        {renderWishlistButton("sm")}
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/40 bg-white/55 backdrop-blur-xl backdrop-saturate-[180%] md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {MOBILE_TABS.map((tab) => {
          const active = tab.isActive(pathname);
          const Icon = tab.icon;
          const tabClassName = cn(
            "flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors",
            active ? "text-brand-blue" : "text-slate",
          );

          if (tab.action.kind === "link") {
            return (
              <Link key={tab.label} href={tab.action.href} className={tabClassName}>
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                {tab.label}
              </Link>
            );
          }

          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => setStartModalOpen(true)}
              className={tabClassName}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      <StartDealModal open={startModalOpen} onClose={() => setStartModalOpen(false)} />
    </>
  );
}
