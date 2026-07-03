"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Heart, MapPin, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Container from "@/components/layout/Container";
import { useApp } from "@/context/AppContext";
import GradientButton from "./GradientButton";
import { cn } from "@/lib/utils";

export interface GlobalNavProps {
  className?: string;
}

interface NavLink {
  label: string;
  href: string;
}

interface TabLink extends NavLink {
  icon: LucideIcon;
}

const DESKTOP_LINKS: NavLink[] = [
  { label: "홈", href: "/" },
  { label: "위시리스트", href: "/wishlist" },
  { label: "임장·관리", href: "/visit" },
  { label: "서비스", href: "/services" },
  { label: "서비스 소개", href: "/about" },
];

const MOBILE_TABS: TabLink[] = [
  { label: "홈", href: "/", icon: Home },
  { label: "위시", href: "/wishlist", icon: Heart },
  { label: "임장", href: "/visit", icon: MapPin },
  { label: "내정보", href: "/mypage", icon: User },
];

export default function GlobalNav({ className }: GlobalNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, logout } = useApp();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 hidden border-b border-white/40 bg-white/55 backdrop-blur-xl backdrop-saturate-[180%] md:block",
          className,
        )}
      >
        <Container size="wide">
          <div className="flex h-20 items-center justify-between">
            <Link
              href="/"
              className="bg-grad-primary bg-clip-text text-2xl font-bold text-transparent"
            >
              홈쇼퍼
            </Link>
            <nav className="flex items-center gap-8">
              {DESKTOP_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative py-2 text-[15px] font-medium transition-colors",
                      active ? "text-ink" : "text-slate hover:text-ink",
                    )}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-grad-primary" />
                    )}
                  </Link>
                );
              })}
            </nav>
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
        </Container>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/40 bg-white/55 backdrop-blur-xl backdrop-saturate-[180%] md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {MOBILE_TABS.map((tab) => {
          const active = isActive(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors",
                active ? "text-brand-blue" : "text-slate",
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
