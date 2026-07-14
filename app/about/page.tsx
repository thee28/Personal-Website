import AboutPortrait from "../components/AboutPortrait";
import { Analytics } from "@vercel/analytics/next";

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

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">
        <div className="max-w-2xl min-w-0 flex-1 space-y-12">
          <section>
            <h2 className="mb-4 text-xl font-medium text-[var(--foreground)]">
              Who I am
            </h2>
            <p className="leading-relaxed text-[var(--muted)]">
              I&apos;m a software engineer based in Medford, MA. I was born in Thailand and moved to
              the US when I was 11. Right now I&apos;m a freshman at Tufts University studying
              Computer Science with a minor in Music, Sound, and Culture.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-medium text-[var(--foreground)]">
              What I do
            </h2>
            <p className="leading-relaxed text-[var(--muted)]">
              I enjoy building and creating things with code. I am currently learning more about
              web development and video game development.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-medium text-[var(--foreground)]">
              Get in touch
            </h2>
            <p className="mb-4 leading-relaxed text-[var(--muted)]">
              I&apos;m always open to new opportunities and interesting conversations. Feel free to
              reach out to my email at{" "}
              <a
                href="mailto:theetat.thakong@tufts.edu"
                className="text-[var(--foreground)] transition-colors hover:text-[var(--muted)]"
              >
                theetat.thakong@tufts.edu
              </a>{" "}
              or through the links in the header.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/thee28"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--foreground)] transition-colors hover:text-[var(--muted)]"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/theetat-thakong"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--foreground)] transition-colors hover:text-[var(--muted)]"
              >
                LinkedIn
              </a>
            </div>
          </section>
        </div>

        <div className="shrink-0 w-full lg:w-[380px] xl:w-[420px]">
          <AboutPortrait />
        </div>
      </div>
    </div>
  );
}
