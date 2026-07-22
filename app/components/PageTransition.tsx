"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const firstRender = useRef(true);

  // Free the GPU for the entrance animation: pause the smoke shader while the
  // page transition runs, then resume once it settles.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.dispatchEvent(new Event("theme-transition-start"));
    const id = window.setTimeout(() => {
      window.dispatchEvent(new Event("theme-transition-end"));
    }, 650);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return (
    <div
      key={pathname}
      className={pathname === "/" ? undefined : "animate-page-in"}
    >
      {children}
    </div>
  );
}
