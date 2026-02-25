export default function About() {
  return (
    <div className="space-y-12 lg:space-y-16 animate-children-in">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight">
          About
        </h1>
        <p className="text-[var(--muted)] text-lg">
          A little more about me.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row lg:gap-16 lg:items-start">
        <div className="space-y-12 max-w-2xl flex-1 min-w-0">
        <section>
          <h2 className="text-xl font-medium mb-4 text-[var(--foreground)]">
            Who I am
          </h2>
          <p className="text-[var(--muted)] leading-relaxed">
            I&apos;m a software engineer based in Medford, MA. 
            I was born in Thailand and moved to the United States when I was 11 years old.
            I am currently a freshman at Tufts University majoring in Computer Science with a minor in 
            Music, Sound, and Culture.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4 text-[var(--foreground)]">
            What I do
          </h2>
          <p className="text-[var(--muted)] leading-relaxed">
            I enjoy building and creating things with code. I am currently learning more about web development and video game development.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4 text-[var(--foreground)]">
            Get in touch
          </h2>
          <p className="text-[var(--muted)] leading-relaxed mb-4">
            I&apos;m always open to new opportunities and interesting conversations. 
            Feel free to reach out to my email at <a href="mailto:theetat.thakong@tufts.edu" className="text-[var(--foreground)] hover:text-[var(--muted)] transition-colors">theetat.thakong@tufts.edu</a> or through the links in the header.
          </p>
          <div className="flex gap-4">
            <a
              href="https://github.com/thee28"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--foreground)] hover:text-[var(--muted)] transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/theetat-thakong"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--foreground)] hover:text-[var(--muted)] transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </section>
        </div>

        <div className="shrink-0 w-full lg:w-[380px] xl:w-[420px]">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--foreground)]/5 ring-1 ring-[var(--foreground)]/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://i.imgur.com/VGPJrDU.jpeg"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
