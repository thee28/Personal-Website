import type { Metadata } from "next";
import "./globals.css";
import { Header } from "./components/Header";
import { PageTransition } from "./components/PageTransition";

export const metadata: Metadata = {
  title: "Personal Portfolio",
  description: "A clean, elegant personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='light')document.documentElement.setAttribute('data-theme','light');})();`,
          }}
        />
      </head>
      <body className="antialiased min-h-screen font-sans">
        <Header />
        <main className="pt-16 sm:pt-20 md:pt-24 pb-16 px-4 sm:px-6 md:px-12 lg:px-24 max-w-6xl mx-auto">
          <PageTransition>{children}</PageTransition>
        </main>
      </body>
    </html>
  );
}
