"use client";

import * as React from "react";
import { layouts } from "@/lib/themes";
import { useEditorStore } from "@/lib/editor/store";
import { ImageEl, TextEl } from "@/lib/editor/types";
import { getPageDimensionsMm } from "@/lib/editor/units";

export function LayoutsPanel() {
  const { book } = useEditorStore();

  const handleApplyLayout = (layoutId: string) => {
    if (!book) return;
    const dim = getPageDimensionsMm(book.size);
    const margin = dim.safeMarginMm;
    const contentW = dim.widthMm - margin * 2;
    const contentH = dim.heightMm - margin * 2;

    useEditorStore.setState((state) => {
      if (!state.book) return;
      const page = state.book.pages[state.activePageIndex];
      if (!page) return;

      page.layoutId = layoutId;

      if (layoutId === "L01") {
        // Full bleed photo
        page.elements = [
          {
            id: `img-${Date.now()}`,
            type: "image",
            src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80",
            x: 0,
            y: 0,
            w: dim.widthMm,
            h: dim.heightMm,
            rot: 0,
            z: 1,
            frame: "none",
          } as ImageEl,
        ];
      } else if (layoutId === "L02") {
        // Photo top, text bottom (50/50)
        page.elements = [
          {
            id: `img-${Date.now()}`,
            type: "image",
            src: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
            x: margin,
            y: margin,
            w: contentW,
            h: contentH * 0.52,
            rot: 0,
            z: 1,
            frame: "none",
            radius: 4,
          } as ImageEl,
          {
            id: `text-h-${Date.now()}`,
            type: "text",
            text: "Sunset at the Ghats",
            font: "Playfair Display",
            size: 22,
            weight: 600,
            color: "#1A1A1A",
            align: "left",
            lineHeight: 1.2,
            letterSpacing: 0,
            x: margin,
            y: margin + contentH * 0.56,
            w: contentW,
            h: 14,
            rot: 0,
            z: 2,
          } as TextEl,
          {
            id: `text-b-${Date.now()}`,
            type: "text",
            text: "The evening bells echoed across the river as rowboats drifted through the holy waters, carrying flickering clay lamps into the twilight.",
            font: "Inter",
            size: 10,
            weight: 400,
            color: "#6B6B66",
            align: "left",
            lineHeight: 1.6,
            letterSpacing: 0,
            x: margin,
            y: margin + contentH * 0.68,
            w: contentW,
            h: 30,
            rot: 0,
            z: 3,
          } as TextEl,
        ];
      } else if (layoutId === "L08") {
        // Quote page
        page.elements = [
          {
            id: `quote-${Date.now()}`,
            type: "text",
            text: "“To travel is to discover that everyone is wrong about other countries.”",
            font: "Playfair Display",
            size: 24,
            weight: 500,
            italic: true,
            color: "#1A1A1A",
            align: "center",
            lineHeight: 1.4,
            letterSpacing: 0,
            x: margin + 10,
            y: dim.heightMm * 0.35,
            w: contentW - 20,
            h: 40,
            rot: 0,
            z: 1,
          } as TextEl,
          {
            id: `author-${Date.now()}`,
            type: "text",
            text: "Aldous Huxley",
            font: "Inter",
            size: 11,
            weight: 500,
            color: "#8A7A66",
            align: "center",
            lineHeight: 1.4,
            letterSpacing: 0.5,
            x: margin + 10,
            y: dim.heightMm * 0.35 + 46,
            w: contentW - 20,
            h: 12,
            rot: 0,
            z: 2,
          } as TextEl,
        ];
      }
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-serif text-base font-medium text-text">Page Layouts</h3>
        <p className="text-xs text-text-muted mt-0.5">
          Select from 15 structured templates. Maps into slots automatically.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
        {layouts.map((layout) => (
          <button
            key={layout.id}
            onClick={() => handleApplyLayout(layout.id)}
            className="flex flex-col items-center justify-between p-3 rounded-[8px] border border-border bg-surface hover:bg-accent-soft/40 transition-all text-center aspect-[3/4]"
          >
            <span className="font-mono text-[10px] text-text-muted">{layout.id}</span>
            <div className="w-12 h-16 rounded border border-dashed border-border bg-accent-soft/50 flex flex-col justify-center items-center p-1 gap-1">
              <div className="w-full h-7 bg-border/80 rounded-[2px]" />
              <div className="w-full h-2 bg-border/50 rounded-[2px]" />
              <div className="w-3/4 h-2 bg-border/40 rounded-[2px]" />
            </div>
            <span className="text-[11px] font-medium text-text line-clamp-1">{layout.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
