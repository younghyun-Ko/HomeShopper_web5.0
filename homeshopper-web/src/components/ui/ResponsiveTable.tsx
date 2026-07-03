import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ResponsiveTableColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
}

export interface ResponsiveTableProps<T> {
  columns: ResponsiveTableColumn<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
  className?: string;
}

/** 데스크톱에서는 실제 표, 태블릿 이하에서는 카드형 리스트로 전환되는 표 컴포넌트 */
export default function ResponsiveTable<T extends object>({
  columns,
  rows,
  rowKey,
  className,
}: ResponsiveTableProps<T>) {
  const cellValue = (row: T, key: string): ReactNode =>
    (row as unknown as Record<string, ReactNode>)[key];

  return (
    <div className={className}>
      {/* 데스크톱: 실제 표 */}
      <div className="hidden overflow-hidden rounded-2xl border border-black/5 md:block">
        <table className="w-full border-collapse text-left text-[14px]">
          <thead>
            <tr className="bg-black/[0.03]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-[12px] font-semibold text-slate"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={rowKey(row, index)} className="border-t border-black/5">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 align-top text-ink">
                    {column.render ? column.render(row) : cellValue(row, column.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 태블릿 이하: 카드형 리스트 */}
      <div className="space-y-3 md:hidden">
        {rows.map((row, index) => (
          <div key={rowKey(row, index)} className="glass-surface rounded-2xl p-4">
            {columns.map((column, columnIndex) => (
              <div
                key={column.key}
                className={cn(
                  "flex flex-col gap-0.5 py-2",
                  columnIndex > 0 && "border-t border-black/5",
                  columnIndex === 0 && "pt-0",
                  columnIndex === columns.length - 1 && "pb-0",
                )}
              >
                <span className="text-[11px] font-medium text-slate">{column.label}</span>
                <span className="text-[13px] leading-relaxed text-ink">
                  {column.render ? column.render(row) : cellValue(row, column.key)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
