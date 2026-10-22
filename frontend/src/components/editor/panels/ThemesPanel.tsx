"use client";

import * as React from "react";
import { themes } from "@/lib/themes";
import { useEditorStore } from "@/lib/editor/store";

export function ThemesPanel() {
  const { book, saveToStorage } = useEditorStore();

  const handleApplyTheme = (themeId: string) => {
    if (!book) return;
    const theme = themes.find((t) => t.id === themeId);
    if (!theme) return;

    useEditorStore.setState((state) => {
      if (!state.book) return;
      state.book.themeId = themeId;
      // Recolor theme-token elements on the active page
      const page = state.book.pages[state.activePageIndex];
      if (page) {
        page.bg = theme.palette.bg;
        for (const el of page.elements) {
          if (el.type === "text") {
            if (el.size >= 20) {
              el.font = theme.fonts.heading;
              el.color = theme.palette.primary;
            } else {
              el.font = theme.fonts.body;
              el.color = theme.palette.text;
            }
          }
        }
      }
    });
    saveToStorage();
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-serif text-base font-medium text-text">Themes</h3>
        <p className="text-xs text-text-muted mt-0.5">
          Restyle palettes and typography without deleting existing content.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
        {themes.map((theme) => {
          const isActive = book?.themeId === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => handleApplyTheme(theme.id)}
              className={`flex flex-col text-left p-3 rounded-[8px] border transition-all ${
                isActive
                  ? "border-accent bg-surface ring-1 ring-accent shadow-sm"
                  : "border-border bg-surface hover:bg-accent-soft/40"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-xs text-text">{theme.name}</span>
                <span className="text-[10px] font-mono text-text-muted">
                  {theme.layouts.length} layouts
                </span>
              </div>

              <div
                className="aspect-[4/1] w-full rounded p-2 flex items-center justify-between border border-border/60"
                style={{ backgroundColor: theme.palette.bg }}
              >
                <span
                  className="font-serif text-sm font-semibold truncate"
                  style={{ color: theme.palette.primary }}
                >
                  {theme.fonts.heading}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="h-2.5 w-2.5 rounded-full border border-black/10" style={{ backgroundColor: theme.palette.bg }} />
                  <span className="h-2.5 w-2.5 rounded-full border border-black/10" style={{ backgroundColor: theme.palette.primary }} />
                  <span className="h-2.5 w-2.5 rounded-full border border-black/10" style={{ backgroundColor: theme.palette.accent }} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
