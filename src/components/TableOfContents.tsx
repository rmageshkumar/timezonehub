"use client";

import { useState, useEffect, useMemo } from "react";
import { List, X } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(html: string): TocItem[] {
  const items: TocItem[] = [];
  // Match h2 and h3 tags
  const regex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]*>/g, "").trim();
    const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    items.push({ id, text, level: parseInt(match[1]) });
  }
  return items;
}

export function TableOfContents({ content }: { content: string }) {
  const [activeId, setActiveId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const headings = useMemo(() => extractHeadings(content), [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <>
      {/* Mobile TOC toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500"
        >
          <List className="w-4 h-4" />
          {isOpen ? "Hide" : "Show"} table of contents
        </button>
        {isOpen && (
          <div className="mt-3 p-4 glass rounded-xl">
            <TocList headings={headings} activeId={activeId} onClick={() => setIsOpen(false)} />
          </div>
        )}
      </div>

      {/* Desktop TOC sidebar */}
      <aside className="hidden lg:block w-56 flex-shrink-0">
        <div className="sticky top-24">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            On this page
          </h4>
          <nav className="border-l-2 border-slate-200 dark:border-slate-700">
            <TocList headings={headings} activeId={activeId} />
          </nav>
        </div>
      </aside>
    </>
  );
}

function TocList({
  headings,
  activeId,
  onClick,
}: {
  headings: TocItem[];
  activeId: string;
  onClick?: () => void;
}) {
  return (
    <ul className="space-y-1">
      {headings.map((h) => (
        <li key={h.id} style={{ paddingLeft: h.level === 3 ? "12px" : "0" }}>
          <a
            href={`#${h.id}`}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(h.id);
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                // Push state for proper history
                history.pushState(null, "", `#${h.id}`);
              }
              onClick?.();
            }}
            className={`block py-1 text-sm border-l-2 -ml-px pl-3 transition-colors ${
              activeId === h.id
                ? "border-primary-500 text-primary-600 dark:text-primary-400 font-medium"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300"
            }`}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
