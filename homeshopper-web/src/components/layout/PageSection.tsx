import { ReactNode } from "react";

interface PageSectionProps {
  children: ReactNode;
  className?: string;
}

export default function PageSection({
  children,
  className = "",
}: PageSectionProps) {
  return (
    <section className={`py-16 md:py-24 ${className}`}>{children}</section>
  );
}
