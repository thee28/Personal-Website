import { PhotoGallery } from "./components/PhotoGallery";

export default function Home() {
  return (
    <div className="min-h-[70vh] flex flex-col gap-16">
      <section className="space-y-6 animate-children-in flex-1 min-w-0">
        <p className="text-[var(--muted)] text-sm tracking-widest uppercase">
          👋 Hello, I&apos;m
        </p>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-[var(--foreground)]">
          Theetat Thakong
        </h1>
        <p className="text-xl md:text-2xl text-[var(--muted)] max-w-2xl leading-relaxed">
          I am a freshman at Tufts University majoring in Computer Science with a minor in 
          Music, Sound, and Culture.
        </p>
        <div className="pt-4">
          <a
            href="/projects"
            className="inline-block px-6 py-3 rounded-full bg-[var(--foreground)] text-[var(--background)] font-medium hover:opacity-90 transition-opacity"
          >
            View my work
          </a>
        </div>
      </section>

      <div className="animate-children-in -mx-4 sm:-mx-6 md:-mx-12 lg:-mx-24 px-4 sm:px-6 md:px-12 lg:px-24">
        <PhotoGallery />
      </div>
    </div>
  );
}
