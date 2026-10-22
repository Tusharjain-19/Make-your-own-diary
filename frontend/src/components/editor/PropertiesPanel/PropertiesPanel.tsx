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
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Palette,
  Check,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/editor/store";
import { TextEl, ImageEl, ShapeEl, IconEl } from "@/lib/editor/types";
import { calculateDpi, isLowResolution } from "@/lib/editor/images";
import { FontPicker } from "../FontPicker";
import { ColorPicker } from "../ColorPicker";
import { themes } from "@/lib/themes";
import { useToast } from "@/components/ui/toast";

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
    saveToStorage,
  } = useEditorStore();

  const { showToast } = useToast();

  const activePage = book?.pages[activePageIndex];
  const selectedElements = activePage?.elements.filter((e) => selectedIds.includes(e.id)) || [];
  const primarySelected = selectedElements[0];

  // Palette recolor action (Day 11 Prompt)
  const handleApplyPalette = (themeId: string) => {
    const selectedTheme = themes.find((t) => t.id === themeId);
    if (!selectedTheme || !activePage) return;

    useEditorStore.setState((state) => {
      const page = state.book?.pages[state.activePageIndex];
      if (!page) return;

      // 1. Recolor page background
      page.bg = selectedTheme.palette.bg;

      // 2. Recolor elements based on theme tokens without altering coordinates or layouts
      page.elements.forEach((el) => {
        if (el.type === "text") {
          const textEl = el as TextEl;
          if (textEl.size >= 18 || textEl.themeToken === "primary") {
            textEl.color = selectedTheme.palette.primary;
          } else if (textEl.italic || textEl.themeToken === "accent") {
            textEl.color = selectedTheme.palette.accent;
          } else {
            textEl.color = selectedTheme.palette.text;
          }
        } else if (el.type === "shape") {
          const shapeEl = el as ShapeEl;
          if (shapeEl.shape === "line" || shapeEl.shape === "divider-rule" || shapeEl.shape === "divider-dotted") {
            shapeEl.stroke = selectedTheme.palette.accent;
          } else if (shapeEl.shape === "stamp") {
            shapeEl.stroke = selectedTheme.palette.accent;
            shapeEl.fill = selectedTheme.palette.bg;
          } else if (shapeEl.shape === "frame-arch") {
            shapeEl.stroke = selectedTheme.palette.primary;
            shapeEl.fill = selectedTheme.palette.bg;
          } else {
            shapeEl.fill = selectedTheme.palette.surface;
          }
        } else if (el.type === "icon") {
          const iconEl = el as IconEl;
          iconEl.color = selectedTheme.palette.accent;
        }
      });
    });

    saveToStorage();
    showToast("success", `Applied ${selectedTheme.name} palette to page`);
  };

  // If nothing selected: show page properties & palette presets
  if (!primarySelected) {
    return (
      <aside className="w-[280px] shrink-0 border-l border-border bg-surface p-4 flex flex-col gap-4 z-20 select-none overflow-y-auto">
        <div>
          <h3 className="font-serif text-sm font-semibold text-text">Page Settings</h3>
          <p className="text-[11px] text-text-muted mt-0.5">
            Format: {book?.size || "A5"} · Page {activePageIndex + 1} of {book?.pages.length || 20}
          </p>
        </div>

        {/* Page Background Color */}
        <div className="space-y-3 border-t border-border pt-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-text">Page Background Color</label>
            <ColorPicker
              color={activePage?.bg || "#FAFAF8"}
              onChange={(hex) => {
                useEditorStore.setState((state) => {
                  const page = state.book?.pages[state.activePageIndex];
                  if (page) page.bg = hex;
                });
                saveToStorage();
              }}
            />
          </div>

          {/* Quick Paper Tints */}
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
              Classic Paper Tints
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { name: "White", hex: "#FFFFFF" },
                { name: "Natural", hex: "#FAFAF8" },
                { name: "Cream", hex: "#F4F1EA" },
                { name: "Parchment", hex: "#F3E9D2" },
                { name: "Dark Luxury", hex: "#0E0E0E" },
              ].map((tint) => (
                <button
                  key={tint.hex}
                  onClick={() => {
                    useEditorStore.setState((state) => {
                      const page = state.book?.pages[state.activePageIndex];
                      if (page) page.bg = tint.hex;
                    });
                    saveToStorage();
                  }}
                  className="h-6 rounded border border-border flex items-center justify-center hover:scale-105 transition-transform"
                  style={{ backgroundColor: tint.hex }}
                  title={tint.name}
                >
                  {activePage?.bg === tint.hex && (
                    <Check
                      className={`h-3 w-3 ${tint.hex === "#0E0E0E" ? "text-white" : "text-black"}`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 10 Theme Palette Presets & Apply Action */}
        <div className="space-y-2 border-t border-border pt-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-text flex items-center gap-1.5">
              <Palette className="h-3.5 w-3.5 text-accent" /> Theme Palettes
            </label>
            <span className="text-[10px] text-text-muted">10 presets</span>
          </div>
          <p className="text-[11px] text-text-muted">
            Apply a curated palette to recolor background, headings, and accents without breaking layouts.
          </p>

          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {themes.map((th) => (
              <button
                key={th.id}
                onClick={() => handleApplyPalette(th.id)}
                className="flex w-full items-center justify-between rounded-[6px] border border-border bg-surface p-2 text-left hover:bg-accent-soft/40 transition-colors group"
              >
                <span className="text-xs font-medium text-text truncate pr-2">{th.name}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <div className="h-3.5 w-3.5 rounded-full border border-border" style={{ backgroundColor: th.palette.bg }} />
                  <div className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: th.palette.primary }} />
                  <div className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: th.palette.accent }} />
                  <div className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: th.palette.muted }} />
                </div>
              </button>
            ))}
          </div>
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

        {/* TEXT SPECIFIC CONTROLS (Day 10) */}
        {primarySelected.type === "text" && (
          <div className="space-y-3 border-t border-border pt-3">
            {/* Inline Text Content Area */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-text">Content (or double-click canvas)</label>
              <textarea
                className="w-full rounded-[6px] border border-border bg-surface p-2 text-xs text-text focus:outline-none focus:ring-1 focus:ring-accent leading-relaxed"
                rows={2}
                value={(primarySelected as TextEl).text}
                onChange={(e) => updateElement(primarySelected.id, { text: e.target.value })}
              />
            </div>

            {/* Font Family Picker with Live Face Previews */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-text">Font Family (20 Typefaces)</label>
              <FontPicker
                currentFont={(primarySelected as TextEl).font || "Playfair Display"}
                onSelectFont={(fontName) => updateElement(primarySelected.id, { font: fontName })}
              />
            </div>

            {/* Font Size & Weight */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-text">Size (pt)</label>
                <input
                  type="number"
                  min="6"
                  max="120"
                  className="w-full rounded-[6px] border border-border bg-surface px-2 py-1.5 text-xs text-text focus:outline-none"
                  value={(primarySelected as TextEl).size}
                  onChange={(e) =>
                    updateElement(primarySelected.id, { size: Math.max(6, Number(e.target.value)) })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-text">Weight</label>
                <select
                  value={(primarySelected as TextEl).weight || 400}
                  onChange={(e) => updateElement(primarySelected.id, { weight: Number(e.target.value) })}
                  className="w-full rounded-[6px] border border-border bg-surface px-2 py-1.5 text-xs text-text focus:outline-none"
                >
                  <option value={300}>300 Light</option>
                  <option value={400}>400 Regular</option>
                  <option value={500}>500 Medium</option>
                  <option value={600}>600 SemiBold</option>
                  <option value={700}>700 Bold</option>
                </select>
              </div>
            </div>

            {/* Text Color Picker */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-text">Color</label>
              <ColorPicker
                color={(primarySelected as TextEl).color || "#1A1A1A"}
                onChange={(hex) => updateElement(primarySelected.id, { color: hex })}
              />
            </div>

            {/* Alignment & Style Buttons */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-text">Alignment & Styles</label>
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
                  <button
                    onClick={() => updateElement(primarySelected.id, { align: "justify" })}
                    className={`p-1.5 rounded ${
                      (primarySelected as TextEl).align === "justify" ? "bg-surface shadow-sm text-text" : "text-text-muted"
                    }`}
                    title="Justify"
                  >
                    <AlignJustify className="h-3.5 w-3.5" />
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
                  <button
                    onClick={() =>
                      updateElement(primarySelected.id, {
                        underline: !(primarySelected as TextEl).underline,
                      })
                    }
                    className={`p-1.5 rounded ${
                      (primarySelected as TextEl).underline ? "bg-surface shadow-sm text-text" : "text-text-muted"
                    }`}
                    title="Toggle Underline"
                  >
                    <Underline className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Line Height & Letter Spacing */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-text">
                  <span>Line Height</span>
                  <span className="font-mono text-[10px] text-text-muted">
                    {(primarySelected as TextEl).lineHeight || 1.3}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="2.5"
                  step="0.1"
                  value={(primarySelected as TextEl).lineHeight || 1.3}
                  onChange={(e) => updateElement(primarySelected.id, { lineHeight: Number(e.target.value) })}
                  className="w-full accent-accent cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-text">
                  <span>Letter Spacing</span>
                  <span className="font-mono text-[10px] text-text-muted">
                    {(primarySelected as TextEl).letterSpacing || 0}
                  </span>
                </div>
                <input
                  type="range"
                  min="-1"
                  max="6"
                  step="0.5"
                  value={(primarySelected as TextEl).letterSpacing || 0}
                  onChange={(e) => updateElement(primarySelected.id, { letterSpacing: Number(e.target.value) })}
                  className="w-full accent-accent cursor-pointer"
                />
              </div>
            </div>

            {/* Rotation */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-text">
                <span className="flex items-center gap-1">
                  <RotateCw className="h-3 w-3 text-text-muted" /> Rotation
                </span>
                <span className="font-mono text-[10px] text-text-muted">
                  {primarySelected.rot || 0}°
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={primarySelected.rot || 0}
                onChange={(e) => updateElement(primarySelected.id, { rot: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
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

            {/* Print DPI & Low-Resolution Warning */}
            {(() => {
              const imgEl = primarySelected as ImageEl;
              const dpi = calculateDpi(imgEl.originalWidth, imgEl.w);
              const isLow = isLowResolution(imgEl.originalWidth, imgEl.w);

              return (
                <div
                  className={`rounded-[8px] p-2.5 text-xs space-y-1 border ${
                    isLow
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-900"
                      : "bg-accent-soft/40 border-border text-text-muted"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span>Print Resolution:</span>
                    <span className="font-semibold">{dpi} DPI</span>
                  </div>
                  {isLow && (
                    <div className="text-[10px] text-amber-800">
                      Warning: Low print resolution. Image may look pixelated in physical print.
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* SHAPE SPECIFIC CONTROLS (Day 11) */}
        {primarySelected.type === "shape" && (
          <div className="space-y-3 border-t border-border pt-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-text">Fill Color</label>
              <ColorPicker
                color={(primarySelected as ShapeEl).fill || "#F0EEE9"}
                onChange={(hex) => updateElement(primarySelected.id, { fill: hex })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-text">Border / Line Stroke</label>
              <ColorPicker
                color={(primarySelected as ShapeEl).stroke || "#1A1A1A"}
                onChange={(hex) => updateElement(primarySelected.id, { stroke: hex })}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-text">
                <span>Stroke Width</span>
                <span className="font-mono text-[10px] text-text-muted">
                  {(primarySelected as ShapeEl).strokeW || 0.5} mm
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.25"
                value={(primarySelected as ShapeEl).strokeW || 0.5}
                onChange={(e) => updateElement(primarySelected.id, { strokeW: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* ICON SPECIFIC CONTROLS (Day 11) */}
        {primarySelected.type === "icon" && (
          <div className="space-y-3 border-t border-border pt-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-text">Icon Color</label>
              <ColorPicker
                color={(primarySelected as IconEl).color || "#1A1A1A"}
                onChange={(hex) => updateElement(primarySelected.id, { color: hex })}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-text">
                <span>Opacity</span>
                <span className="font-mono text-[10px] text-text-muted">
                  {Math.round(((primarySelected as IconEl).opacity ?? 1) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={(primarySelected as IconEl).opacity ?? 1}
                onChange={(e) => updateElement(primarySelected.id, { opacity: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* ARRANGE & Z-ORDER CONTROLS */}
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
