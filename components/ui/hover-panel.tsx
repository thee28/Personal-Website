"use client"

import * as React from "react"
import {
  motion,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion"

type HoverPanelProps = HTMLMotionProps<"div"> & {
  children: React.ReactNode
}

const SPRING = {
  stiffness: 220,
  damping: 24,
  mass: 0.7,
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function HoverPanel({
  children,
  className,
  style,
  onPointerMove,
  onPointerLeave,
  ...props
}: HoverPanelProps) {
  const prefersReducedMotion = useReducedMotion()
  const shiftX = useSpring(0, SPRING)
  const shiftY = useSpring(0, SPRING)
  const rotateX = useSpring(0, SPRING)
  const rotateY = useSpring(0, SPRING)

  const resetMotion = React.useCallback(() => {
    shiftX.set(0)
    shiftY.set(0)
    rotateX.set(0)
    rotateY.set(0)
  }, [rotateX, rotateY, shiftX, shiftY])

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerMove?.(event)

      if (prefersReducedMotion || event.pointerType === "touch") {
        return
      }

      const rect = event.currentTarget.getBoundingClientRect()
      const x = clamp((event.clientX - rect.left) / rect.width, 0, 1)
      const y = clamp((event.clientY - rect.top) / rect.height, 0, 1)

      shiftX.set((x - 0.5) * -10)
      shiftY.set((y - 0.5) * -10)
      rotateX.set((0.5 - y) * 6)
      rotateY.set((x - 0.5) * 6)
    },
    [onPointerMove, prefersReducedMotion, rotateX, rotateY, shiftX, shiftY]
  )

  const handlePointerLeave = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      resetMotion()
      onPointerLeave?.(event)
    },
    [onPointerLeave, resetMotion]
  )

  return (
    <motion.div
      className={cn(
        "relative isolate h-full overflow-hidden rounded-3xl p-6",
        "bg-[rgba(43,55,80,0.1)] text-foreground backdrop-blur-lg",
        "before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[inherit]",
        "before:content-[''] before:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25),inset_0_0_16px_0_rgba(255,255,255,0.08),inset_0_-3px_12px_0_rgba(255,255,255,0.12),0_1px_3px_0_rgba(0,0,0,0.50),0_4px_12px_0_rgba(0,0,0,0.45)]",
        className
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={
        prefersReducedMotion
          ? style
          : {
              ...style,
              rotateX,
              rotateY,
              transformPerspective: 1200,
            }
      }
      {...props}
    >
      <motion.div
        className="relative z-[2] h-full will-change-transform"
        style={
          prefersReducedMotion
            ? undefined
            : {
                x: shiftX,
                y: shiftY,
              }
        }
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
