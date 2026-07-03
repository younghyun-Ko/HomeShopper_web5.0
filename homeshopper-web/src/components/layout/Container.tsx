import { ReactNode } from "react";

const SIZE_MAP = {
  wide: "max-w-[1200px]",
  form: "max-w-[720px]",
  narrow: "max-w-[640px]",
} as const;

interface ContainerProps {
  children: ReactNode;
  size?: keyof typeof SIZE_MAP;
  className?: string;
}

export default function Container({
  children,
  size = "wide",
  className = "",
}: ContainerProps) {
  return (
    <div className={`mx-auto w-full px-6 ${SIZE_MAP[size]} ${className}`}>
      {children}
    </div>
  );
}
