export default function Projects() {
  const projects = [
    {
      title: "a11yGuard | JumboHack 2026 AI Track Winner 🏆",
      description: "Collaborated in a team of 6 to build a project in the AI track of the 2026 JumboHack Hackathon at Tufts University. a11yGuard is a GitHub Action Workflow that checks for accessibility issues in a GitHub repository when a pull request is created and incorporates Gemini LLM API for automated code fixes and feedback.",
      tags: ["JavaScript", "TypeScript", "Yaml", "Openrouter", "Next.js", "Vercel"],
      href: "https://a11yguardsite.vercel.app/",
    },

  ];

  return (
    <div className="space-y-16 animate-children-in">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight">
          Projects
        </h1>
        <p className="text-[var(--muted)] text-lg">
          Things I&apos;ve built and shipped.
        </p>
      </header>

      <div className="grid gap-12 md:gap-16 animate-children-in">
        {projects.map((project, i) => (
          <article
            key={project.title}
            className="group border-b border-[var(--foreground)]/10 pb-12 last:border-0"
          >
            <a href={project.href} target="_blank" rel="noopener noreferrer" className="block">
              <h2 className="text-2xl md:text-3xl font-medium mb-3 group-hover:text-[var(--muted)] transition-colors">
                {project.title}
              </h2>
              <p className="text-[var(--muted)] mb-4 max-w-2xl">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm rounded-full bg-[var(--foreground)]/5 text-[var(--muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
