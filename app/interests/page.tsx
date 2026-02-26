export default function Interests() {
  const interests = [
    {
      title: "Soccer",
      description: "I've started playing soccer in 6th grade and it has been my favorite sport ever since. I've played for my high school team and plan to play recreationally in college. My favorite team is Liverpool FC in the English Premier League.",
    },
    {
      title: "Guitar + Singing",
      description: "I enjoy playing guitar and singing. I've been playing guitar for about 1 year now and I've always been singing for fun. I've learned to play a few songs by myself and looking for new songs to learn.",
    },
    {
      title: "Anime",
      description: "Growing up in Thailand, I've always enjoyed watching anime since I was a kid. Though I've switched to reading manga, I still enjoy watching them every now and then. My favorites include: One Piece, Gurren Lagann, Reborn! and Studio Ghibli movies.",
    },
    {
      title: "Video Games",
      description: "Playing video games is something that I've always enjoyed. I've played a lot of games over the years and I'm always looking for cool new games to play! My favorites include: Assassin's Creed series, Hitman series, Minecraft, and more.",
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
