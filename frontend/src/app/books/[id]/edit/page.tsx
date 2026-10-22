"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  Layers,
  Palette,
  Eye,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";
import { getThemeById } from "@/lib/themes";

export default function BookEditorPage() {
  const params = useParams();
  const bookId = params?.id as string;

  const { user, getBookById, getBookPages } = useAuth();
  const [activePageIndex, setActivePageIndex] = React.useState(0);

  const book = getBookById(bookId);
  const pages = getBookPages(bookId);
  const theme = book ? getThemeById(book.themeId) : undefined;

  if (!book) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg p-6 text-center">
        <h2 className="font-serif text-2xl font-medium text-text">Book Not Found</h2>
        <p className="mt-2 text-sm text-text-muted">
          The requested book either does not exist or belongs to another user account (RLS protected).
        </p>
        <Link href="/dashboard" className="mt-6">
          <Button variant="outline">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Return to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const activePage = pages[activePageIndex] || { position: activePageIndex + 1, data: { bg: "var(--bg)", elements: [] } };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg text-text selection:bg-accent-soft selection:text-text">
      {/* Editor Top Bar (56px) */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-4 z-30">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="h-8 text-xs text-text-muted">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Dashboard
            </Button>
          </Link>

          <div className="h-4 w-px bg-border" />

          <div className="flex items-center gap-2">
            <span className="font-serif text-sm font-medium tracking-tight text-text">
              {book.title}
            </span>
            <span className="rounded bg-accent-soft px-2 py-0.5 text-[10px] font-mono text-text-muted">
              {book.size} · {theme?.name || book.themeId}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-text-muted">
            <CheckCircle2 className="h-3 w-3 text-success" />
            <span className="text-[11px]">Saved · just now</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs text-text-muted font-mono">
            {pages.length} Pages Initialized
          </span>
          <Link href={`/books/${book.id}/preview`}>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Eye className="h-3.5 w-3.5" /> Preview
            </Button>
          </Link>
          <Button size="sm" className="h-8 text-xs gap-1.5">
            <Download className="h-3.5 w-3.5" /> Export PDF (₹50)
          </Button>
        </div>
      </header>

      {/* Editor Main Canvas Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Tool Rail (72px) */}
        <aside className="w-[72px] shrink-0 border-r border-border bg-surface flex flex-col items-center py-4 gap-4 z-20">
          <button className="flex flex-col items-center gap-1 text-text-muted hover:text-text text-[10px] font-medium p-2 rounded-[8px] hover:bg-accent-soft w-14">
            <Palette className="h-5 w-5" />
            Themes
          </button>
          <button className="flex flex-col items-center gap-1 text-text-muted hover:text-text text-[10px] font-medium p-2 rounded-[8px] hover:bg-accent-soft w-14">
            <Layers className="h-5 w-5" />
            Layouts
          </button>
          <button className="flex flex-col items-center gap-1 text-text-muted hover:text-text text-[10px] font-medium p-2 rounded-[8px] hover:bg-accent-soft w-14">
            <BookOpen className="h-5 w-5" />
            Text
          </button>
          <button className="flex flex-col items-center gap-1 text-text-muted hover:text-text text-[10px] font-medium p-2 rounded-[8px] hover:bg-accent-soft w-14">
            <Sliders className="h-5 w-5" />
            Elements
          </button>
        </aside>

        {/* Center Workspace Stage */}
        <main className="flex-1 overflow-auto bg-accent-soft/30 p-8 flex flex-col items-center justify-center relative">
          <div className="mb-3 flex items-center justify-between w-full max-w-[420px] text-xs font-mono text-text-muted">
            <span>PAGE {activePageIndex + 1} OF {pages.length}</span>
            <span>{book.size === "A5" ? "148 × 210 mm" : book.size === "A4" ? "210 × 297 mm" : "203 × 203 mm"}</span>
          </div>

          {/* Active Page Stage Preview */}
          <div
            className={`w-full max-w-[420px] shadow-card rounded-[6px] border border-border p-8 flex flex-col justify-between transition-all duration-150 ${
              book.size === "Square" ? "aspect-square" : "aspect-[148/210]"
            }`}
            style={{ backgroundColor: theme?.palette.bg || "#FFFFFF" }}
          >
            {activePageIndex === 0 ? (
              /* Cover Page */
              <div className="flex-1 flex flex-col justify-between text-center py-8">
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                  {book.dates || "Front Cover"}
                </span>

                <div className="space-y-3">
                  <h1
                    className="font-serif text-3xl font-semibold tracking-tight"
                    style={{ color: theme?.palette.primary || "var(--text)" }}
                  >
                    {book.title}
                  </h1>
                  {book.subtitle && (
                    <p className="text-xs italic text-text-muted" style={{ color: theme?.palette.muted }}>
                      {book.subtitle}
                    </p>
                  )}
                  <div
                    className="h-0.5 w-10 mx-auto rounded"
                    style={{ backgroundColor: theme?.palette.accent || "var(--accent)" }}
                  />
                </div>

                <div className="text-xs font-medium text-text">
                  By {book.author || user?.name}
                </div>
              </div>
            ) : (
              /* Content Page */
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-text-muted">
                    Chapter Opener · Layout {activePage.data?.layoutId || "L01"}
                  </span>
                  <div className="rounded border border-dashed border-border/80 p-6 text-center bg-surface/50">
                    <p className="text-xs text-text-muted">
                      Blank Page Slot ready for Konva Stage (Day 5)
                    </p>
                    <p className="text-[11px] font-mono text-text-muted mt-1">
                      1 mm = 4 px scale · Safe Margin: {theme?.defaults.marginMm || 10} mm
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-text-muted pt-4 border-t border-border/40">
                  <span>Storybound Book</span>
                  <span>Page {activePageIndex + 1}</span>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Bottom Page Strip (110px) */}
      <footer className="h-[110px] shrink-0 border-t border-border bg-surface px-6 py-3 flex items-center gap-3 overflow-x-auto z-20">
        <span className="text-xs font-mono text-text-muted shrink-0 mr-2">
          {pages.length} PAGES:
        </span>

        <div className="flex items-center gap-3">
          {pages.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePageIndex(idx)}
              className={`shrink-0 flex flex-col items-center gap-1 p-1 rounded-[6px] border transition-all ${
                activePageIndex === idx
                  ? "border-accent bg-accent-soft ring-1 ring-accent"
                  : "border-border hover:bg-accent-soft/40"
              }`}
            >
              <div className="h-14 w-10 rounded border border-border bg-bg flex items-center justify-center text-[10px] font-mono text-text-muted shadow-sm">
                {idx === 0 ? "Cover" : idx + 1}
              </div>
              <span className="text-[9px] font-mono text-text-muted">p.{idx + 1}</span>
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
