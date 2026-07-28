"use client";

import { motion, useReducedMotion, useSpring } from "framer-motion";
import type { PointerEvent } from "react";

const SPRING = {
  stiffness: 220,
  damping: 24,
  mass: 0.7,
};

const IMAGE_SRC = "https://i.imgur.com/gPjRCKT.jpeg";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function AboutPortrait() {
  const prefersReducedMotion = useReducedMotion();

  const shiftX = useSpring(0, SPRING);
  const shiftY = useSpring(0, SPRING);
  const rotateX = useSpring(0, SPRING);
  const rotateY = useSpring(0, SPRING);

  const resetMotion = () => {
    shiftX.set(0);
    shiftY.set(0);
    rotateX.set(0);
    rotateY.set(0);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || event.pointerType === "touch") {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);

    shiftX.set((x - 0.5) * -18);
    shiftY.set((y - 0.5) * -18);
    rotateX.set((0.5 - y) * 8);
    rotateY.set((x - 0.5) * 8);
  };

  return (
    <motion.div
      className="relative isolate overflow-hidden rounded-3xl bg-[rgba(43,55,80,0.1)] p-2 backdrop-blur-lg before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[inherit] before:content-[''] before:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25),inset_0_0_16px_0_rgba(255,255,255,0.08),inset_0_-3px_12px_0_rgba(255,255,255,0.12),0_1px_3px_0_rgba(0,0,0,0.50),0_4px_12px_0_rgba(0,0,0,0.45)] before:mix-blend-multiply"
      onPointerLeave={resetMotion}
      onPointerMove={handlePointerMove}
      style={
        prefersReducedMotion
          ? undefined
          : {
              rotateX,
              rotateY,
              transformPerspective: 1200,
            }
      }
    >
      <div className="aspect-[3/4] overflow-hidden rounded-[calc(1.5rem-2px)]">
        <div className="relative h-full w-full bg-[#111a27]">
          <motion.img
            src={IMAGE_SRC}
            alt="Portrait of Theetat Thakong"
            className="h-full w-full scale-[1.035] object-cover will-change-transform"
            draggable={false}
            style={
              prefersReducedMotion
                ? undefined
                : {
                    x: shiftX,
                    y: shiftY,
                  }
            }
          />
        </div>
      </div>
    </motion.div>
  );
}
