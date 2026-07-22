"use client";

// imgur "l" suffix = 640px variant (~40KB) instead of the full-res original
// (up to 3.6MB). Boxes render at most 234px, so 640px stays sharp on retina
// while cutting decode/download that was janking the homepage on refresh.
const images = [
  "https://i.imgur.com/KdwEm7Xl.jpeg",
  "https://i.imgur.com/0OTSFXQl.jpeg",
  "https://i.imgur.com/Ukk7ytHl.jpeg",
  "https://i.imgur.com/4K85HhEl.jpeg",
  "https://i.imgur.com/IhPf6Dsl.jpeg",
  "https://i.imgur.com/cCtIIjCl.jpeg",
  "https://i.imgur.com/yZNF6uSl.jpeg",
  "https://i.imgur.com/Pes1jZgl.jpeg",
];

export function PhotoGallery() {
  return (
    <div className="group w-full overflow-hidden mask-fade-edges py-10 sm:py-12 md:py-14">
      <div className="inline-flex flex-nowrap items-center gap-8 sm:gap-10 md:gap-12 lg:gap-14 animate-marquee">
        {[...images, ...images].map((src, i) => (
          <div
            key={i}
            className={`shrink-0 w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] md:w-[234px] md:h-[234px] rounded-lg overflow-hidden bg-[var(--foreground)]/5 ${
              i % 2 === 0 ? "-rotate-2" : "rotate-2"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
