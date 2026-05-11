export default function Interests() {
  const interests = [
    {
      title: "Soccer",
      description: "Soccer's been my thing since 6th grade. I played for my high school team and will probably keep playing recreationally in college. YNWA!",
    },
    {
      title: "Guitar + Singing",
      description: "I've been playing guitar for about a year now and I've always sung just for fun. I've picked up a few songs on my own and I'm always on the lookout for new ones to learn.",
    },
    {
      title: "Anime",
      description: "Growing up in Thailand, anime was just part of my childhood. These days I've mostly switched to reading manga, but I still watch every now and then. Some of my favorites are One Piece, Gurren Lagann, JoJo's Bizarre Adventure, Reborn!, and Studio Ghibli movies.",
    },
    {
      title: "Video Games",
      description: "I've been into video games for as long as I can remember. Always looking for cool new stuff to play. Big fan of Assassin's Creed, Hitman, Minecraft, Zelda, and plenty of others.",
    },

  ];

  return (
    <div className="space-y-16 animate-children-in">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight">
          Interests
        </h1>
        <p className="text-[var(--muted)] text-lg">
          The stuff I can't stop thinking about
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
