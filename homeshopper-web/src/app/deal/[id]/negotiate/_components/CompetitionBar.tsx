import { cn, formatManwon } from "@/lib/utils";

export interface CompetitionBarProps {
  label: string;
  value: number;
  max: number;
  colorClass: string;
}

export default function CompetitionBar({ label, value, max, colorClass }: CompetitionBarProps) {
  const widthPercent = max > 0 ? Math.min(100, Math.max(4, (value / max) * 100)) : 0;

  return (
    <div>
      <div className="flex items-center justify-between text-[12px]">
        <span className="text-slate">{label}</span>
        <span className="font-semibold text-ink">{formatManwon(value)}원</span>
      </div>
      <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-black/5">
        <div
          className={cn("h-full rounded-full transition-all duration-300 ease-out", colorClass)}
          style={{ width: `${widthPercent}%` }}
        />
      </div>
    </div>
  );
}
