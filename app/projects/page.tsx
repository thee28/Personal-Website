import { HoverPanel } from "@/components/ui/hover-panel";

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
          Things I&apos;ve worked on along the way.
        </p>
      </header>

      <div className="space-y-8">
        {projects.map((project) => (
          <HoverPanel key={project.title} className="group p-0">
            <a href={project.href} target="_blank" rel="noopener noreferrer" className="block">
              <div className="p-6">
                <h2 className="mb-3 text-2xl font-medium transition-colors group-hover:text-[var(--muted)] md:text-3xl">
                  {project.title}
                </h2>
                <p className="mb-4 max-w-2xl text-[var(--muted)]">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[var(--foreground)]/5 px-3 py-1 text-sm text-[var(--muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          </HoverPanel>
        ))}
      </div>
    </div>
  );
}
