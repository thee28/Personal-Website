"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState, useCallback } from "react";
import { ThemeToggle } from "@/components/motion/theme-toggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/resume.pdf", label: "Resume", external: true },
  { href: "/about", label: "About" },
];

const iconBtn =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--foreground)] transition-colors hover:bg-[var(--foreground)]/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]/20";

const SENTINEL_ID = "header-scroll-sentinel";

/** ms — bar width / chrome morph (matches Thomas Sanlis `transition-all duration-500`) */
const SHELL_EXPAND_DURATION_MS = 500;
/** ms — after width collapse, drop wrapper back to floating offset */
const COLLAPSE_BEFORE_UNPIN_MS = SHELL_EXPAND_DURATION_MS + 50;

type HeaderProps = {
  initialTheme: "light" | "dark";
};

export function Header({ initialTheme }: HeaderProps) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef(false);
  const expandedRef = useRef(false);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [pinned, setPinned] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    pinnedRef.current = pinned;
    expandedRef.current = expanded;
  }, [pinned, expanded]);

  const activeIndex = navItems.findIndex(
    (item) =>
      pathname === item.href ||
      (item.href !== "/" && pathname.startsWith(item.href))
  );
  const isActive = activeIndex >= 0;

  const updateUnderline = useCallback(() => {
    if (!navRef.current || !isActive) return;
    const links = navRef.current.querySelectorAll("a");
    const activeEl = links[activeIndex] as HTMLElement | undefined;
    if (activeEl) {
      const navRect = navRef.current.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      const scrollLeft = navRef.current.scrollLeft;
      setUnderlineStyle({
        left: elRect.left - navRect.left + scrollLeft,
        width: elRect.width,
      });
    }
  }, [activeIndex, isActive]);

  useEffect(() => {
    updateUnderline();
  }, [pathname, pinned, expanded, updateUnderline]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    nav.addEventListener("scroll", updateUnderline);
    const ro = new ResizeObserver(updateUnderline);
    ro.observe(nav);
    return () => {
      nav.removeEventListener("scroll", updateUnderline);
      ro.disconnect();
    };
  }, [updateUnderline]);

  useEffect(() => {
    let raf = 0;

    const clearCollapseTimer = () => {
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current);
        collapseTimerRef.current = null;
      }
    };

    const updateFromScroll = () => {
      const shell = shellRef.current;
      const sentinel = document.getElementById(SENTINEL_ID);
      if (!shell || !sentinel) return;

      const shellBottom = shell.getBoundingClientRect().bottom;
      const sentinelTop = sentinel.getBoundingClientRect().top;
      const wantDock = sentinelTop <= shellBottom + 0.5;
      const wantFloat = sentinelTop > shellBottom + 28;

      if (wantDock) {
        if (!pinnedRef.current) {
          clearCollapseTimer();
          setPinned(true);
          setExpanded(true);
        }
        return;
      }

      if (wantFloat) {
        if (expandedRef.current) {
          clearCollapseTimer();
          setExpanded(false);
          collapseTimerRef.current = setTimeout(() => {
            collapseTimerRef.current = null;
            setPinned(false);
          }, COLLAPSE_BEFORE_UNPIN_MS);
        } else {
          clearCollapseTimer();
          setPinned(false);
        }
      }
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateFromScroll);
    };

    updateFromScroll();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    const ro = new ResizeObserver(onScrollOrResize);
    const sentinel = document.getElementById(SENTINEL_ID);
    if (sentinel) ro.observe(sentinel);
    const shell = shellRef.current;
    if (shell) ro.observe(shell);

    return () => {
      cancelAnimationFrame(raf);
      clearCollapseTimer();
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      ro.disconnect();
    };
  }, [pathname]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div
        className={`pointer-events-auto w-full will-change-transform transition-transform duration-500 ease-out motion-reduce:will-change-auto motion-reduce:transition-none ${
          pinned ? "translate-y-0" : "translate-y-2 sm:translate-y-2"
        }`}
      >
        <nav
          className={`relative px-2 ${
            pinned
              ? "pt-0 pb-2 sm:pb-4"
              : "py-2 sm:py-4"
          }`}
        >
          <div
            ref={shellRef}
            className={`relative mx-auto flex w-full min-w-0 items-center rounded-xl border border-white/25 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset] [transform:translateZ(0)] backface-hidden transition-all duration-500 motion-reduce:transition-none will-change-[box-shadow,background-color,padding,border-radius,max-width] motion-reduce:will-change-auto ${
              expanded
                ? "max-w-full bg-[var(--background)]/45 py-3 pl-3 pr-2 backdrop-blur-2xl sm:py-3.5 sm:pl-4 sm:pr-2.5"
                : "max-w-[min(100%,calc(72rem+2.5rem))] bg-[var(--background)]/90 py-2 pl-3 pr-2 backdrop-blur-xl sm:py-2.5 sm:pl-4 sm:pr-2.5"
            }`}
          >
            <div className="flex w-full min-w-0 items-center gap-3 sm:gap-4">
          <div className="relative flex min-h-[2.25rem] min-w-0 flex-1 items-center justify-start">
            <nav
              ref={navRef}
              className="scrollbar-hide max-w-[calc(100vw-8.5rem)] overflow-x-auto sm:max-w-none"
            >
              <div className="relative flex w-max max-w-full items-center justify-start gap-5 md:gap-7">
                {navItems.map((item) => {
                  const isItemActive =
                    !item.external &&
                    (pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(item.href)));
                  const linkClassName = `
                      relative shrink-0 py-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-200
                      ${
                        isItemActive
                          ? "text-[var(--foreground)]"
                          : "text-[var(--muted)] hover:text-[var(--foreground)]"
                      }
                    `;
                  return item.external ? (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClassName}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={linkClassName}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                {isActive && (
                  <span
                    className="absolute bottom-0 h-0.5 rounded-full bg-[var(--foreground)] transition-all duration-300 ease-out"
                    style={{
                      left: underlineStyle.left,
                      width: underlineStyle.width,
                    }}
                    aria-hidden
                  />
                )}
              </div>
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            <a
              href="https://github.com/thee28"
              target="_blank"
              rel="noopener noreferrer"
              className={iconBtn}
              aria-label="GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/theetat-thakong"
              target="_blank"
              rel="noopener noreferrer"
              className={iconBtn}
              aria-label="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" rx="2" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <ThemeToggle initialTheme={initialTheme} variant="rectangle" />
          </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
