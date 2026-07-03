import { ServiceVendorCategory } from "@/lib/types";

export type ServiceCategorySlug = ServiceVendorCategory | "대출" | "기타";

export interface ServiceCategoryMeta {
  slug: ServiceCategorySlug;
  label: string;
  emoji: string;
  /** 클릭 시 이동할 경로. 매물 업체형 카테고리는 /services/[slug]로 자동 연결 */
  href: string;
}

export const SERVICE_CATEGORIES: ServiceCategoryMeta[] = [
  { slug: "이사", label: "이사", emoji: "🚚", href: "/services/이사" },
  { slug: "인테리어", label: "인테리어", emoji: "🎨", href: "/services/인테리어" },
  { slug: "대출", label: "대출", emoji: "💰", href: "/services/loan" },
  { slug: "유지보수", label: "유지보수", emoji: "🔧", href: "/services/유지보수" },
  { slug: "해충퇴치", label: "해충 퇴치", emoji: "🐜", href: "/services/해충퇴치" },
  { slug: "기타", label: "기타", emoji: "✏️", href: "/consult" },
];

const VENDOR_CATEGORY_SLUGS: ServiceVendorCategory[] = ["이사", "인테리어", "유지보수", "해충퇴치"];

export function isVendorCategory(slug: string): slug is ServiceVendorCategory {
  return (VENDOR_CATEGORY_SLUGS as string[]).includes(slug);
}

export function getCategoryLabel(slug: string): string {
  return SERVICE_CATEGORIES.find((category) => category.slug === slug)?.label ?? slug;
}
