"use client";
// beui.dev/components/motion/theme-toggle — rewired to this app's custom
// cookie + data-theme theme system (no next-themes: SSR, the smoke background
// MutationObserver, and the theme-transition freeze events all rely on it).

import { Moon, Sun } from "lucide-react";
import { useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { ActionSwapIcon } from "@/components/motion/action-swap";
import { cn } from "@/lib/utils";

export type ThemeVariant = "rectangle" | "circle" | "circle-blur";

export type RectStart =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center"
  | "bottom-up";

export interface ThemeToggleProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children" | "onClick"> {
  /** SSR-resolved theme so the icon renders correct on first paint (no flash). */
  initialTheme: "light" | "dark";
  /** Animation variant. Default: "rectangle". */
  variant?: ThemeVariant;
  /** Origin direction for the reveal. Default: "bottom-up". */
  start?: RectStart;
  iconClassName?: string;
}

const VT_STYLE_ID = "beui-theme-toggle-vt";
const THEME_COOKIE_NAME = "theme";
const THEME_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

// Duration/easing is component-specific: View Transition API uses CSS, not
// motion springs. 400ms + ease-out mirrors native OS mode-switch timing.
const VT_CSS = `
html[data-beui-vt="rect"]::view-transition-old(root) {
  animation: none;
  mix-blend-mode: normal;
}
html[data-beui-vt="rect"]::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: beui-rect-reveal 400ms ease-out;
}
html[data-beui-vt="circle"]::view-transition-old(root),
html[data-beui-vt="circle-blur"]::view-transition-old(root) {
  animation: none;
  mix-blend-mode: normal;
}
html[data-beui-vt="circle"]::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: beui-circle-reveal 700ms cubic-bezier(0.4, 0, 0.2, 1);
}
html[data-beui-vt="circle-blur"]::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: beui-circle-blur-reveal 700ms cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes beui-rect-reveal {
  from { clip-path: var(--beui-vt-from, inset(100% 0 0 0)); }
  to   { clip-path: inset(0 0 0 0); }
}
@keyframes beui-circle-reveal {
  from { clip-path: circle(0% at var(--beui-vt-origin, 50% 100%)); }
  to   { clip-path: circle(150% at var(--beui-vt-origin, 50% 100%)); }
}
@keyframes beui-circle-blur-reveal {
  from { clip-path: circle(0% at var(--beui-vt-origin, 50% 100%)); filter: blur(8px); }
  to   { clip-path: circle(150% at var(--beui-vt-origin, 50% 100%)); filter: blur(0px); }
}
`;

const RECT_FROM: Record<RectStart, string> = {
  "top-left":    "inset(0 100% 100% 0)",
  "top-right":   "inset(0 0 100% 100%)",
  "bottom-left": "inset(100% 100% 0 0)",
  "bottom-right":"inset(100% 0 0 100%)",
  center:        "inset(50% 50% 50% 50%)",
  "bottom-up":   "inset(100% 0 0 0)",
};

const CIRCLE_ORIGIN: Record<RectStart, string> = {
  "top-left":    "0% 0%",
  "top-right":   "100% 0%",
  "bottom-left": "0% 100%",
  "bottom-right":"100% 100%",
  center:        "50% 50%",
  "bottom-up":   "50% 100%",
};

/** Apply the resolved theme to the DOM exactly the way the rest of the app expects. */
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

function persistTheme(isDark: boolean) {
  const theme = isDark ? "dark" : "light";
  localStorage.setItem("theme", theme);
  document.cookie = `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}

export function useThemeToggle({
  initialTheme,
  variant = "rectangle",
  start = "bottom-up",
}: { initialTheme: "light" | "dark"; variant?: ThemeVariant; start?: RectStart }) {
  const [isDark, setIsDark] = useState(initialTheme !== "light");
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    if (document.getElementById(VT_STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = VT_STYLE_ID;
    el.textContent = VT_CSS;
    document.head.appendChild(el);
  }, []);

  useEffect(() => {
    syncThemeState(isDark);
    persistTheme(isDark);
  }, [isDark]);

  const toggle = useCallback(() => {
    const root = document.documentElement;
    const next = !isDark;

    if (reduce || !("startViewTransition" in document)) {
      setIsDark(next);
      return;
    }

    if (variant === "rectangle") {
      root.style.setProperty("--beui-vt-from", RECT_FROM[start]);
      root.dataset.beuiVt = "rect";
    } else {
      root.style.setProperty("--beui-vt-origin", CIRCLE_ORIGIN[start]);
      root.dataset.beuiVt = variant;
    }

    // Freeze the smoke background for the duration of the transition (the
    // SmokeBackground listens for these events to free the GPU).
    window.dispatchEvent(new Event("theme-transition-start"));

    const vt = (
      document as Document & {
        startViewTransition(cb: () => void): { finished: Promise<void> };
      }
    ).startViewTransition(() => setIsDark(next));

    vt.finished.finally(() => {
      delete root.dataset.beuiVt;
      window.dispatchEvent(new Event("theme-transition-end"));
    });
  }, [isDark, reduce, variant, start]);

  return { isDark, toggle };
}

export function ThemeToggle({
  initialTheme,
  variant = "rectangle",
  start = "bottom-up",
  className,
  iconClassName,
  ...rest
}: ThemeToggleProps) {
  const { isDark, toggle } = useThemeToggle({ initialTheme, variant, start });
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className={cn(
        "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--foreground)] transition-colors duration-200 hover:bg-[var(--foreground)]/8 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]/20 active:scale-95",
        className
      )}
      {...rest}
    >
      <ActionSwapIcon
        value={isDark ? "dark" : "light"}
        animation="blur"
        className={cn("h-5 w-5", iconClassName)}
      >
        {isDark ? (
          <Sun className="h-5 w-5" strokeWidth={1.5} />
        ) : (
          <Moon className="h-5 w-5" strokeWidth={1.5} />
        )}
      </ActionSwapIcon>
    </button>
  );
}
