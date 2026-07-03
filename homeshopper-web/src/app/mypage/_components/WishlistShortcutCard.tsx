"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

export interface WishlistShortcutCardProps {
  count: number;
}

export default function WishlistShortcutCard({ count }: WishlistShortcutCardProps) {
  return (
    <Link href="/wishlist">
      <GlassCard padding={24} onClick={() => undefined} className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-ink">위시리스트</h2>
          <p className="mt-1 text-[13px] text-slate">찜한 매물 {count}개</p>
        </div>
        <Heart className="h-6 w-6 shrink-0 text-danger" fill="currentColor" />
      </GlassCard>
    </Link>
  );
}
