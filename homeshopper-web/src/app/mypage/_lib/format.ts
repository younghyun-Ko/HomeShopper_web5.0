export function formatMonthDay(iso: string): string {
  const parts = iso.split("-");
  return `${Number(parts[1])}월 ${Number(parts[2])}일`;
}

/** "13:00" -> "오후 1시" */
export function formatTimeLabel(time: string): string {
  const hour = Number(time.split(":")[0]);
  const period = hour < 12 ? "오전" : "오후";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${period} ${hour12}시`;
}
