"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

const THEME_COOKIE_NAME = "theme";
const THEME_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function syncThemeState(isDark: boolean) {
  const bgColor = isDark ? "#121212" : "#faf9f7";
  if (isDark) {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
  document.documentElement.style.background = bgColor;
  document.body.style.background = bgColor;
}

type ThemeToggleProps = {
  initialTheme: "light" | "dark";
};

export function ThemeToggle({ initialTheme }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(initialTheme !== "light");
  const buttonRef = useRef<HTMLButtonElement>(null);

  const persistTheme = useCallback((dark: boolean) => {
    const theme = dark ? "dark" : "light";
    localStorage.setItem("theme", theme);
    document.cookie = `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
  }, []);

  useEffect(() => {
    syncThemeState(isDark);
    persistTheme(isDark);
  }, [isDark, persistTheme]);

  const triggerThemeSwitch = useCallback(async () => {
    const button = buttonRef.current;
    const newIsDark = !isDark;

    const runTransition = async () => {
      if (
        !button ||
        typeof document.startViewTransition !== "function" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        setIsDark(newIsDark);
        return;
      }

      const transition = document.startViewTransition(() => {
        flushSync(() => {
          setIsDark(newIsDark);
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
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--foreground)] transition-colors duration-200 hover:bg-[var(--foreground)]/8 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]/20 active:scale-95"
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
