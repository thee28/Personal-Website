import { HoverPanel } from "@/components/ui/hover-panel";

export default function Projects() {
  const projects = [
    {
      title: "Pitchside",
      description:
        "Built a full-stack historical dashboard for the completed 2026 World Cup: group standings, an interactive knockout bracket, team scout reports with radar charts, player stat pages, and tournament leaderboards. FastAPI async backend serves data from a PostgreSQL store seeded by a Pandas ETL pipeline, with a React + Tailwind frontend mirroring a finalized design export.",
      tags: ["React", "TypeScript", "Tailwind", "FastAPI", "PostgreSQL", "Docker"],
      href: "https://pitchsidedata.app/",
    },
    {
      title: "TuneBug",
      description:
        "Built a gamified music-learning web app that turns ear training and music theory into a game. Learners climb a Duolingo-style path of stages, units, and lessons, with 20 exercise types across ear training, pitch, reading, and rhythm. Features live microphone pitch detection (sing to match a note), XP, streaks, hearts, daily quests, spaced-repetition mastery, and weekly leaderboards. Full-stack Next.js 16 with real-time audio via Tone.js and pitchy.",
      tags: ["TypeScript", "Next.js", "React", "Prisma", "PostgreSQL", "Tone.js", "Tailwind", "NextAuth", "Vercel"],
      href: "https://tunebug.app/",
    },
    {
      title: "a11yGuard | JumboHack 2026 AI Track Winner 🏆",
      description: "Collaborated in a team of 6 to build a project in the AI track of the 2026 JumboHack Hackathon at Tufts University. a11yGuard is a GitHub Action Workflow that checks for accessibility issues in a GitHub repository when a pull request is created and incorporates Gemini LLM API for automated code fixes and feedback.",
      tags: ["JavaScript", "TypeScript", "Yaml", "Openrouter", "Next.js", "Vercel"],
      href: "https://a11yguardsite.vercel.app/",
    },
  ];

  return (
    <div className="space-y-16 animate-children-in">
      <header>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight">
          Projects
        </h1>
      </header>

      <div className="space-y-8">
        {projects.map((project) => (
          <HoverPanel key={project.title} className="group p-0">
            {(() => {
              const inner = (
                <div className="p-6">
                  <h2 className="mb-3 text-2xl font-medium transition-colors group-hover:text-[var(--muted)] md:text-3xl">
                    {project.title}
                  </h2>
                  <p className="mb-4 max-w-4xl text-[var(--muted)]">
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
              );
              return project.href ? (
                <a href={project.href} target="_blank" rel="noopener noreferrer" className="block">
                  {inner}
                </a>
              ) : (
                inner
              );
            })()}
          </HoverPanel>
        ))}
      </div>
    </div>
  );
}
