"use client";

import * as React from "react";
import { ProcessedGlyph } from "@/lib/handwriting/types";
import { Edit3, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GlyphReviewProps {
  glyphs: ProcessedGlyph[];
  onUpdateGlyph: (index: number, updated: ProcessedGlyph) => void;
  onGenerateFont: () => void;
  fontName: string;
  setFontName: (name: string) => void;
  isBuildingFont?: boolean;
}

export function GlyphReview({
  glyphs,
  onUpdateGlyph,
  onGenerateFont,
  fontName,
  setFontName,
  isBuildingFont = false,
}: GlyphReviewProps) {
  const [editingGlyphIndex, setEditingGlyphIndex] = React.useState<number | null>(null);
  const [filterMode, setFilterMode] = React.useState<"all" | "warning" | "empty">("all");

  const goodCount = glyphs.filter((g) => g.status === "good").length;
  const warningCount = glyphs.filter((g) => g.status === "warning").length;
  const emptyCount = glyphs.filter((g) => g.status === "empty").length;

  const filteredGlyphs = glyphs.filter((g) => {
    if (filterMode === "warning") return g.status === "warning";
    if (filterMode === "empty") return g.status === "empty";
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Stats & Filters */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <div className="text-xs font-semibold text-text">Glyph Review ({glyphs.length})</div>
          <div className="text-[11px] text-text-muted">
            {goodCount} clean · {warningCount} needs check · {emptyCount} empty
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px]">
          <button
            onClick={() => setFilterMode("all")}
            className={`px-2 py-0.5 rounded transition-colors ${
              filterMode === "all" ? "bg-accent-soft text-accent font-medium" : "text-text-muted hover:text-text"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterMode("warning")}
            className={`px-2 py-0.5 rounded transition-colors ${
              filterMode === "warning" ? "bg-amber-100 text-amber-800 font-medium" : "text-text-muted hover:text-text"
            }`}
          >
            Review ({warningCount})
          </button>
          <button
            onClick={() => setFilterMode("empty")}
            className={`px-2 py-0.5 rounded transition-colors ${
              filterMode === "empty" ? "bg-rose-100 text-rose-800 font-medium" : "text-text-muted hover:text-text"
            }`}
          >
            Empty ({emptyCount})
          </button>
        </div>
      </div>

      {/* Font Name Field */}
      <div>
        <label className="text-[11px] font-medium text-text-muted block mb-1">
          Font Family Name
        </label>
        <input
          type="text"
          value={fontName}
          onChange={(e) => setFontName(e.target.value)}
          placeholder="e.g. My Royal Script"
          className="w-full rounded border border-border bg-surface px-2.5 py-1.5 text-xs text-text focus:border-accent focus:outline-none"
        />
      </div>

      {/* Glyph Grid */}
      <div className="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-1">
        {filteredGlyphs.map((glyph) => {
          const originalIndex = glyphs.findIndex((g) => g.char === glyph.char);
          return (
            <div
              key={glyph.char}
              onClick={() => setEditingGlyphIndex(originalIndex)}
              className={`group relative flex flex-col items-center justify-between rounded border p-1.5 cursor-pointer transition-all hover:border-accent hover:shadow-sm ${
                glyph.status === "good"
                  ? "border-border bg-surface"
                  : glyph.status === "warning"
                  ? "border-amber-300 bg-amber-50/50"
                  : "border-rose-200 bg-rose-50/30"
              }`}
            >
              {/* Character Header & Status Badge */}
              <div className="flex w-full items-center justify-between text-[10px]">
                <span className="font-mono font-bold text-text">{glyph.char}</span>
                {glyph.status === "good" ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                ) : glyph.status === "warning" ? (
                  <AlertCircle className="h-3 w-3 text-amber-600" />
                ) : (
                  <XCircle className="h-3 w-3 text-rose-400" />
                )}
              </div>

              {/* Glyph Image Preview */}
              <div className="h-10 w-full flex items-center justify-center my-1 overflow-hidden">
                {glyph.status === "empty" ? (
                  <span className="text-[9px] text-text-muted italic">Click to draw</span>
                ) : (
                  <img
                    src={glyph.dataUrl}
                    alt={glyph.char}
                    className="max-h-full max-w-full object-contain filter contrast-125"
                  />
                )}
              </div>

              {/* Quality Score / Hover Edit */}
              <div className="flex w-full items-center justify-between text-[9px] text-text-muted">
                <span>{glyph.qualityScore > 0 ? `${glyph.qualityScore}%` : "—"}</span>
                <span className="opacity-0 group-hover:opacity-100 text-accent flex items-center gap-0.5">
                  <Edit3 className="h-2.5 w-2.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Build Font Action */}
      <Button
        onClick={onGenerateFont}
        disabled={isBuildingFont || glyphs.filter((g) => g.status !== "empty").length < 5}
        className="w-full text-xs font-medium"
      >
        {isBuildingFont ? "Compiling OpenType Font..." : `Compile Font (${glyphs.filter((g) => g.status !== "empty").length} Glyphs)`}
      </Button>

      {/* Draw Mode Modal */}
      {editingGlyphIndex !== null && (
        <DrawGlyphModal
          glyph={glyphs[editingGlyphIndex]}
          onSave={(updated) => {
            onUpdateGlyph(editingGlyphIndex, updated);
            setEditingGlyphIndex(null);
          }}
          onClose={() => setEditingGlyphIndex(null)}
        />
      )}
    </div>
  );
}

/**
 * Interactive HTML5 Canvas for drawing or redrawing an individual character
 */
function DrawGlyphModal({
  glyph,
  onSave,
  onClose,
}: {
  glyph: ProcessedGlyph;
  onSave: (glyph: ProcessedGlyph) => void;
  onClose: () => void;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const isDrawing = React.useRef(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset with guide lines
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Baseline guide
    const baselineY = canvas.height * 0.72;
    ctx.strokeStyle = "#dedbd2";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(10, baselineY);
    ctx.lineTo(canvas.width - 10, baselineY);
    ctx.stroke();
    ctx.setLineDash([]);

    // If existing image, draw lightly in background
    if (glyph.dataUrl && glyph.status !== "empty") {
      const img = new Image();
      img.onload = () => {
        ctx.globalAlpha = 0.25;
        ctx.drawImage(img, (canvas.width - img.width) / 2, (canvas.height - img.height) / 2);
        ctx.globalAlpha = 1.0;
      };
      img.src = glyph.dataUrl;
    }
  }, [glyph]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    isDrawing.current = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw baseline guide
    const baselineY = canvas.height * 0.72;
    ctx.strokeStyle = "#dedbd2";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(10, baselineY);
    ctx.lineTo(canvas.width - 10, baselineY);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const handleSaveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    onSave({
      ...glyph,
      dataUrl,
      qualityScore: 95,
      status: "good",
      isManualDrawing: true,
      width: canvas.width,
      height: canvas.height,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div>
            <h4 className="font-serif text-base font-semibold text-text">
              Draw Character: <span className="font-mono text-accent">"{glyph.char}"</span>
            </h4>
            <p className="text-[11px] text-text-muted">
              Use mouse, pen, or touch to redraw. Keep letter on the dashed line.
            </p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text text-sm">
            ✕
          </button>
        </div>

        <div className="flex justify-center bg-[#fafafa] rounded-lg border border-border p-2">
          <canvas
            ref={canvasRef}
            width={220}
            height={220}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="cursor-crosshair rounded bg-white touch-none shadow-sm"
          />
        </div>

        <div className="flex items-center justify-between gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={handleClear} className="text-xs">
            Clear
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveDrawing} className="text-xs">
              Save Glyph
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
