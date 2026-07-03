/** 표시용 제안 코드를 만들어낸다 (예: "OFR-042") */
export function formatOfferCode(dealId: string): string {
  let hash = 0;
  for (let index = 0; index < dealId.length; index += 1) {
    hash = (hash * 31 + dealId.charCodeAt(index)) >>> 0;
  }
  const code = (hash % 999) + 1;
  return `OFR-${String(code).padStart(3, "0")}`;
}

/** "2026-08-15" -> "8월 15일" */
export function formatDateLabel(iso?: string): string {
  if (!iso) return "-";
  const parts = iso.split("-");
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  return `${month}월 ${day}일`;
}
