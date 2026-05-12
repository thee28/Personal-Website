"use client";

import { motion, useReducedMotion } from "framer-motion";

type WaveTextProps = {
  text: string;
  className?: string;
  repeatDelay?: number;
};

export function WaveText({
  text,
  className = "",
  repeatDelay = 2.2,
}: WaveTextProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <span
      aria-label={text}
      className={`inline-flex flex-wrap leading-[inherit] ${className}`.trim()}
    >
      {text.split("").map((char, index) => {
        const isSpace = char === " ";

        return (
          <motion.span
            key={`${char}-${index}`}
            className="inline-block whitespace-pre"
            animate={prefersReducedMotion ? undefined : { y: [0, -10, 0] }}
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                    delay: index * 0.045,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay,
                  }
            }
            whileHover={
              prefersReducedMotion
                ? undefined
                : {
                    y: [0, -10, 0],
                    transition: {
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }
            }
          >
            {isSpace ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </span>
  );
}
