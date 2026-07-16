"use client";

const images = [
  "https://i.imgur.com/KdwEm7X.jpeg",
  "https://i.imgur.com/0OTSFXQ.jpeg",
  "https://i.imgur.com/Ukk7ytH.jpeg",
  "https://i.imgur.com/4K85HhE.jpeg",
  "https://i.imgur.com/IhPf6Ds.jpeg",
  "https://i.imgur.com/cCtIIjC.jpeg",
  "https://i.imgur.com/yZNF6uS.jpeg",
  "https://i.imgur.com/Pes1jZg.jpeg",
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
