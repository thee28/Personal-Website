"use client";

const images = [
  "https://picsum.photos/seed/1/400/400",
  "https://picsum.photos/seed/2/400/400",
  "https://picsum.photos/seed/3/400/400",
  "https://picsum.photos/seed/4/400/400",
  "https://picsum.photos/seed/5/400/400",
  "https://picsum.photos/seed/6/400/400",
  "https://picsum.photos/seed/7/400/400",
  "https://picsum.photos/seed/8/400/400",
];

export function PhotoGallery() {
  return (
    <div className="group w-full overflow-hidden mask-fade-edges">
      <div className="flex gap-4 animate-marquee">
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
            />
          </div>
        ))}
      </div>
    </div>
  );
}
