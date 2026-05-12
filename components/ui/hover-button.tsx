"use client"

import * as React from "react"

type HoverButtonProps =
  | ({
      href: string
      children: React.ReactNode
    } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({
      href?: undefined
      children: React.ReactNode
    } & React.ButtonHTMLAttributes<HTMLButtonElement>)

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

export function HoverButton(props: HoverButtonProps) {
  const buttonRef = React.useRef<HTMLElement | null>(null)
  const [isListening, setIsListening] = React.useState(false)
  const [circles, setCircles] = React.useState<
    Array<{
      id: number
      x: number
      y: number
      color: string
      fadeState: "in" | "out" | null
    }>
  >([])
  const lastAddedRef = React.useRef(0)

  const createCircle = React.useCallback((x: number, y: number) => {
    const buttonWidth = buttonRef.current?.offsetWidth || 0
    const xPos = x / buttonWidth
    const color = `linear-gradient(to right, var(--circle-start) ${xPos * 100}%, var(--circle-end) ${
      xPos * 100
    }%)`

    setCircles((prev) => [
      ...prev,
      { id: Date.now(), x, y, color, fadeState: null },
    ])
  }, [])

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!isListening) return

      const currentTime = Date.now()
      if (currentTime - lastAddedRef.current > 100) {
        lastAddedRef.current = currentTime
        const rect = event.currentTarget.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        createCircle(x, y)
      }
    },
    [isListening, createCircle]
  )

  const handlePointerEnter = React.useCallback(() => {
    setIsListening(true)
  }, [])

  const handlePointerLeave = React.useCallback(() => {
    setIsListening(false)
  }, [])

  React.useEffect(() => {
    circles.forEach((circle) => {
      if (!circle.fadeState) {
        setTimeout(() => {
          setCircles((prev) =>
            prev.map((c) =>
              c.id === circle.id ? { ...c, fadeState: "in" } : c
            )
          )
        }, 0)

        setTimeout(() => {
          setCircles((prev) =>
            prev.map((c) =>
              c.id === circle.id ? { ...c, fadeState: "out" } : c
            )
          )
        }, 1000)

        setTimeout(() => {
          setCircles((prev) => prev.filter((c) => c.id !== circle.id))
        }, 2200)
      }
    })
  }, [circles])

  const baseClassName = cn(
    "relative isolate inline-flex items-center justify-center overflow-hidden rounded-3xl px-8 py-3",
    "text-base leading-6 font-medium text-foreground",
    "backdrop-blur-lg bg-[rgba(43,55,80,0.1)]",
    "cursor-pointer before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[inherit]",
    "before:content-[''] before:shadow-[inset_0_0_0_1px_rgba(170,202,255,0.2),inset_0_0_16px_0_rgba(170,202,255,0.1),inset_0_-3px_12px_0_rgba(170,202,255,0.15),0_1px_3px_0_rgba(0,0,0,0.50),0_4px_12px_0_rgba(0,0,0,0.45)]",
    "before:mix-blend-multiply before:transition-transform before:duration-300 active:before:scale-[0.975]"
  )

  const circleNodes = circles.map(({ id, x, y, color, fadeState }) => (
    <div
      key={id}
      className={cn(
        "pointer-events-none absolute z-[-1] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-lg transition-opacity duration-300",
        fadeState === "in" && "opacity-75",
        fadeState === "out" && "opacity-0 duration-[1.2s]",
        !fadeState && "opacity-0"
      )}
      style={{
        left: x,
        top: y,
        background: color,
      }}
    />
  ))

  const setButtonRef = (node: HTMLElement | null) => {
    buttonRef.current = node
  }

  if (props.href) {
    const { children, className, href, style, ...anchorProps } = props

    return (
      <a
        ref={setButtonRef}
        href={href}
        className={cn(baseClassName, className)}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        style={{
          "--circle-start": "var(--tw-gradient-from, #a0d9f8)",
          "--circle-end": "var(--tw-gradient-to, #3a5bbf)",
          ...style,
        } as React.CSSProperties}
        {...anchorProps}
      >
        {circleNodes}
        {children}
      </a>
    )
  }

  const { children, className, style, type = "button", ...buttonProps } = props

  return (
    <button
      ref={setButtonRef}
      type={type}
      className={cn(baseClassName, className)}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={{
        "--circle-start": "var(--tw-gradient-from, #a0d9f8)",
        "--circle-end": "var(--tw-gradient-to, #3a5bbf)",
        ...style,
      } as React.CSSProperties}
      {...buttonProps}
    >
      {circleNodes}
      {children}
    </button>
  )
}