"use client";

import { useEffect, useState } from "react";

/** lg 브레이크포인트(1024px) 기준. 서버 렌더와 동일하게 false로 시작한 뒤 마운트 후 보정한다 */
export function useIsDesktop(breakpoint = 1024): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [breakpoint]);

  return isDesktop;
}
