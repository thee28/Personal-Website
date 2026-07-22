"use client";

import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Smoke shader keeps running during page navigation — it isn't the source of
  // the transition lag and looks better staying live. (The theme toggle still
  // pauses it via its own theme-transition-start/end events.)
  return (
    <div
      key={pathname}
      className={pathname === "/" ? undefined : "animate-page-in"}
    >
      {children}
    </div>
  );
}
