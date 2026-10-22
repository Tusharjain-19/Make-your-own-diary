"use client";

import * as React from "react";
import { Plus, Copy, Trash2 } from "lucide-react";
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
  } = useEditorStore();

  const pages = book?.pages || [];
  const isSquare = book?.size === "Square";

  return (
    <footer className="h-[110px] shrink-0 border-t border-border bg-surface px-4 py-2.5 flex items-center gap-3 z-30 select-none">
      <div className="flex flex-col items-start justify-center pr-2 border-r border-border shrink-0">
        <span className="font-serif text-xs font-semibold text-text">Pages</span>
        <span className="font-mono text-[10px] text-text-muted">
          {pages.length} total
        </span>
      </div>

      {/* Horizontally scrollable thumbnail list */}
      <div className="flex-1 flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-thin">
        {pages.map((page, idx) => {
          const isActive = activePageIndex === idx;
          const isCover = idx === 0;

          return (
            <div
              key={page.id}
              className="relative group shrink-0 flex flex-col items-center gap-1"
            >
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

              {/* Page Number Label */}
              <span
                className={`font-mono text-[9px] ${
                  isActive ? "font-semibold text-accent" : "text-text-muted"
                }`}
              >
                {isCover ? "Cover" : `p.${idx + 1}`}
              </span>

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
