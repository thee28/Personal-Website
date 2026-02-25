export default function Interests() {
  const interests = [
    {
      title: "Soccer",
      description: "Playing soccer and watching soccer.",
    },
    {
      title: "Guitar",
      description: "Playing guitar and discovering new music.",
    },
    {
      title: "Singing",
      description: "Singing and discovering new music.",
    },
    {
      title: "Video Games",
      description: "Playing video games and creating video games.",
    },
  ];

  return (
    <div className="space-y-16 animate-children-in">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight">
          Interests
        </h1>
        <p className="text-[var(--muted)] text-lg">
          What keeps me curious and inspired.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {interests.map((item) => (
          <article
            key={item.title}
            className="p-6 rounded-2xl bg-[var(--foreground)]/5 border border-[var(--foreground)]/5 hover:border-[var(--foreground)]/10 transition-colors"
          >
            <h2 className="text-xl font-medium mb-2">{item.title}</h2>
            <p className="text-[var(--muted)]">{item.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
