"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const theme = document.documentElement.getAttribute("data-theme");
    setIsDark(theme !== "light");
  }, []);

  const persistTheme = (dark: boolean) => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  };

  const applyTheme = (newIsDark: boolean) => {
    const bgColor = newIsDark ? "#111111" : "#faf9f7";
    document.documentElement.setAttribute("data-theme", newIsDark ? "" : "light");
    document.documentElement.style.background = bgColor;
    document.body.style.background = bgColor;
    persistTheme(newIsDark);
    setIsDark(newIsDark);
  };

  const triggerThemeSwitch = useCallback(async () => {
    const button = buttonRef.current;
    const newIsDark = !isDark;

    const runTransition = async () => {
      if (
        !button ||
        typeof document.startViewTransition !== "function" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        applyTheme(newIsDark);
        return;
      }

      const transition = document.startViewTransition(() => {
        flushSync(() => {
          applyTheme(newIsDark);
        });
      });

      await transition.ready;

      const { top, left, width, height } = button.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      const maxRadius = Math.hypot(
        Math.max(left, window.innerWidth - left),
        Math.max(top, window.innerHeight - top)
      );

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    };

    await runTransition();
  }, [isDark]);

  return (
    <button
      ref={buttonRef}
      onClick={() => triggerThemeSwitch()}
      className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-110 active:scale-95 bg-[var(--foreground)] text-[var(--background)] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/30"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
