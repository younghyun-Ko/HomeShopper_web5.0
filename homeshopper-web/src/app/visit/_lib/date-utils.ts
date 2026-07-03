export function formatMonthDay(iso: string): string {
  const parts = iso.split("-");
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  return `${month}월 ${day}일`;
}

/** "13:00" -> "오후 1시" / "10:00" -> "오전 10시" */
export function formatTimeLabel(time: string): string {
  const hour = Number(time.split(":")[0]);
  const period = hour < 12 ? "오전" : "오후";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${period} ${hour12}시`;
}
