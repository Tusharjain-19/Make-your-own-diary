"use client";

import * as React from "react";
import { Square, Circle, Minus } from "lucide-react";
import { useEditorStore } from "@/lib/editor/store";
import { ShapeEl } from "@/lib/editor/types";

export function ElementsPanel() {
  const { addElement } = useEditorStore();

  const handleAddShape = (shape: "rect" | "circle" | "line") => {
    const baseId = `shape-${Date.now()}`;
    const newShape: ShapeEl = {
      id: baseId,
      type: "shape",
      shape,
      x: 30,
      y: 40,
      w: shape === "line" ? 88 : 50,
      h: shape === "line" ? 2 : 50,
      rot: 0,
      z: 1,
      fill: shape === "line" ? "#1A1A1A" : "#F0EEE9",
      stroke: "#E8E6E1",
      strokeW: 0.5,
      opacity: 1,
    };
    addElement(newShape);
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-serif text-base font-medium text-text">Shapes & Lines</h3>
        <p className="text-xs text-text-muted mt-0.5">
          Insert decorative frames, borders, dividers, and accents.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => handleAddShape("rect")}
          className="flex flex-col items-center justify-center gap-2 rounded-[8px] border border-border bg-surface p-4 hover:bg-accent-soft/40 transition-all text-xs font-medium"
        >
          <Square className="h-6 w-6 text-accent" />
          <span>Rectangle</span>
        </button>

        <button
          onClick={() => handleAddShape("circle")}
          className="flex flex-col items-center justify-center gap-2 rounded-[8px] border border-border bg-surface p-4 hover:bg-accent-soft/40 transition-all text-xs font-medium"
        >
          <Circle className="h-6 w-6 text-accent" />
          <span>Circle</span>
        </button>

        <button
          onClick={() => handleAddShape("line")}
          className="col-span-2 flex items-center justify-center gap-2 rounded-[8px] border border-border bg-surface p-3 hover:bg-accent-soft/40 transition-all text-xs font-medium"
        >
          <Minus className="h-5 w-5 text-accent" />
          <span>Horizontal Divider Line</span>
        </button>
      </div>
    </div>
  );
}
