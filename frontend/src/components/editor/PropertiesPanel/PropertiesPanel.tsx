"use client";

import * as React from "react";
import {
  Lock,
  Unlock,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/editor/store";
import { TextEl, ImageEl, ShapeEl } from "@/lib/editor/types";

const FONT_OPTIONS = [
  "Playfair Display",
  "Inter",
  "Lora",
  "Cormorant Garamond",
  "Special Elite",
  "Caveat",
  "Space Grotesk",
  "Poppins",
  "Libre Baskerville",
  "Oswald",
];

export function PropertiesPanel() {
  const {
    book,
    activePageIndex,
    selectedIds,
    updateElement,
    deleteSelected,
    duplicateSelected,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    toggleLockSelected,
  } = useEditorStore();

  const activePage = book?.pages[activePageIndex];
  const selectedElements = activePage?.elements.filter((e) => selectedIds.includes(e.id)) || [];
  const primarySelected = selectedElements[0];

  // If nothing selected: show page properties
  if (!primarySelected) {
    return (
      <aside className="w-[280px] shrink-0 border-l border-border bg-surface p-4 flex flex-col gap-4 z-20 select-none overflow-y-auto">
        <div>
          <h3 className="font-serif text-sm font-semibold text-text">Page Settings</h3>
          <p className="text-[11px] text-text-muted mt-0.5">
            Format: {book?.size || "A5"} · Page {activePageIndex + 1} of {book?.pages.length || 20}
          </p>
        </div>

        <div className="space-y-3 border-t border-border pt-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-text">Page Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="h-8 w-12 rounded cursor-pointer border border-border bg-transparent"
                value={activePage?.bg?.startsWith("#") ? activePage.bg : "#FAFAF8"}
                onChange={(e) => {
                  useEditorStore.setState((state) => {
                    const page = state.book?.pages[state.activePageIndex];
                    if (page) page.bg = e.target.value;
                  });
                }}
              />
              <span className="font-mono text-xs text-text-muted">
                {activePage?.bg?.startsWith("#") ? activePage.bg : "#FAFAF8"}
              </span>
            </div>
          </div>

          <div className="rounded-[8px] bg-accent-soft/40 p-3 text-xs text-text-muted space-y-1">
            <div className="font-medium text-text">Layout Specs:</div>
            <div>Safe Margin: 10 mm</div>
            <div>Bleed Margin: 3 mm</div>
            <div>Page Ratio: {book?.size === "Square" ? "1:1" : "1:1.414"}</div>
          </div>
        </div>

        <div className="pt-2 text-xs text-text-muted">
          Select any element on the page to customize typography, borders, frames, or stacking order.
        </div>
      </aside>
    );
  }

  const isLocked = primarySelected.locked;

  return (
    <aside className="w-[280px] shrink-0 border-l border-border bg-surface p-4 flex flex-col justify-between gap-4 z-20 select-none overflow-y-auto">
      <div className="space-y-4">
        {/* Header with Type & Selection Count */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <span className="font-serif text-sm font-semibold capitalize text-accent">
            {primarySelected.type} Properties
          </span>
          <span className="rounded bg-accent-soft px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
            {selectedIds.length > 1 ? `${selectedIds.length} items` : `z: ${primarySelected.z || 1}`}
          </span>
        </div>

        {/* Action Buttons: Duplicate, Lock, Delete */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs gap-1"
            onClick={duplicateSelected}
            title="Duplicate (Ctrl+D)"
          >
            <Copy className="h-3 w-3" /> Duplicate
          </Button>

          <Button
            variant={isLocked ? "secondary" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={toggleLockSelected}
            title={isLocked ? "Unlock Element" : "Lock Element"}
          >
            {isLocked ? <Lock className="h-3.5 w-3.5 text-danger" /> : <Unlock className="h-3.5 w-3.5 text-text-muted" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-text-muted hover:text-danger"
            onClick={deleteSelected}
            title="Delete (Delete / Backspace)"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* TEXT SPECIFIC CONTROLS */}
        {primarySelected.type === "text" && (
          <div className="space-y-3 border-t border-border pt-3">
            {/* Inline Text Content Editor */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-text">Content</label>
              <textarea
                className="w-full rounded-[6px] border border-border bg-surface p-2 text-xs text-text focus:outline-none focus:ring-1 focus:ring-accent leading-relaxed"
                rows={3}
                value={(primarySelected as TextEl).text}
                onChange={(e) => updateElement(primarySelected.id, { text: e.target.value })}
              />
            </div>

            {/* Font Family */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-text">Font Family</label>
              <select
                className="w-full rounded-[6px] border border-border bg-surface px-2 py-1.5 text-xs text-text focus:outline-none focus:ring-1 focus:ring-accent"
                value={(primarySelected as TextEl).font}
                onChange={(e) => updateElement(primarySelected.id, { font: e.target.value })}
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            {/* Size & Weight */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-text">Size (pt)</label>
                <input
                  type="number"
                  className="w-full rounded-[6px] border border-border bg-surface px-2 py-1 text-xs text-text focus:outline-none"
                  value={(primarySelected as TextEl).size}
                  onChange={(e) =>
                    updateElement(primarySelected.id, { size: Math.max(6, Number(e.target.value)) })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-text">Color</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    className="h-7 w-8 rounded cursor-pointer border border-border bg-transparent"
                    value={(primarySelected as TextEl).color || "#1A1A1A"}
                    onChange={(e) => updateElement(primarySelected.id, { color: e.target.value })}
                  />
                  <span className="font-mono text-[11px] text-text-muted">
                    {(primarySelected as TextEl).color}
                  </span>
                </div>
              </div>
            </div>

            {/* Alignment & Style */}
            <div className="flex items-center justify-between border border-border rounded-[6px] p-1 bg-bg">
              <div className="flex items-center">
                <button
                  onClick={() => updateElement(primarySelected.id, { align: "left" })}
                  className={`p-1.5 rounded ${
                    (primarySelected as TextEl).align === "left" ? "bg-surface shadow-sm text-text" : "text-text-muted"
                  }`}
                  title="Align Left"
                >
                  <AlignLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => updateElement(primarySelected.id, { align: "center" })}
                  className={`p-1.5 rounded ${
                    (primarySelected as TextEl).align === "center" ? "bg-surface shadow-sm text-text" : "text-text-muted"
                  }`}
                  title="Align Center"
                >
                  <AlignCenter className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => updateElement(primarySelected.id, { align: "right" })}
                  className={`p-1.5 rounded ${
                    (primarySelected as TextEl).align === "right" ? "bg-surface shadow-sm text-text" : "text-text-muted"
                  }`}
                  title="Align Right"
                >
                  <AlignRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="h-4 w-px bg-border" />

              <div className="flex items-center">
                <button
                  onClick={() =>
                    updateElement(primarySelected.id, {
                      weight: (primarySelected as TextEl).weight >= 600 ? 400 : 700,
                    })
                  }
                  className={`p-1.5 rounded ${
                    (primarySelected as TextEl).weight >= 600 ? "bg-surface shadow-sm text-text" : "text-text-muted"
                  }`}
                  title="Toggle Bold"
                >
                  <Bold className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() =>
                    updateElement(primarySelected.id, {
                      italic: !(primarySelected as TextEl).italic,
                    })
                  }
                  className={`p-1.5 rounded ${
                    (primarySelected as TextEl).italic ? "bg-surface shadow-sm text-text" : "text-text-muted"
                  }`}
                  title="Toggle Italic"
                >
                  <Italic className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* IMAGE SPECIFIC CONTROLS */}
        {primarySelected.type === "image" && (
          <div className="space-y-3 border-t border-border pt-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-text">Frame Style</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateElement(primarySelected.id, { frame: "none" })}
                  className={`p-2 rounded text-xs border text-center transition-all ${
                    (primarySelected as ImageEl).frame === "none" || !(primarySelected as ImageEl).frame
                      ? "border-accent bg-accent text-white"
                      : "border-border bg-surface text-text hover:bg-accent-soft"
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => updateElement(primarySelected.id, { frame: "polaroid" })}
                  className={`p-2 rounded text-xs border text-center transition-all ${
                    (primarySelected as ImageEl).frame === "polaroid"
                      ? "border-accent bg-accent text-white"
                      : "border-border bg-surface text-text hover:bg-accent-soft"
                  }`}
                >
                  Polaroid
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-text">Corner Radius</label>
              <input
                type="range"
                min="0"
                max="24"
                className="w-full accent-accent cursor-pointer"
                value={(primarySelected as ImageEl).radius || 0}
                onChange={(e) => updateElement(primarySelected.id, { radius: Number(e.target.value) })}
              />
            </div>
          </div>
        )}

        {/* SHAPE SPECIFIC CONTROLS */}
        {primarySelected.type === "shape" && (
          <div className="space-y-3 border-t border-border pt-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-text">Fill Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="h-7 w-10 rounded cursor-pointer border border-border bg-transparent"
                  value={(primarySelected as ShapeEl).fill || "#F0EEE9"}
                  onChange={(e) => updateElement(primarySelected.id, { fill: e.target.value })}
                />
                <span className="font-mono text-xs text-text-muted">
                  {(primarySelected as ShapeEl).fill}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ARRANGE & Z-ORDER CONTROLS (All Elements) */}
        <div className="space-y-2 border-t border-border pt-3">
          <label className="text-[11px] font-medium text-text">Arrange & Stacking Layer</label>
          <div className="grid grid-cols-2 gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs justify-start"
              onClick={bringForward}
              title="Bring Forward"
            >
              <ChevronUp className="mr-1 h-3.5 w-3.5" /> Forward
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs justify-start"
              onClick={sendBackward}
              title="Send Backward"
            >
              <ChevronDown className="mr-1 h-3.5 w-3.5" /> Backward
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs justify-start"
              onClick={bringToFront}
              title="Bring to Front"
            >
              <ArrowUp className="mr-1 h-3.5 w-3.5" /> To Front
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs justify-start"
              onClick={sendToBack}
              title="Send to Back"
            >
              <ArrowDown className="mr-1 h-3.5 w-3.5" /> To Back
            </Button>
          </div>
        </div>

        {/* Element Size & Position Readout (mm) */}
        <div className="rounded-[8px] bg-accent-soft/30 p-2.5 font-mono text-[10px] text-text-muted space-y-0.5 border border-border/60">
          <div>X: {primarySelected.x} mm · Y: {primarySelected.y} mm</div>
          <div>W: {primarySelected.w} mm · H: {primarySelected.h} mm</div>
          <div>Rot: {primarySelected.rot || 0}°</div>
        </div>
      </div>
    </aside>
  );
}
