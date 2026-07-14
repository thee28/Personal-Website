import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { SmokeBackground } from "@/components/ui/spooky-smoke-animation";
import { Header } from "./components/Header";
import { PageTransition } from "./components/PageTransition";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "Theetat Thakong",
  description: "Theetat Thakong's personal portfolio website",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value === "light" ? "light" : "dark";

  return (
    <html lang="en" data-theme={theme === "light" ? "light" : undefined}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="relative min-h-screen overflow-x-hidden font-sans antialiased">
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
          <SmokeBackground
            className="block size-full opacity-100"
            darkColor="#f5f5f5"
            lightColor="#18181b"
            darkOpacity={0.62}
            lightOpacity={0.82}
          />
        </div>
        <div className="relative z-10">
          <Header initialTheme={theme} />
          <main className="mx-auto max-w-6xl px-4 pt-20 pb-16 sm:px-6 sm:pt-24 md:px-12 md:pt-28 lg:px-24">
            <div
              id="header-scroll-sentinel"
              className="h-px w-full shrink-0"
              aria-hidden
            />
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
