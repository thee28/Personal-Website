"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LiquidButton } from "@/components/ui/liquid-button";
import { WaveText } from "@/components/ui/wave-text";
import { PhotoGallery } from "./PhotoGallery";

export function HomePage() {
  const router = useRouter();
  const [reveal, setReveal] = useState(false);

  const buttonEvents = useMemo(
    () => ({ click: () => router.push("/projects") }),
    [router]
  );

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setReveal(true);
      return;
    }

    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setReveal(true));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={`flex min-h-[70vh] flex-col gap-16 ${reveal ? "home-reveal--play" : "home-reveal--idle"}`}
    >
      <section className="home-reveal-stagger flex min-w-0 flex-1 flex-col space-y-6">
        <p className="home-reveal-item text-sm tracking-widest text-[var(--muted)] uppercase">
          👋 Hello, I&apos;m
        </p>
        <h1 className="home-reveal-item text-5xl font-medium tracking-tight text-[var(--foreground)] md:text-6xl lg:text-7xl">
          <WaveText text="Theetat Thakong" />
        </h1>
        <p className="home-reveal-item max-w-2xl text-xl leading-relaxed text-[var(--muted)] md:text-2xl">
          I am a freshman at Tufts University majoring in Computer Science with a minor in
          Music, Sound, and Culture.
        </p>
        <div className="home-reveal-item pt-4">
          <LiquidButton
            label="View my work"
            events={buttonEvents}
            className="rounded-full px-8 py-3 text-base font-medium"
          />
        </div>
      </section>

      <div className="home-reveal-item home-reveal-gallery -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-12 md:px-12 lg:-mx-24 lg:px-24">
        <PhotoGallery />
      </div>
    </div>
  );
}
