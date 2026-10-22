"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/editor/store";
import { TextEl, ImageEl, ShapeEl, IconEl } from "@/lib/editor/types";
import { FontPicker } from "./FontPicker";
import { ColorPicker } from "./ColorPicker";
import { themes } from "@/lib/themes";
import { useToast } from "@/components/ui/toast";
import {
  SvgTransparency,
  SvgPaintRoller,
  SvgTextEffects,
  SvgHollowText,
  SvgUppercase,
  SvgStrikethrough,
  SvgFlipHorizontal,
  SvgFlipVertical,
  SvgBold,
  SvgItalic,
  SvgUnderline,
  SvgAlignLeft,
  SvgAlignCenter,
  SvgAlignRight,
  SvgAlignJustify,
  SvgSpacing,
  SvgBorder,
  SvgLayerUp,
  SvgLayerDown,
  SvgLock,
  SvgUnlock,
  SvgDuplicate,
  SvgTrash,
  SvgPalette,
  SvgMinus,
  SvgPlus,
  SvgCheck,
  SvgMargins,
  SvgPrintBleed,
} from "./EditorSvgIcons";

export function ContextToolbar() {
  const {
    book,
    activePageIndex,
    selectedIds,
    updateElement,
    deleteSelected,
    duplicateSelected,
    bringForward,
    sendBackward,
    toggleLockSelected,
    flipHorizontalSelected,
    flipVerticalSelected,
    copyStyle,
    copiedStyle,
    showMargins,
    showBleed,
    toggleMargins,
    toggleBleed,
    setPageBackground,
    saveToStorage,
  } = useEditorStore();

  const { showToast } = useToast();

  const [applyBgToAll, setApplyBgToAll] = React.useState(false);
  const [isOpacityOpen, setIsOpacityOpen] = React.useState(false);
  const [isBorderOpen, setIsBorderOpen] = React.useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = React.useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = React.useState(false);
  const [isEffectsOpen, setIsEffectsOpen] = React.useState(false);

  const opacityRef = React.useRef<HTMLDivElement | null>(null);
  const borderRef = React.useRef<HTMLDivElement | null>(null);
  const spacingRef = React.useRef<HTMLDivElement | null>(null);
  const paletteRef = React.useRef<HTMLDivElement | null>(null);
  const effectsRef = React.useRef<HTMLDivElement | null>(null);

  // Close popovers on outside click
  React.useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (opacityRef.current && !opacityRef.current.contains(target)) setIsOpacityOpen(false);
      if (borderRef.current && !borderRef.current.contains(target)) setIsBorderOpen(false);
      if (spacingRef.current && !spacingRef.current.contains(target)) setIsSpacingOpen(false);
      if (paletteRef.current && !paletteRef.current.contains(target)) setIsPaletteOpen(false);
      if (effectsRef.current && !effectsRef.current.contains(target)) setIsEffectsOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const activePage = book?.pages[activePageIndex];
  const selectedElements = activePage?.elements.filter((e) => selectedIds.includes(e.id)) || [];
  const primarySelected = selectedElements[0];

  // Palette recolor action
  const handleApplyPalette = (themeId: string) => {
    const selectedTheme = themes.find((t) => t.id === themeId);
    if (!selectedTheme || !activePage) return;

    useEditorStore.setState((state) => {
      const page = state.book?.pages[state.activePageIndex];
      if (!page) return;

      page.bg = selectedTheme.palette.bg;

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
          if (shapeEl.shape === "tape") {
            shapeEl.fill = selectedTheme.palette.accent;
          } else if (shapeEl.shape === "divider-rule" || shapeEl.shape === "cute-wavy") {
            shapeEl.stroke = selectedTheme.palette.accent;
          } else if (shapeEl.shape === "frame-arch") {
            shapeEl.stroke = selectedTheme.palette.accent;
            shapeEl.fill = selectedTheme.palette.bg;
          }
        } else if (el.type === "icon") {
          const iconEl = el as IconEl;
          iconEl.color = selectedTheme.palette.accent;
        }
      });
    });

    saveToStorage();
    showToast("success", `Applied ${selectedTheme.name} palette to page`);
    setIsPaletteOpen(false);
  };

  // Current Opacity (0 to 100%)
  const currentOpacityPercent = primarySelected
    ? Math.round((primarySelected.opacity ?? 1) * 100)
    : 100;

  const handleOpacityChange = (percent: number) => {
    if (!primarySelected) return;
    const val = Math.max(0, Math.min(100, percent)) / 100;
    updateElement(primarySelected.id, { opacity: val });
  };

  // ROOT / PAGE VIEW SETTINGS (When nothing is selected)
  if (!primarySelected) {
    return (
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-surface px-4 z-40 select-none text-xs overflow-visible">
        <div className="flex items-center gap-3">
          <span className="font-serif font-medium text-text">Page Background:</span>
          <div className="w-40">
            <ColorPicker
              color={activePage?.bg || "#FAFAF8"}
              onChange={(hex) => {
                setPageBackground(hex, applyBgToAll);
                saveToStorage();
                if (applyBgToAll) {
                  showToast("success", `Applied background color to all ${book?.pages.length || 20} pages`);
                }
              }}
            />
          </div>

          {/* Scope Selector: This Page vs All Pages */}
          <div className="flex items-center rounded-[6px] border border-border bg-bg p-0.5">
            <button
              type="button"
              onClick={() => setApplyBgToAll(false)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                !applyBgToAll
                  ? "bg-surface shadow-xs text-text font-semibold"
                  : "text-text-muted hover:text-text"
              }`}
              title="Change background for this page only"
            >
              This Page
            </button>
            <button
              type="button"
              onClick={() => {
                setApplyBgToAll(true);
                if (activePage?.bg) {
                  setPageBackground(activePage.bg, true);
                  saveToStorage();
                  showToast("success", `Applied background color to all ${book?.pages.length || 20} pages`);
                }
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                applyBgToAll
                  ? "bg-accent text-white shadow-xs font-semibold"
                  : "text-text-muted hover:text-text"
              }`}
              title="Apply background to all pages across entire book"
            >
              All Pages ({book?.pages.length || 20})
            </button>
          </div>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Quick Paper Tints */}
          <div className="flex items-center gap-1.5">
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
                  setPageBackground(tint.hex, applyBgToAll);
                  saveToStorage();
                  if (applyBgToAll) {
                    showToast("success", `Applied ${tint.name} background to all ${book?.pages.length || 20} pages`);
                  }
                }}
                className={`h-5 w-5 rounded-full border transition-all ${
                  activePage?.bg?.toLowerCase() === tint.hex.toLowerCase()
                    ? "ring-2 ring-accent scale-110"
                    : "border-border hover:scale-105"
                }`}
                style={{ backgroundColor: tint.hex }}
                title={`${tint.name}${applyBgToAll ? " (All pages)" : ""}`}
              />
            ))}
          </div>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Palette Presets Menu */}
          <div className="relative" ref={paletteRef}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaletteOpen(!isPaletteOpen)}
              className="h-8 text-xs gap-1.5"
            >
              <SvgPalette size={14} className="text-accent" />
              <span>Palettes ({themes.length})</span>
            </Button>

            {isPaletteOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-64 rounded-[10px] border border-border bg-surface p-2.5 shadow-card z-50 animate-in fade-in-50 zoom-in-95">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Apply Palette to Page
                </div>
                <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                  {themes.map((th) => (
                    <button
                      key={th.id}
                      onClick={() => handleApplyPalette(th.id)}
                      className="flex w-full items-center justify-between rounded p-1.5 hover:bg-accent-soft/40 transition-colors text-left"
                    >
                      <span className="text-xs text-text truncate pr-1">{th.name}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <div className="h-3 w-3 rounded-full border" style={{ backgroundColor: th.palette.bg }} />
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: th.palette.primary }} />
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: th.palette.accent }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* View Settings & Canvas Toggles */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-border rounded-[6px] h-8 bg-surface p-0.5">
            <button
              onClick={toggleMargins}
              className={`px-2 h-full flex items-center gap-1.5 rounded text-[11px] font-medium transition-colors ${
                showMargins ? "bg-accent-soft text-text" : "text-text-muted hover:text-text"
              }`}
              title="Toggle Safe Margins (Canva Show Margins)"
            >
              <SvgMargins size={14} />
              <span>Margins</span>
            </button>
            <button
              onClick={toggleBleed}
              className={`px-2 h-full flex items-center gap-1.5 rounded text-[11px] font-medium transition-colors border-l border-border ${
                showBleed ? "bg-accent-soft text-text" : "text-text-muted hover:text-text"
              }`}
              title="Toggle Print Bleed & Cut Boundary (Canva Show Print Bleed)"
            >
              <SvgPrintBleed size={14} />
              <span>Bleed</span>
            </button>
          </div>

          <div className="text-[11px] text-text-muted font-mono">
            <span>{book?.size || "A5"} ({activePageIndex === 0 ? "Cover" : `Page ${activePageIndex + 1}`})</span>
          </div>
        </div>
      </div>
    );
  }

  const isLocked = primarySelected.locked;

  return (
    <div className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-surface px-4 z-40 select-none text-xs overflow-visible">
      {/* Left: Element Specific Controls */}
      <div className="flex items-center gap-2 shrink-0 overflow-visible">
        {/* TEXT CONTROLS */}
        {primarySelected.type === "text" && (
          <>
            {/* Font Picker with visible overflowing dropdown */}
            <div className="w-44 shrink-0">
              <FontPicker
                currentFont={(primarySelected as TextEl).font || "Playfair Display"}
                onSelectFont={(fontName) => updateElement(primarySelected.id, { font: fontName })}
              />
            </div>

            {/* Size +/- step buttons */}
            <div className="flex items-center border border-border rounded-[6px] h-8 bg-surface">
              <button
                type="button"
                onClick={() =>
                  updateElement(primarySelected.id, {
                    size: Math.max(6, (primarySelected as TextEl).size - 1),
                  })
                }
                className="px-2 h-full hover:bg-accent-soft text-text-muted hover:text-text rounded-l"
                title="Decrease font size"
              >
                <SvgMinus size={12} />
              </button>
              <input
                type="number"
                min="6"
                max="140"
                value={(primarySelected as TextEl).size}
                onChange={(e) =>
                  updateElement(primarySelected.id, { size: Math.max(6, Number(e.target.value)) })
                }
                className="w-10 text-center text-xs font-mono bg-transparent border-x border-border h-full focus:outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  updateElement(primarySelected.id, {
                    size: Math.min(140, (primarySelected as TextEl).size + 1),
                  })
                }
                className="px-2 h-full hover:bg-accent-soft text-text-muted hover:text-text rounded-r"
                title="Increase font size"
              >
                <SvgPlus size={12} />
              </button>
            </div>

            {/* Text Color Picker */}
            <div className="w-28">
              <ColorPicker
                color={(primarySelected as TextEl).color || "#1A1A1A"}
                onChange={(hex) => updateElement(primarySelected.id, { color: hex })}
              />
            </div>

            {/* Bold, Italic, Underline, Strikethrough, Uppercase (aA) */}
            <div className="flex items-center border border-border rounded-[6px] p-0.5 bg-bg h-8">
              <button
                onClick={() =>
                  updateElement(primarySelected.id, {
                    weight: (primarySelected as TextEl).weight >= 600 ? 400 : 700,
                  })
                }
                className={`p-1.5 rounded ${
                  (primarySelected as TextEl).weight >= 600 ? "bg-surface shadow-xs text-text" : "text-text-muted"
                }`}
                title="Bold"
              >
                <SvgBold size={14} />
              </button>
              <button
                onClick={() =>
                  updateElement(primarySelected.id, {
                    italic: !(primarySelected as TextEl).italic,
                  })
                }
                className={`p-1.5 rounded ${
                  (primarySelected as TextEl).italic ? "bg-surface shadow-xs text-text" : "text-text-muted"
                }`}
                title="Italic"
              >
                <SvgItalic size={14} />
              </button>
              <button
                onClick={() =>
                  updateElement(primarySelected.id, {
                    underline: !(primarySelected as TextEl).underline,
                  })
                }
                className={`p-1.5 rounded ${
                  (primarySelected as TextEl).underline ? "bg-surface shadow-xs text-text" : "text-text-muted"
                }`}
                title="Underline"
              >
                <SvgUnderline size={14} />
              </button>
              <button
                onClick={() =>
                  updateElement(primarySelected.id, {
                    strikethrough: !(primarySelected as TextEl).strikethrough,
                  })
                }
                className={`p-1.5 rounded ${
                  (primarySelected as TextEl).strikethrough ? "bg-surface shadow-xs text-text" : "text-text-muted"
                }`}
                title="Strikethrough"
              >
                <SvgStrikethrough size={14} />
              </button>
              <button
                onClick={() =>
                  updateElement(primarySelected.id, {
                    uppercase: !(primarySelected as TextEl).uppercase,
                  })
                }
                className={`p-1.5 rounded ${
                  (primarySelected as TextEl).uppercase ? "bg-surface shadow-xs text-text font-bold" : "text-text-muted"
                }`}
                title="Uppercase toggle (aA)"
              >
                <SvgUppercase size={14} />
              </button>
            </div>

            {/* Alignment Buttons */}
            <div className="flex items-center border border-border rounded-[6px] p-0.5 bg-bg h-8">
              <button
                onClick={() => updateElement(primarySelected.id, { align: "left" })}
                className={`p-1.5 rounded ${
                  (primarySelected as TextEl).align === "left" ? "bg-surface shadow-xs text-text" : "text-text-muted"
                }`}
                title="Align Left"
              >
                <SvgAlignLeft size={14} />
              </button>
              <button
                onClick={() => updateElement(primarySelected.id, { align: "center" })}
                className={`p-1.5 rounded ${
                  (primarySelected as TextEl).align === "center" ? "bg-surface shadow-xs text-text" : "text-text-muted"
                }`}
                title="Align Center"
              >
                <SvgAlignCenter size={14} />
              </button>
              <button
                onClick={() => updateElement(primarySelected.id, { align: "right" })}
                className={`p-1.5 rounded ${
                  (primarySelected as TextEl).align === "right" ? "bg-surface shadow-xs text-text" : "text-text-muted"
                }`}
                title="Align Right"
              >
                <SvgAlignRight size={14} />
              </button>
              <button
                onClick={() => updateElement(primarySelected.id, { align: "justify" })}
                className={`p-1.5 rounded ${
                  (primarySelected as TextEl).align === "justify" ? "bg-surface shadow-xs text-text" : "text-text-muted"
                }`}
                title="Justify"
              >
                <SvgAlignJustify size={14} />
              </button>
            </div>

            {/* Line Height & Spacing Popover */}
            <div className="relative" ref={spacingRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSpacingOpen(!isSpacingOpen)}
                className="h-8 text-xs gap-1"
                title="Line height and letter spacing"
              >
                <SvgSpacing size={14} />
                <span>Spacing</span>
              </Button>

              {isSpacingOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-56 rounded-[10px] border border-border bg-surface p-3 shadow-card z-50 animate-in fade-in-50 zoom-in-95 space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-text">
                      <span>Line Height</span>
                      <span className="font-mono text-text-muted">{(primarySelected as TextEl).lineHeight || 1.3}</span>
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
                    <div className="flex justify-between text-[11px] text-text">
                      <span>Letter Spacing</span>
                      <span className="font-mono text-text-muted">{(primarySelected as TextEl).letterSpacing || 0}</span>
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
              )}
            </div>

            {/* TEXT EFFECTS (Canva-style: Hollow/Knockout, Shadow, Lift, Neon, Background Pill) */}
            <div className="relative" ref={effectsRef}>
              <Button
                variant={(primarySelected as TextEl).effect && (primarySelected as TextEl).effect !== "none" ? "default" : "outline"}
                size="sm"
                onClick={() => setIsEffectsOpen(!isEffectsOpen)}
                className="h-8 text-xs gap-1"
                title="Text Effects & Font Transparency Modes"
              >
                <SvgTextEffects size={14} />
                <span>Effects</span>
              </Button>

              {isEffectsOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-64 rounded-[10px] border border-border bg-surface p-3 shadow-card z-50 animate-in fade-in-50 zoom-in-95 space-y-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                    Typography Effects
                  </div>

                  {/* Effects Grid */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: "none", label: "None", desc: "Solid font" },
                      { id: "hollow", label: "Hollow", desc: "Transparent fill with outline" },
                      { id: "shadow", label: "Shadow", desc: "Soft drop shadow" },
                      { id: "lift", label: "Lift", desc: "Ambient blur" },
                      { id: "neon", label: "Neon", desc: "Glowing aura" },
                      { id: "background", label: "Pill Box", desc: "Translucent backdrop" },
                    ].map((eff) => (
                      <button
                        key={eff.id}
                        onClick={() => {
                          const isNowHollow = eff.id === "hollow";
                          const bgPillData =
                            eff.id === "background"
                              ? (primarySelected as TextEl).bgPill || {
                                  color: "#FFFFFF",
                                  opacity: 0.75,
                                  radius: 4,
                                }
                              : undefined;

                          updateElement(primarySelected.id, {
                            effect: eff.id as any,
                            isHollow: isNowHollow,
                            bgPill: bgPillData,
                          });
                        }}
                        className={`flex flex-col items-center justify-center p-2 rounded border text-center transition-all ${
                          (primarySelected as TextEl).effect === eff.id ||
                          (eff.id === "none" && !(primarySelected as TextEl).effect)
                            ? "border-accent bg-accent-soft font-semibold text-text"
                            : "border-border hover:bg-accent-soft/30 text-text-muted"
                        }`}
                      >
                        <span className="text-[11px]">{eff.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Sub-controls for Background Pill */}
                  {(primarySelected as TextEl).effect === "background" && (
                    <div className="pt-2 border-t border-border space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-text">
                        <span>Pill Backdrop Opacity</span>
                        <span className="font-mono text-text-muted">
                          {Math.round(((primarySelected as TextEl).bgPill?.opacity ?? 0.75) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={Math.round(((primarySelected as TextEl).bgPill?.opacity ?? 0.75) * 100)}
                        onChange={(e) => {
                          const op = Number(e.target.value) / 100;
                          const currentPill = (primarySelected as TextEl).bgPill || { color: "#FFFFFF", radius: 4 };
                          updateElement(primarySelected.id, {
                            bgPill: { ...currentPill, opacity: op },
                          });
                        }}
                        className="w-full accent-accent cursor-pointer"
                      />
                    </div>
                  )}

                  {/* Sub-controls for Hollow */}
                  {(primarySelected as TextEl).effect === "hollow" && (
                    <div className="text-[10px] text-text-muted bg-accent-soft/40 p-2 rounded">
                      Interior of letters is 100% transparent/clear. Adjust text color to change outline stroke.
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* IMAGE CONTROLS */}
        {primarySelected.type === "image" && (
          <div className="flex items-center gap-1.5">
            <Button
              variant={(primarySelected as ImageEl).frame === "none" || !(primarySelected as ImageEl).frame ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => updateElement(primarySelected.id, { frame: "none" })}
            >
              Standard
            </Button>
            <Button
              variant={(primarySelected as ImageEl).frame === "polaroid" ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => updateElement(primarySelected.id, { frame: "polaroid" })}
            >
              Polaroid
            </Button>
          </div>
        )}

        {/* SHAPE CONTROLS */}
        {primarySelected.type === "shape" && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-text-muted">Fill:</span>
              <div className="w-28">
                <ColorPicker
                  color={(primarySelected as ShapeEl).fill || "#F0EEE9"}
                  onChange={(hex) => updateElement(primarySelected.id, { fill: hex })}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-text-muted">Border:</span>
              <div className="w-28">
                <ColorPicker
                  color={(primarySelected as ShapeEl).stroke || "#1A1A1A"}
                  onChange={(hex) => updateElement(primarySelected.id, { stroke: hex })}
                />
              </div>
            </div>
          </>
        )}

        {/* ICON CONTROLS */}
        {primarySelected.type === "icon" && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-text-muted">Icon Color:</span>
            <div className="w-32">
              <ColorPicker
                color={(primarySelected as IconEl).color || "#1A1A1A"}
                onChange={(hex) => updateElement(primarySelected.id, { color: hex })}
              />
            </div>
          </div>
        )}

        {/* FLIP CONTROLS (Images, Shapes, Text) */}
        <div className="flex items-center border border-border rounded-[6px] h-8 bg-surface">
          <button
            onClick={flipHorizontalSelected}
            className="px-2 h-full hover:bg-accent-soft text-text-muted hover:text-text rounded-l"
            title="Flip Horizontal (Mirror)"
          >
            <SvgFlipHorizontal size={14} />
          </button>
          <button
            onClick={flipVerticalSelected}
            className="px-2 h-full hover:bg-accent-soft text-text-muted hover:text-text border-l border-border rounded-r"
            title="Flip Vertical"
          >
            <SvgFlipVertical size={14} />
          </button>
        </div>

        <div className="h-4 w-px bg-border mx-1" />

        {/* BORDER POPOVER (For Text & Image) */}
        {(primarySelected.type === "text" || primarySelected.type === "image") && (
          <div className="relative" ref={borderRef}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBorderOpen(!isBorderOpen)}
              className="h-8 text-xs gap-1"
              title="Add or style border"
            >
              <SvgBorder size={14} />
              <span>Border</span>
            </Button>

            {isBorderOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-60 rounded-[10px] border border-border bg-surface p-3 shadow-card z-50 animate-in fade-in-50 zoom-in-95 space-y-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Border Settings
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-text">
                    <span>Border Width</span>
                    <span className="font-mono text-text-muted">
                      {(primarySelected as TextEl | ImageEl).border?.w || 0} mm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="6"
                    step="0.5"
                    value={(primarySelected as TextEl | ImageEl).border?.w || 0}
                    onChange={(e) => {
                      const w = Number(e.target.value);
                      const currentBorder = (primarySelected as TextEl | ImageEl).border;
                      updateElement(primarySelected.id, {
                        border: {
                          w,
                          color: currentBorder?.color || "#1A1A1A",
                          style: currentBorder?.style || "solid",
                        },
                      });
                    }}
                    className="w-full accent-accent cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-text">Border Color</span>
                  <ColorPicker
                    color={(primarySelected as TextEl | ImageEl).border?.color || "#1A1A1A"}
                    onChange={(hex) => {
                      const currentBorder = (primarySelected as TextEl | ImageEl).border;
                      updateElement(primarySelected.id, {
                        border: {
                          w: currentBorder?.w || 1,
                          color: hex,
                          style: currentBorder?.style || "solid",
                        },
                      });
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-text">Border Style</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const currentBorder = (primarySelected as TextEl | ImageEl).border;
                        updateElement(primarySelected.id, {
                          border: {
                            w: currentBorder?.w || 1,
                            color: currentBorder?.color || "#1A1A1A",
                            style: "solid",
                          },
                        });
                      }}
                      className={`flex-1 py-1 text-xs rounded border text-center ${
                        (primarySelected as TextEl | ImageEl).border?.style !== "dashed"
                          ? "border-accent bg-accent-soft font-semibold text-text"
                          : "border-border text-text-muted"
                      }`}
                    >
                      Solid
                    </button>
                    <button
                      onClick={() => {
                        const currentBorder = (primarySelected as TextEl | ImageEl).border;
                        updateElement(primarySelected.id, {
                          border: {
                            w: currentBorder?.w || 1,
                            color: currentBorder?.color || "#1A1A1A",
                            style: "dashed",
                          },
                        });
                      }}
                      className={`flex-1 py-1 text-xs rounded border text-center ${
                        (primarySelected as TextEl | ImageEl).border?.style === "dashed"
                          ? "border-accent bg-accent-soft font-semibold text-text"
                          : "border-border text-text-muted"
                      }`}
                    >
                      Dashed
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TRANSPARENCY / OPACITY SLIDER (Canva Checkerboard Icon: 0% to 100%) */}
        <div className="relative" ref={opacityRef}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpacityOpen(!isOpacityOpen)}
            className="h-8 text-xs gap-1.5"
            title="Adjust transparency (0 to 100%)"
          >
            <SvgTransparency size={14} className="text-text" />
            <span className="font-mono">{currentOpacityPercent}%</span>
          </Button>

          {isOpacityOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-52 rounded-[10px] border border-border bg-surface p-3 shadow-card z-50 animate-in fade-in-50 zoom-in-95 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-medium text-text">
                <span>Transparency</span>
                <span className="font-mono font-semibold">{currentOpacityPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={currentOpacityPercent}
                onChange={(e) => handleOpacityChange(Number(e.target.value))}
                className="w-full accent-accent cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-text-muted font-mono">
                <span>0% (Clear)</span>
                <span>100% (Solid)</span>
              </div>
            </div>
          )}
        </div>

        {/* COPY STYLE (Paint Roller Tool) */}
        <Button
          variant={copiedStyle ? "secondary" : "outline"}
          size="sm"
          onClick={() => {
            copyStyle();
            showToast("success", "Style copied! Click any other element to paint it.");
          }}
          className={`h-8 text-xs gap-1 ${copiedStyle ? "border-accent text-accent" : ""}`}
          title="Copy Style (Paint Roller) - Copy formatting to paint on another element"
        >
          <SvgPaintRoller size={14} />
        </Button>
      </div>

      {/* Right: Arrange, Lock, Duplicate, Delete */}
      <div className="flex items-center gap-1 shrink-0 ml-4">
        {/* Layer Stacking */}
        <div className="flex items-center border border-border rounded-[6px] h-8 bg-bg">
          <button
            onClick={bringForward}
            className="px-2 h-full hover:bg-accent-soft text-text-muted hover:text-text"
            title="Bring Forward"
          >
            <SvgLayerUp size={14} />
          </button>
          <button
            onClick={sendBackward}
            className="px-2 h-full hover:bg-accent-soft text-text-muted hover:text-text border-l border-border"
            title="Send Backward"
          >
            <SvgLayerDown size={14} />
          </button>
        </div>

        {/* Duplicate */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-text-muted hover:text-text"
          onClick={duplicateSelected}
          title="Duplicate (Ctrl+D)"
        >
          <SvgDuplicate size={14} />
        </Button>

        {/* Lock / Unlock */}
        <Button
          variant={isLocked ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={toggleLockSelected}
          title={isLocked ? "Unlock Element" : "Lock Element"}
        >
          {isLocked ? <SvgLock size={14} className="text-danger" /> : <SvgUnlock size={14} className="text-text-muted" />}
        </Button>

        {/* Delete */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-text-muted hover:text-danger"
          onClick={deleteSelected}
          title="Delete (Delete / Backspace)"
        >
          <SvgTrash size={14} />
        </Button>
      </div>
    </div>
  );
}
