"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Undo2,
  Redo2,
  MousePointer,
  Hand,
  ZoomIn,
  ZoomOut,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCcw,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoryboundLogo } from "@/components/ui/logo";
import { useEditorStore } from "@/lib/editor/store";

export function TopBar() {
  const {
    book,
    activePageIndex,
    setActivePage,
    zoom,
    activeTool,
    undoStack,
    redoStack,
    saveStatus,
    lastSavedAt,
    undo,
    redo,
    setZoom,
    setActiveTool,
    saveToStorage,
    retrySave,
  } = useEditorStore();

  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [titleValue, setTitleValue] = React.useState(book?.title || "Untitled Book");

  React.useEffect(() => {
    if (book?.title) setTitleValue(book.title);
  }, [book?.title]);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (book && titleValue.trim() && titleValue !== book.title) {
      useEditorStore.setState((state) => {
        if (state.book) {
          state.book.title = titleValue.trim();
        }
      });
      saveToStorage();
    }
  };

  const totalPages = book?.pages.length || 20;

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-4 z-40 select-none shadow-xs">
      {/* Left: Brand, Back & Book Title */}
      <div className="flex items-center gap-3">
        <StoryboundLogo size="sm" iconOnly href="/dashboard" />
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs font-medium text-text-muted hover:text-text hover:bg-accent-soft/60 px-2.5 rounded-[8px]"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Dashboard
          </Button>
        </Link>

        <div className="h-4 w-px bg-border/80" />

        {isEditingTitle ? (
          <input
            type="text"
            className="h-8 rounded-[8px] border border-accent bg-surface px-2.5 text-sm font-serif font-medium text-text shadow-xs focus:outline-none focus:ring-1 focus:ring-accent"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
            autoFocus
          />
        ) : (
          <button
            onClick={() => setIsEditingTitle(true)}
            className="group flex items-center gap-2 rounded-[8px] px-2.5 py-1 text-sm font-serif font-medium tracking-tight text-text hover:bg-accent-soft/60 transition-all border border-transparent hover:border-border"
            title="Click to rename book"
          >
            <span>{book?.title || "Untitled Book"}</span>
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-mono font-medium text-text-muted border border-border/40">
              {book?.size || "A5"}
            </span>
            <Pencil className="h-3 w-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
          </button>
        )}
      </div>

      {/* Center: Luxury Segmented Toolbar (Undo/Redo, Tool, Zoom, Page Switcher) */}
      <div className="flex items-center gap-2">
        {/* Undo / Redo Segment */}
        <div className="flex items-center rounded-[8px] border border-border bg-bg/60 p-0.5 shadow-xs">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-text-muted hover:text-text rounded disabled:opacity-30"
            onClick={undo}
            disabled={undoStack.length === 0}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-text-muted hover:text-text rounded disabled:opacity-30"
            onClick={redo}
            disabled={redoStack.length === 0}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Tool Select / Pan Segment */}
        <div className="flex items-center rounded-[8px] border border-border bg-bg/60 p-0.5 shadow-xs">
          <Button
            variant={activeTool === "select" ? "secondary" : "ghost"}
            size="icon"
            className={`h-7 w-7 rounded transition-all ${
              activeTool === "select" ? "bg-surface text-text shadow-xs font-semibold" : "text-text-muted"
            }`}
            onClick={() => setActiveTool("select")}
            title="Select Tool (V)"
          >
            <MousePointer className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={activeTool === "pan" ? "secondary" : "ghost"}
            size="icon"
            className={`h-7 w-7 rounded transition-all ${
              activeTool === "pan" ? "bg-surface text-text shadow-xs font-semibold" : "text-text-muted"
            }`}
            onClick={() => setActiveTool("pan")}
            title="Hand Pan Tool (H / Space+Drag)"
          >
            <Hand className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Zoom Controls Segment */}
        <div className="flex items-center rounded-[8px] border border-border bg-bg/60 px-1 py-0.5 shadow-xs">
          <button
            onClick={() => setZoom(Math.max(0.2, zoom - 0.15))}
            className="rounded p-1 hover:bg-accent-soft text-text-muted hover:text-text transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setZoom(1.0)}
            className="w-12 text-center font-mono text-[11px] font-semibold text-text hover:text-accent transition-colors"
            title="Click to reset zoom to 100%"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={() => setZoom(Math.min(3.0, zoom + 0.15))}
            className="rounded p-1 hover:bg-accent-soft text-text-muted hover:text-text transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Page Switcher Segment with < Prev and Next > */}
        <div className="flex items-center rounded-[8px] border border-border bg-bg/60 p-0.5 shadow-xs">
          <button
            type="button"
            onClick={() => setActivePage(Math.max(0, activePageIndex - 1))}
            disabled={activePageIndex === 0}
            className="h-7 w-7 rounded flex items-center justify-center hover:bg-surface text-text-muted hover:text-text disabled:opacity-25 transition-colors"
            title="Previous Page (Left Arrow)"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="font-mono text-xs font-medium text-text px-2 min-w-[75px] text-center">
            {activePageIndex === 0 ? "Cover" : `Page ${activePageIndex + 1}`} <span className="text-text-muted">/ {totalPages}</span>
          </span>
          <button
            type="button"
            onClick={() => setActivePage(Math.min(totalPages - 1, activePageIndex + 1))}
            disabled={activePageIndex >= totalPages - 1}
            className="h-7 w-7 rounded flex items-center justify-center hover:bg-surface text-text-muted hover:text-text disabled:opacity-25 transition-colors"
            title="Next Page (Right Arrow)"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Right: Save Status, Preview, Export */}
      <div className="flex items-center gap-3">
        {/* Save Status Indicator */}
        <div className="flex items-center gap-1.5 text-xs text-text-muted bg-surface px-2.5 py-1 rounded-[8px] border border-border shadow-xs">
          {saveStatus === "saving" && (
            <>
              <Loader2 className="h-3 w-3 animate-spin text-accent" />
              <span className="text-[11px] font-mono text-text-muted">Saving…</span>
            </>
          )}

          {saveStatus === "saved" && (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-[11px] font-mono text-text font-medium">
                Saved · {lastSavedAt ? lastSavedAt : "just now"}
              </span>
            </>
          )}

          {saveStatus === "unsaved" && (
            <>
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[11px] font-mono text-text-muted">Unsaved</span>
            </>
          )}

          {saveStatus === "error" && (
            <div className="flex items-center gap-1 text-error">
              <AlertCircle className="h-3 w-3 text-error" />
              <span className="text-[11px] font-mono font-medium">Save error</span>
              <button
                type="button"
                onClick={() => retrySave()}
                className="ml-1 flex items-center gap-0.5 text-[10px] font-mono text-accent underline hover:text-text"
                title="Retry autosave"
              >
                <RotateCcw className="h-2.5 w-2.5" /> Retry
              </button>
            </div>
          )}
        </div>

        {book && (
          <Link href={`/books/${book.id}/preview`}>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 rounded-[8px] border-border hover:bg-accent-soft/60">
              <Eye className="h-3.5 w-3.5 text-accent" /> Preview
            </Button>
          </Link>
        )}

        <Button size="sm" className="h-8 text-xs gap-1.5 bg-accent text-white hover:bg-neutral-800 rounded-[8px] shadow-sm font-medium">
          <Download className="h-3.5 w-3.5" /> Download PDF · ₹50
        </Button>
      </div>
    </header>
  );
}
