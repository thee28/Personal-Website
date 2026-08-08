"use client";

import { useState } from "react";

export default function Resume() {
  const pdfUrl = "/resume.pdf";
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="space-y-12 animate-children-in">
      <header>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight">
          Resume
        </h1>
      </header>

      <div className="rounded-2xl overflow-hidden border border-[var(--foreground)]/10 bg-[var(--foreground)]/5">
        {loaded ? (
          <iframe
            src={`${pdfUrl}#toolbar=1`}
            className="w-full min-h-[70vh] aspect-[8.5/11]"
            title="Resume PDF"
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="flex w-full min-h-[70vh] aspect-[8.5/11] flex-col items-center justify-center gap-4 text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            aria-label="Load resume PDF"
          >
            <span className="text-lg font-medium">View resume</span>
            <span className="text-sm">Click to load the PDF</span>
          </button>
        )}
        <div className="p-4 border-t border-[var(--foreground)]/10 flex justify-end">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 rounded-full bg-[var(--foreground)] text-[var(--background)] font-medium hover:opacity-90 transition-opacity text-sm"
          >
            Download PDF
          </a>
        </div>
      </div>
    </div>
  );
}
