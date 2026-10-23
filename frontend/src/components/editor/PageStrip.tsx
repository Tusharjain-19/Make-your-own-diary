"use client";

import * as React from "react";
import {
  Plus,
  Copy,
  Trash2,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";
import { useEditorStore } from "@/lib/editor/store";
import { Button } from "@/components/ui/button";

export function PageStrip() {
  const {
    book,
    activePageIndex,
    setActivePage,
    addPage,
    duplicatePage,
    deletePage,
    reorderPages,
  } = useEditorStore();

  const [draggedIdx, setDraggedIdx] = React.useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = React.useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const pages = book?.pages || [];
  const isSquare = book?.size === "Square";

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIdx !== null && draggedIdx !== targetIndex) {
      reorderPages(draggedIdx, targetIndex);
    }
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  if (isCollapsed) {
    return (
      <footer className="h-9 shrink-0 border-t border-border bg-surface px-4 flex items-center justify-between z-30 select-none shadow-xs text-xs animate-in fade-in duration-100">
        <div className="flex items-center gap-2">
          <span className="font-serif font-semibold text-text">Pages</span>
          <span className="font-mono text-[11px] text-text-muted">({pages.length})</span>
          <div className="h-3.5 w-px bg-border mx-1" />
          <button
            type="button"
            onClick={() => setActivePage(Math.max(0, activePageIndex - 1))}
            disabled={activePageIndex === 0}
            className="p-1 rounded hover:bg-accent-soft text-text-muted hover:text-text disabled:opacity-25 transition-colors"
            title="Previous Page (ArrowLeft)"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="font-mono text-[11px] font-medium text-text px-1">
            {activePageIndex === 0 ? "Cover" : `Page ${activePageIndex + 1}`} of {pages.length}
          </span>
          <button
            type="button"
            onClick={() => setActivePage(Math.min(pages.length - 1, activePageIndex + 1))}
            disabled={activePageIndex >= pages.length - 1}
            className="p-1 rounded hover:bg-accent-soft text-text-muted hover:text-text disabled:opacity-25 transition-colors"
            title="Next Page (ArrowRight)"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-surface hover:bg-accent-soft text-text text-xs transition-colors shadow-2xs font-medium"
          title="Show Page Thumbnails (Bottom Preview)"
        >
          <ChevronUp className="h-3.5 w-3.5 text-text-muted" />
          <span>Show Bottom Preview</span>
        </button>
      </footer>
    );
  }

  return (
    <footer className="h-[110px] shrink-0 border-t border-border bg-surface px-4 py-2.5 flex items-center gap-3 z-30 select-none">
      <div className="flex flex-col items-start justify-center pr-2 border-r border-border shrink-0">
        <div className="flex items-center justify-between w-full gap-2">
          <span className="font-serif text-xs font-semibold text-text">Pages</span>
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="p-0.5 rounded hover:bg-accent-soft text-text-muted hover:text-text transition-colors"
            title="Hide Bottom Page Preview (Can see or not see)"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
        <span className="font-mono text-[10px] text-text-muted">
          {pages.length} total
        </span>

        {/* Prev / Next Page Buttons */}
        <div className="flex items-center gap-1 mt-1.5">
          <button
            type="button"
            onClick={() => setActivePage(Math.max(0, activePageIndex - 1))}
            disabled={activePageIndex === 0}
            className="p-1 rounded border border-border hover:bg-accent-soft text-text-muted hover:text-text disabled:opacity-25 transition-colors shadow-2xs"
            title="Previous Page (Left Arrow Key)"
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => setActivePage(Math.min(pages.length - 1, activePageIndex + 1))}
            disabled={activePageIndex >= pages.length - 1}
            className="p-1 rounded border border-border hover:bg-accent-soft text-text-muted hover:text-text disabled:opacity-25 transition-colors shadow-2xs"
            title="Next Page (Right Arrow Key)"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Horizontally scrollable thumbnail list */}
      <div className="flex-1 flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-thin">
        {pages.map((page, idx) => {
          const isActive = activePageIndex === idx;
          const isCover = idx === 0;
          const isBeingDragged = draggedIdx === idx;
          const isDropTarget = dragOverIdx === idx && draggedIdx !== idx;

          return (
            <div
              key={page.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              className={`relative group shrink-0 flex flex-col items-center gap-1 transition-all ${
                isBeingDragged ? "opacity-30 scale-95" : ""
              }`}
            >
              {/* Insertion Guide indicator */}
              {isDropTarget && (
                <div
                  className={`absolute -left-1.5 top-0 bottom-4 w-1 rounded bg-accent z-20 shadow-sm animate-pulse`}
                />
              )}

              {/* Thumbnail Container */}
              <button
                type="button"
                onClick={() => setActivePage(idx)}
                className={`relative overflow-hidden rounded-[4px] border transition-all text-left shadow-sm ${
                  isSquare ? "w-14 h-14" : "w-12 h-16"
                } ${
                  isActive
                    ? "border-accent ring-2 ring-accent/20 bg-surface"
                    : "border-border hover:border-text-muted/40 bg-surface/80"
                }`}
                style={{ backgroundColor: page.bg || "#FFFFFF" }}
              >
                {/* Mini visual representation of page content */}
                {isCover ? (
                  <div className="flex h-full w-full flex-col items-center justify-center p-1 text-center bg-accent-soft/30">
                    <span className="font-serif text-[7px] font-semibold text-text leading-tight truncate w-full">
                      {book?.title || "Cover"}
                    </span>
                    <span className="font-mono text-[5px] text-text-muted mt-0.5">
                      COVER
                    </span>
                  </div>
                ) : (
                  <div className="flex h-full w-full flex-col justify-between p-1">
                    <div className="flex flex-col gap-0.5">
                      {page.elements.slice(0, 3).map((el, elIdx) => (
                        <div
                          key={el.id || elIdx}
                          className="h-1 rounded-[1px] bg-text/15"
                          style={{
                            width: el.type === "image" ? "80%" : "60%",
                            backgroundColor: el.type === "image" ? "#C29B38" : "rgba(26,26,26,0.15)",
                          }}
                        />
                      ))}
                    </div>
                    <span className="self-end font-mono text-[6px] text-text-muted">
                      {page.elements.length > 0 ? `${page.elements.length} el` : "blank"}
                    </span>
                  </div>
                )}
              </button>

              {/* Page Number Label & drag handle indicator */}
              <div className="flex items-center gap-0.5">
                <span
                  className={`font-mono text-[9px] ${
                    isActive ? "font-semibold text-accent" : "text-text-muted"
                  }`}
                >
                  {isCover ? "Cover" : `p.${idx + 1}`}
                </span>
                <GripVertical className="h-2 w-2 text-text-muted/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
              </div>

              {/* Hover Actions Bar */}
              <div className="absolute -top-1 -right-1 hidden group-hover:flex items-center gap-0.5 bg-surface rounded shadow-md border border-border p-0.5 z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicatePage(idx);
                  }}
                  className="p-1 rounded hover:bg-accent-soft text-text-muted hover:text-text"
                  title="Duplicate page"
                >
                  <Copy className="h-2.5 w-2.5" />
                </button>
                {pages.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePage(idx);
                    }}
                    className="p-1 rounded hover:bg-red-50 text-text-muted hover:text-danger"
                    title="Delete page"
                  >
                    <Trash2 className="h-2.5 w-2.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add Page Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={addPage}
          className={`shrink-0 flex flex-col items-center justify-center gap-1 border-dashed border-border hover:border-accent text-text-muted hover:text-text rounded-[4px] p-0 ${
            isSquare ? "w-14 h-14" : "w-12 h-16"
          }`}
          title="Add blank page"
        >
          <Plus className="h-4 w-4" />
          <span className="text-[8px] font-mono">Add</span>
        </Button>
      </div>
    </footer>
  );
}
