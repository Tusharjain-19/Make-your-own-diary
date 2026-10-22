"use client";

import * as React from "react";
import { Download, Trash2, Check, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HandwritingFontMetadata } from "@/lib/handwriting/types";

interface FontPreviewProps {
  font: HandwritingFontMetadata;
  onApplyFont: (fontName: string) => void;
  onDeleteFont: (fontName: string) => void;
}

export function FontPreview({ font, onApplyFont, onDeleteFont }: FontPreviewProps) {
  const [sampleText, setSampleText] = React.useState(
    "Morning in the Pink City. The desert breeze carried cardamom and marigolds across Rajasthan. ₹50 memory book!"
  );
  const [fontSize, setFontSize] = React.useState(22);
  const [applied, setApplied] = React.useState(false);

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

  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface p-4 shadow-sm">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <PenTool className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-text">{font.name}</div>
            <div className="text-[10px] text-text-muted">
              {font.glyphCount} glyphs · Compiled & loaded
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

      {/* Live Sample Canvas / Preview Box */}
      <div>
        <div className="flex items-center justify-between mb-1.5 text-[11px] text-text-muted">
          <span>Live Typography Preview</span>
          <span>{fontSize}px</span>
        </div>
        <textarea
          value={sampleText}
          onChange={(e) => setSampleText(e.target.value)}
          rows={3}
          style={{ fontFamily: `"${font.name}", cursive, sans-serif`, fontSize: `${fontSize}px` }}
          className="w-full rounded-lg border border-border bg-[#faf8f5] p-3 text-text focus:border-accent focus:outline-none resize-none leading-relaxed transition-all shadow-inner"
        />
      </div>

      {/* Font Size Slider */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-text-muted w-10">Size:</span>
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
        <Button
          onClick={handleApply}
          size="sm"
          className="w-full text-xs font-medium"
        >
          {applied ? (
            <>
              <Check className="mr-1.5 h-3.5 w-3.5" /> Applied!
            </>
          ) : (
            <>
              <PenTool className="mr-1.5 h-3.5 w-3.5" /> Apply to Text
            </>
          )}
        </Button>

        {font.dataUrl && (
          <Button
            variant="outline"
            onClick={handleDownloadOtf}
            size="sm"
            className="w-full text-xs"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export OTF
          </Button>
        )}
      </div>
    </div>
  );
}
