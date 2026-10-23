"use client";

import * as React from "react";
import { Download, Trash2, Check, PenTool, Type, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HandwritingFontMetadata } from "@/lib/handwriting/types";

interface FontPreviewProps {
  font: HandwritingFontMetadata;
  onApplyFont: (fontName: string) => void;
  onDeleteFont: (fontName: string) => void;
}

const SAMPLE_PRESETS = [
  {
    id: "mixed",
    label: "Aa Mixed",
    text: "The quick brown fox jumps over the lazy dog. A royal journey across Rajasthan!",
  },
  {
    id: "caps",
    label: "AA Capitals",
    text: "ROYAL ARCHIVES & PALACE MEMORIES OF RAJASTHAN",
  },
  {
    id: "small",
    label: "aa Small",
    text: "morning chai in clay cups, marigolds & quiet courtyards",
  },
  {
    id: "numbers",
    label: "123 & ₹",
    text: "₹1,450 — Plate 04 / 2026 (Oct 24) [Vol. 1] & Keepsake",
  },
];

export function FontPreview({ font, onApplyFont, onDeleteFont }: FontPreviewProps) {
  const [sampleText, setSampleText] = React.useState(SAMPLE_PRESETS[0].text);
  const [fontSize, setFontSize] = React.useState(22);
  const [applied, setApplied] = React.useState(false);
  const [activePreset, setActivePreset] = React.useState("mixed");

  const handleApply = () => {
    onApplyFont(font.name);
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  const handleDownloadOtf = () => {
    if (!font.dataUrl) return;
    const a = document.createElement("a");
    a.href = font.dataUrl;
    a.download = `${font.name.replace(/\s+/g, "_")}.otf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCaseTransform = (mode: "upper" | "lower" | "title") => {
    if (mode === "upper") setSampleText(sampleText.toUpperCase());
    else if (mode === "lower") setSampleText(sampleText.toLowerCase());
    else {
      setSampleText(
        sampleText.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
      );
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface p-4 shadow-xs">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <PenTool className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-text">{font.name}</div>
            <div className="text-[10px] text-text-muted">
              {font.glyphCount} glyphs · Dual-Case Enabled (A–Z & a–z)
            </div>
          </div>
        </div>

        <button
          onClick={() => onDeleteFont(font.name)}
          className="text-text-muted hover:text-rose-600 transition-colors p-1"
          title="Delete font"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Case Presets Selector */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-text-muted">
          <span>Test Capital & Small Letters</span>
          <div className="flex items-center gap-1 font-mono text-[10px]">
            <button
              onClick={() => handleCaseTransform("upper")}
              className="px-1.5 py-0.5 rounded hover:bg-[#f4f4f2] text-text-muted hover:text-text transition-colors"
              title="Transform to ALL CAPS"
            >
              UPPER
            </button>
            <span className="text-border">|</span>
            <button
              onClick={() => handleCaseTransform("lower")}
              className="px-1.5 py-0.5 rounded hover:bg-[#f4f4f2] text-text-muted hover:text-text transition-colors"
              title="Transform to all lowercase"
            >
              lower
            </button>
            <span className="text-border">|</span>
            <button
              onClick={() => handleCaseTransform("title")}
              className="px-1.5 py-0.5 rounded hover:bg-[#f4f4f2] text-text-muted hover:text-text transition-colors"
              title="Transform to Title Case"
            >
              Title
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1">
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setActivePreset(preset.id);
                setSampleText(preset.text);
              }}
              className={`py-1 px-1.5 rounded text-[10px] font-medium transition-all text-center ${
                activePreset === preset.id
                  ? "bg-text text-white shadow-xs"
                  : "bg-[#f4f4f2] text-text-muted hover:text-text hover:bg-[#eeeeec]"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Sample Canvas / Preview Box */}
      <div>
        <div className="flex items-center justify-between mb-1.5 text-[11px] text-text-muted">
          <span>Live Typography Canvas</span>
          <span className="font-mono">{fontSize}px</span>
        </div>
        <textarea
          value={sampleText}
          onChange={(e) => setSampleText(e.target.value)}
          rows={3}
          style={{ fontFamily: `"${font.name}", cursive, sans-serif`, fontSize: `${fontSize}px` }}
          className="w-full rounded-lg border border-border bg-[#faf8f5] p-3 text-text focus:border-accent focus:outline-none resize-none leading-relaxed transition-all shadow-inner"
        />
      </div>

      {/* Dual-Case Alphabet Ribbon */}
      <div className="rounded-lg border border-border bg-[#faf8f5] p-2 space-y-1 text-center">
        <div className="text-[10px] font-mono text-text-muted text-left flex items-center justify-between">
          <span>Dual-Case Inspection</span>
          <span className="text-emerald-700 font-semibold">A–Z & a–z</span>
        </div>
        <div
          className="text-xs text-text tracking-wider overflow-x-auto whitespace-nowrap py-0.5 scrollbar-thin"
          style={{ fontFamily: `"${font.name}", cursive, sans-serif` }}
        >
          A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
        </div>
        <div
          className="text-xs text-text tracking-wider overflow-x-auto whitespace-nowrap py-0.5 scrollbar-thin text-emerald-900"
          style={{ fontFamily: `"${font.name}", cursive, sans-serif` }}
        >
          a b c d e f g h i j k l m n o p q r s t u v w x y z
        </div>
      </div>

      {/* Font Size Slider */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-text-muted w-10 font-mono">Size:</span>
        <input
          type="range"
          min={14}
          max={42}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full accent-accent h-1 bg-border rounded cursor-pointer"
        />
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <Button onClick={handleApply} size="sm" className="w-full text-xs font-semibold">
          {applied ? (
            <>
              <Check className="mr-1.5 h-3.5 w-3.5" /> Applied to Canvas!
            </>
          ) : (
            <>
              <PenTool className="mr-1.5 h-3.5 w-3.5" /> Apply to Text
            </>
          )}
        </Button>

        {font.dataUrl && (
          <Button variant="outline" onClick={handleDownloadOtf} size="sm" className="w-full text-xs">
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export .OTF
          </Button>
        )}
      </div>
    </div>
  );
}
