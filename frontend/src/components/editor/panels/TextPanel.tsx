"use client";

import * as React from "react";
import { Heading1, Heading2, AlignLeft, Quote } from "lucide-react";
import { useEditorStore } from "@/lib/editor/store";
import { TextEl } from "@/lib/editor/types";

export function TextPanel() {
  const { addElement } = useEditorStore();

  const handleAddText = (preset: "heading" | "subheading" | "body" | "quote") => {
    let newText: TextEl;
    const baseId = `text-${Date.now()}`;

    switch (preset) {
      case "heading":
        newText = {
          id: baseId,
          type: "text",
          text: "Add a Heading",
          font: "Playfair Display",
          size: 26,
          weight: 600,
          color: "#1A1A1A",
          align: "left",
          lineHeight: 1.2,
          letterSpacing: 0,
          x: 20,
          y: 35,
          w: 108,
          h: 16,
          rot: 0,
          z: 1,
        };
        break;
      case "subheading":
        newText = {
          id: baseId,
          type: "text",
          text: "Add a Subheading",
          font: "Playfair Display",
          size: 18,
          weight: 500,
          color: "#1A1A1A",
          align: "left",
          lineHeight: 1.3,
          letterSpacing: 0,
          x: 20,
          y: 55,
          w: 108,
          h: 12,
          rot: 0,
          z: 1,
        };
        break;
      case "quote":
        newText = {
          id: baseId,
          type: "text",
          text: "“Travel makes one modest. You see what a tiny place you occupy in the world.”",
          font: "Lora",
          size: 14,
          weight: 400,
          italic: true,
          color: "#1A1A1A",
          align: "center",
          lineHeight: 1.5,
          letterSpacing: 0,
          x: 24,
          y: 75,
          w: 100,
          h: 24,
          rot: 0,
          z: 1,
        };
        break;
      case "body":
      default:
        newText = {
          id: baseId,
          type: "text",
          text: "Write your travel memory here. Describe the sights, sounds, local flavors, and people who made the day unforgettable.",
          font: "Inter",
          size: 10.5,
          weight: 400,
          color: "#4A4A45",
          align: "left",
          lineHeight: 1.6,
          letterSpacing: 0,
          x: 20,
          y: 80,
          w: 108,
          h: 28,
          rot: 0,
          z: 1,
        };
        break;
    }

    addElement(newText);
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-serif text-base font-medium text-text">Text Presets</h3>
        <p className="text-xs text-text-muted mt-0.5">
          Click a text preset to add it to the active canvas page.
        </p>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => handleAddText("heading")}
          className="flex w-full items-center gap-3 rounded-[8px] border border-border bg-surface p-3 text-left transition-all hover:bg-accent-soft/40 hover:shadow-sm"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded bg-accent-soft text-accent">
            <Heading1 className="h-4 w-4" />
          </div>
          <div>
            <div className="font-serif text-lg font-medium text-text">Add a heading</div>
            <div className="text-[11px] text-text-muted">Playfair Display · 26pt</div>
          </div>
        </button>

        <button
          onClick={() => handleAddText("subheading")}
          className="flex w-full items-center gap-3 rounded-[8px] border border-border bg-surface p-3 text-left transition-all hover:bg-accent-soft/40 hover:shadow-sm"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded bg-accent-soft text-accent">
            <Heading2 className="h-4 w-4" />
          </div>
          <div>
            <div className="font-serif text-base font-medium text-text">Add a subheading</div>
            <div className="text-[11px] text-text-muted">Playfair Display · 18pt</div>
          </div>
        </button>

        <button
          onClick={() => handleAddText("body")}
          className="flex w-full items-center gap-3 rounded-[8px] border border-border bg-surface p-3 text-left transition-all hover:bg-accent-soft/40 hover:shadow-sm"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded bg-accent-soft text-accent">
            <AlignLeft className="h-4 w-4" />
          </div>
          <div>
            <div className="font-sans text-sm font-normal text-text">Add body text</div>
            <div className="text-[11px] text-text-muted">Inter · 10.5pt</div>
          </div>
        </button>

        <button
          onClick={() => handleAddText("quote")}
          className="flex w-full items-center gap-3 rounded-[8px] border border-border bg-surface p-3 text-left transition-all hover:bg-accent-soft/40 hover:shadow-sm"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded bg-accent-soft text-accent">
            <Quote className="h-4 w-4" />
          </div>
          <div>
            <div className="font-serif text-sm italic text-text">Add a quote</div>
            <div className="text-[11px] text-text-muted">Lora Italic · 14pt</div>
          </div>
        </button>
      </div>
    </div>
  );
}
