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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/editor/store";

export function TopBar() {
  const {
    book,
    activePageIndex,
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
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-4 z-40 select-none">
      {/* Left: Back Arrow & Book Title */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="h-8 text-xs text-text-muted hover:text-text">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Dashboard
          </Button>
        </Link>

        <div className="h-4 w-px bg-border" />

        {isEditingTitle ? (
          <input
            type="text"
            className="h-8 rounded-[6px] border border-accent bg-surface px-2 text-sm font-serif font-medium text-text focus:outline-none"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
            autoFocus
          />
        ) : (
          <button
            onClick={() => setIsEditingTitle(true)}
            className="flex items-center gap-2 rounded px-2 py-1 text-sm font-serif font-medium tracking-tight text-text hover:bg-accent-soft/60"
            title="Click to rename book"
          >
            <span>{book?.title || "Untitled Book"}</span>
            <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-mono text-text-muted">
              {book?.size || "A5"}
            </span>
          </button>
        )}
      </div>

      {/* Center: Undo/Redo, Tools, Zoom, Page Indicator */}
      <div className="flex items-center gap-1.5">
        {/* Undo / Redo */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-text-muted hover:text-text disabled:opacity-30"
          onClick={undo}
          disabled={undoStack.length === 0}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-text-muted hover:text-text disabled:opacity-30"
          onClick={redo}
          disabled={redoStack.length === 0}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="h-3.5 w-3.5" />
        </Button>

        <div className="h-4 w-px bg-border mx-1" />

        {/* Tool Select / Pan */}
        <Button
          variant={activeTool === "select" ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => setActiveTool("select")}
          title="Select Tool (V)"
        >
          <MousePointer className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant={activeTool === "pan" ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => setActiveTool("pan")}
          title="Hand Pan Tool (H / Space+Drag)"
        >
          <Hand className="h-3.5 w-3.5" />
        </Button>

        <div className="h-4 w-px bg-border mx-1" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 rounded-[6px] border border-border bg-bg px-1 py-0.5 text-xs">
          <button
            onClick={() => setZoom(zoom - 0.15)}
            className="rounded p-1 hover:bg-accent-soft text-text-muted hover:text-text"
            title="Zoom out"
          >
            <ZoomOut className="h-3 w-3" />
          </button>
          <span className="w-12 text-center font-mono text-[11px] font-medium text-text">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(zoom + 0.15)}
            className="rounded p-1 hover:bg-accent-soft text-text-muted hover:text-text"
            title="Zoom in"
          >
            <ZoomIn className="h-3 w-3" />
          </button>
        </div>

        <div className="h-4 w-px bg-border mx-1" />

        {/* Page Indicator */}
        <span className="font-mono text-xs text-text-muted">
          Page {activePageIndex + 1} of {totalPages}
        </span>
      </div>

      {/* Right: Save Status, Preview, Export */}
      <div className="flex items-center gap-3">
        {/* Save Status Indicator (Day 7 prompt) */}
        <div className="flex items-center gap-1.5 text-xs text-text-muted bg-surface-container-low px-2 py-1 rounded-[6px] border border-border">
          {saveStatus === "saving" && (
            <>
              <Loader2 className="h-3 w-3 animate-spin text-accent" />
              <span className="text-[11px] font-mono text-text-muted">Saving…</span>
            </>
          )}

          {saveStatus === "saved" && (
            <>
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              <span className="text-[11px] font-mono text-text">
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
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Eye className="h-3.5 w-3.5" /> Preview
            </Button>
          </Link>
        )}

        <Button size="sm" className="h-8 text-xs gap-1.5 bg-accent text-white hover:bg-neutral-800">
          <Download className="h-3.5 w-3.5" /> Download PDF · ₹50
        </Button>
      </div>
    </header>
  );
}
