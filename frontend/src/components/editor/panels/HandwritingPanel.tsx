"use client";

import * as React from "react";
import Link from "next/link";
import { Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/editor/store";
import { TextEl } from "@/lib/editor/types";

export function HandwritingPanel() {
  const { book, activePageIndex, selectedIds, updateElement, saveToStorage } = useEditorStore();

  const handleApplyHandwriting = (fontName: string) => {
    if (!book || selectedIds.length === 0) return;
    const page = book.pages[activePageIndex];
    if (!page) return;

    for (const id of selectedIds) {
      const el = page.elements.find((e) => e.id === id);
      if (el && el.type === "text") {
        updateElement(id, { font: fontName } as Partial<TextEl>);
      }
    }
    saveToStorage();
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent mb-1">
          <Sparkles className="h-3 w-3" /> Signature Feature
        </div>
        <h3 className="font-serif text-base font-medium text-text">My Handwriting</h3>
        <p className="text-xs text-text-muted mt-0.5">
          Write book pages in your personal handwriting font.
        </p>
      </div>

      <div className="rounded-[8px] border border-border bg-accent-soft/30 p-3 space-y-3">
        <div className="text-xs font-medium text-text">Sample Handwriting Fonts:</div>
        <div className="space-y-1.5">
          <button
            onClick={() => handleApplyHandwriting("Caveat")}
            className="flex w-full items-center justify-between rounded border border-border bg-surface px-3 py-2 text-left hover:bg-accent-soft/50 transition-colors"
          >
            <span className="font-serif italic text-sm">Caveat Script</span>
            <span className="text-[10px] text-text-muted">Apply</span>
          </button>
          <button
            onClick={() => handleApplyHandwriting("Special Elite")}
            className="flex w-full items-center justify-between rounded border border-border bg-surface px-3 py-2 text-left hover:bg-accent-soft/50 transition-colors"
          >
            <span className="font-mono text-xs">Special Elite (Typewriter)</span>
            <span className="text-[10px] text-text-muted">Apply</span>
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-border space-y-2">
        <div className="text-xs font-medium text-text">Want your own handwriting?</div>
        <p className="text-[11px] text-text-muted leading-relaxed">
          1. Download the A4 glyph sheet<br />
          2. Fill characters with a dark pen<br />
          3. Upload phone photo to generate font
        </p>
        <Link href="/glyph-template.pdf" target="_blank" className="block pt-1">
          <Button variant="outline" size="sm" className="w-full text-xs">
            <Download className="mr-1.5 h-3.5 w-3.5" /> Download Template PDF
          </Button>
        </Link>
      </div>
    </div>
  );
}
