"use client";

import * as React from "react";
import { ProcessedGlyph, GlyphCategory } from "@/lib/handwriting/types";
import {
  isCapitalLetter,
  isSmallLetter,
  isAscender,
  isDescender,
  isSmallXHeight,
  getPairedChar,
} from "@/lib/handwriting/grid";
import { synthesizeMissingCases } from "@/lib/handwriting/font-builder";
import {
  Edit3,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Sparkles,
  Columns,
  Grid,
  Info,
} from "lucide-react";
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
  const [filterMode, setFilterMode] = React.useState<
    "all" | "capitals" | "small" | "numbers" | "symbols" | "warning" | "empty"
  >("all");
  const [viewMode, setViewMode] = React.useState<"grid" | "pairs">("grid");
  const [synthesisMessage, setSynthesisMessage] = React.useState<string | null>(null);

  // Stats Breakdown for Capital vs Small Letters
  const capitalGlyphs = glyphs.filter((g) => isCapitalLetter(g.char));
  const smallGlyphs = glyphs.filter((g) => isSmallLetter(g.char));
  const numberGlyphs = glyphs.filter((g) => g.char >= "0" && g.char <= "9");
  const symbolGlyphs = glyphs.filter(
    (g) => !isCapitalLetter(g.char) && !isSmallLetter(g.char) && !(g.char >= "0" && g.char <= "9")
  );

  const filledCapitals = capitalGlyphs.filter((g) => g.status !== "empty").length;
  const filledSmall = smallGlyphs.filter((g) => g.status !== "empty").length;

  const goodCount = glyphs.filter((g) => g.status === "good").length;
  const warningCount = glyphs.filter((g) => g.status === "warning").length;
  const emptyCount = glyphs.filter((g) => g.status === "empty").length;

  const canSynthesizeSmall = filledCapitals > 0 && filledSmall < filledCapitals;
  const canSynthesizeCapitals = filledSmall > 0 && filledCapitals < filledSmall;

  // Auto-fill / synthesize missing counterpart letters
  const handleAutoSynthesize = () => {
    const { completeGlyphs, synthesizedCount } = synthesizeMissingCases(glyphs);
    for (let i = 0; i < completeGlyphs.length; i++) {
      if (completeGlyphs[i] !== glyphs[i]) {
        onUpdateGlyph(i, completeGlyphs[i]);
      }
    }
    setSynthesisMessage(`✨ Successfully synthesized ${synthesizedCount} matching letter variants!`);
    setTimeout(() => setSynthesisMessage(null), 4000);
  };

  const filteredGlyphs = glyphs.filter((g) => {
    if (filterMode === "capitals") return isCapitalLetter(g.char);
    if (filterMode === "small") return isSmallLetter(g.char);
    if (filterMode === "numbers") return g.char >= "0" && g.char <= "9";
    if (filterMode === "symbols")
      return !isCapitalLetter(g.char) && !isSmallLetter(g.char) && !(g.char >= "0" && g.char <= "9");
    if (filterMode === "warning") return g.status === "warning";
    if (filterMode === "empty") return g.status === "empty";
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Stats & Mode Toggle */}
      <div className="flex flex-col gap-2 border-b border-border pb-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-text">Review & Refine Letters</div>
            <div className="text-[11px] text-text-muted mt-0.5">
              <span className="font-medium text-accent">{filledCapitals}/26 Capitals (A–Z)</span> ·{" "}
              <span className="font-medium text-emerald-700">{filledSmall}/26 Small (a–z)</span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[#f4f4f2] p-0.5 rounded-lg border border-border">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === "grid" ? "bg-white text-text shadow-2xs font-medium" : "text-text-muted hover:text-text"
              }`}
              title="Grid View"
            >
              <Grid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode("pairs")}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-colors ${
                viewMode === "pairs" ? "bg-white text-text shadow-2xs font-semibold" : "text-text-muted hover:text-text"
              }`}
              title="Alphabet Pair View (Aa, Bb, Cc...)"
            >
              <Columns className="h-3 w-3" />
              <span>Aa Pairs</span>
            </button>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1 text-[11px] overflow-x-auto py-0.5 scrollbar-thin">
          <button
            onClick={() => setFilterMode("all")}
            className={`px-2 py-0.5 rounded-full transition-colors whitespace-nowrap ${
              filterMode === "all" ? "bg-text text-white font-medium" : "text-text-muted hover:text-text bg-[#f4f4f2]"
            }`}
          >
            All ({glyphs.length})
          </button>
          <button
            onClick={() => setFilterMode("capitals")}
            className={`px-2 py-0.5 rounded-full transition-colors whitespace-nowrap ${
              filterMode === "capitals"
                ? "bg-accent text-white font-medium shadow-xs"
                : "text-text-muted hover:text-text bg-[#f4f4f2]"
            }`}
          >
            Capitals A–Z ({filledCapitals}/26)
          </button>
          <button
            onClick={() => setFilterMode("small")}
            className={`px-2 py-0.5 rounded-full transition-colors whitespace-nowrap ${
              filterMode === "small"
                ? "bg-emerald-700 text-white font-medium shadow-xs"
                : "text-text-muted hover:text-text bg-[#f4f4f2]"
            }`}
          >
            Small Letters a–z ({filledSmall}/26)
          </button>
          <button
            onClick={() => setFilterMode("numbers")}
            className={`px-2 py-0.5 rounded-full transition-colors whitespace-nowrap ${
              filterMode === "numbers" ? "bg-text text-white font-medium" : "text-text-muted hover:text-text bg-[#f4f4f2]"
            }`}
          >
            0–9
          </button>
          <button
            onClick={() => setFilterMode("symbols")}
            className={`px-2 py-0.5 rounded-full transition-colors whitespace-nowrap ${
              filterMode === "symbols" ? "bg-text text-white font-medium" : "text-text-muted hover:text-text bg-[#f4f4f2]"
            }`}
          >
            Punctuation
          </button>
          <button
            onClick={() => setFilterMode("empty")}
            className={`px-2 py-0.5 rounded-full transition-colors whitespace-nowrap ${
              filterMode === "empty"
                ? "bg-rose-100 text-rose-800 font-medium"
                : "text-text-muted hover:text-text bg-[#f4f4f2]"
            }`}
          >
            Empty ({emptyCount})
          </button>
        </div>
      </div>

      {/* Intelligent Dual-Case Synthesis Banner */}
      {(canSynthesizeSmall || canSynthesizeCapitals) && (
        <div className="rounded-lg border border-accent/30 bg-accent-soft/20 p-2.5 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-text">
            <Sparkles className="h-3.5 w-3.5 text-accent shrink-0" />
            <span>
              {canSynthesizeSmall
                ? `You have ${filledCapitals} capitals! Auto-generate missing small letters?`
                : `You have ${filledSmall} small letters! Auto-generate missing capitals?`}
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAutoSynthesize}
            className="h-7 text-[10px] shrink-0 font-medium bg-white hover:bg-accent-soft"
          >
            Auto-Fill
          </Button>
        </div>
      )}

      {synthesisMessage && (
        <div className="rounded-md bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-[11px] text-emerald-800 font-medium">
          {synthesisMessage}
        </div>
      )}

      {/* Font Family Name Field */}
      <div>
        <label className="text-[11px] font-medium text-text-muted block mb-1">
          Handwriting Font Name
        </label>
        <input
          type="text"
          value={fontName}
          onChange={(e) => setFontName(e.target.value)}
          placeholder="e.g. My Royal Script"
          className="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-text focus:border-accent focus:outline-none"
        />
      </div>

      {/* ================= ALPHABET PAIR VIEW (Aa, Bb, Cc...) ================= */}
      {viewMode === "pairs" && (
        <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
          {Array.from({ length: 26 }, (_, i) => {
            const capChar = String.fromCharCode(65 + i);
            const smallChar = String.fromCharCode(97 + i);

            const capIndex = glyphs.findIndex((g) => g.char === capChar);
            const smallIndex = glyphs.findIndex((g) => g.char === smallChar);

            const capGlyph = glyphs[capIndex];
            const smallGlyph = glyphs[smallIndex];

            return (
              <div
                key={capChar}
                className="flex items-center justify-between rounded-lg border border-border bg-surface p-2 hover:border-accent transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-7 w-7 rounded bg-[#f4f4f2] font-mono text-xs font-bold text-text">
                    {capChar}{smallChar}
                  </div>

                  {/* Capital Cell */}
                  <div
                    onClick={() => capIndex >= 0 && setEditingGlyphIndex(capIndex)}
                    className="flex items-center gap-1.5 cursor-pointer p-1 rounded hover:bg-accent-soft/30 transition-colors"
                    title={`Click to edit Capital ${capChar}`}
                  >
                    <span className="font-mono text-[11px] font-bold text-accent">Cap {capChar}:</span>
                    <div className="h-8 w-8 flex items-center justify-center border border-border rounded bg-white overflow-hidden">
                      {capGlyph && capGlyph.status !== "empty" ? (
                        <img
                          src={capGlyph.dataUrl}
                          alt={capChar}
                          className="max-h-full max-w-full object-contain filter contrast-125"
                        />
                      ) : (
                        <span className="text-[9px] text-text-muted italic">draw</span>
                      )}
                    </div>
                  </div>

                  {/* Small Letter Cell */}
                  <div
                    onClick={() => smallIndex >= 0 && setEditingGlyphIndex(smallIndex)}
                    className="flex items-center gap-1.5 cursor-pointer p-1 rounded hover:bg-emerald-50 transition-colors"
                    title={`Click to edit Small ${smallChar}`}
                  >
                    <span className="font-mono text-[11px] font-bold text-emerald-700">Small {smallChar}:</span>
                    <div className="h-8 w-8 flex items-center justify-center border border-border rounded bg-white overflow-hidden">
                      {smallGlyph && smallGlyph.status !== "empty" ? (
                        <img
                          src={smallGlyph.dataUrl}
                          alt={smallChar}
                          className="max-h-full max-w-full object-contain filter contrast-125"
                        />
                      ) : (
                        <span className="text-[9px] text-text-muted italic">draw</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-1 text-[10px]">
                  {capGlyph?.status === "good" && smallGlyph?.status === "good" ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle2 className="h-3 w-3" /> Pair Complete
                    </span>
                  ) : (
                    <span className="text-text-muted text-[10px]">
                      {capGlyph?.status !== "empty" && smallGlyph?.status === "empty"
                        ? "Missing small letter"
                        : smallGlyph?.status !== "empty" && capGlyph?.status === "empty"
                        ? "Missing capital"
                        : "Needs drawing"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= STANDARD GRID VIEW ================= */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-5 gap-2 max-h-[320px] overflow-y-auto pr-1">
          {filteredGlyphs.map((glyph) => {
            const originalIndex = glyphs.findIndex((g) => g.char === glyph.char);
            const isCap = isCapitalLetter(glyph.char);
            const isSmall = isSmallLetter(glyph.char);

            return (
              <div
                key={glyph.char}
                onClick={() => setEditingGlyphIndex(originalIndex)}
                className={`group relative flex flex-col items-center justify-between rounded-lg border p-1.5 cursor-pointer transition-all hover:border-accent hover:shadow-xs ${
                  glyph.status === "good"
                    ? "border-border bg-surface"
                    : glyph.status === "warning"
                    ? "border-amber-300 bg-amber-50/40"
                    : "border-rose-200 bg-rose-50/30"
                }`}
              >
                {/* Character Header & Status Badge */}
                <div className="flex w-full items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1">
                    <span
                      className={`font-mono font-bold ${
                        isCap ? "text-accent" : isSmall ? "text-emerald-700" : "text-text"
                      }`}
                    >
                      {glyph.char}
                    </span>
                    <span className="text-[8px] text-text-muted">
                      {isCap ? "Cap" : isSmall ? "Small" : ""}
                    </span>
                  </div>

                  {glyph.isSynthesized ? (
                    <span title="Auto-synthesized pair" className="text-[9px] text-accent font-mono font-bold">
                      ✨
                    </span>
                  ) : glyph.status === "good" ? (
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
      )}

      {/* Build Font Action */}
      <Button
        onClick={onGenerateFont}
        disabled={isBuildingFont || glyphs.filter((g) => g.status !== "empty").length < 3}
        className="w-full text-xs font-semibold py-2"
      >
        {isBuildingFont ? (
          "Compiling Dual-Case OpenType Font..."
        ) : (
          `Compile Font · ${filledCapitals} Capitals & ${filledSmall} Small Letters`
        )}
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
 * Interactive HTML5 Canvas for drawing both Capital and Small letters
 * with case-specific typographic guides (Cap-Height, X-Height, Baseline, Descender)
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

  const isCap = isCapitalLetter(glyph.char);
  const isSmall = isSmallLetter(glyph.char);
  const isAsc = isAscender(glyph.char);
  const isDesc = isDescender(glyph.char);
  const paired = getPairedChar(glyph.char);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset with guide lines
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;

    // 1. Cap-Height / Ascender Line (Top: 24% from top)
    const capHeightY = h * 0.24;
    ctx.strokeStyle = isCap || isAsc ? "#cfc7b8" : "#ebe8e1";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(10, capHeightY);
    ctx.lineTo(w - 10, capHeightY);
    ctx.stroke();

    // 2. X-Height Line (48% from top, for small letters like a, c, e, m)
    const xHeightY = h * 0.48;
    ctx.strokeStyle = isSmall ? "#3b82f6" : "#ebe8e1";
    ctx.lineWidth = isSmall ? 1 : 0.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(10, xHeightY);
    ctx.lineTo(w - 10, xHeightY);
    ctx.stroke();

    // 3. Baseline (Solid dark line at 72% from top)
    const baselineY = h * 0.72;
    ctx.strokeStyle = "#1a1c1b";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(10, baselineY);
    ctx.lineTo(w - 10, baselineY);
    ctx.stroke();

    // 4. Descender Guide (88% from top, for g, j, p, q, y)
    const descenderY = h * 0.88;
    if (isDesc) {
      ctx.strokeStyle = "#e11d48";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(10, descenderY);
      ctx.lineTo(w - 10, descenderY);
      ctx.stroke();
    }

    // Guide Labels
    ctx.font = "9px sans-serif";
    ctx.fillStyle = "#9c9a94";
    ctx.fillText(isCap ? "Cap-Height" : isAsc ? "Ascender" : "", 12, capHeightY - 3);
    if (isSmall) {
      ctx.fillStyle = "#3b82f6";
      ctx.fillText("x-height", 12, xHeightY - 3);
    }
    ctx.fillStyle = "#1a1c1b";
    ctx.fillText("Baseline", 12, baselineY - 3);
    if (isDesc) {
      ctx.fillStyle = "#e11d48";
      ctx.fillText("Descender", 12, descenderY + 10);
    }

    // If existing image, draw lightly in background
    if (glyph.dataUrl && glyph.status !== "empty") {
      const img = new Image();
      img.onload = () => {
        ctx.globalAlpha = 0.22;
        ctx.drawImage(img, (w - img.width) / 2, (h - img.height) / 2);
        ctx.globalAlpha = 1.0;
      };
      img.src = glyph.dataUrl;
    }
  }, [glyph, isCap, isSmall, isAsc, isDesc]);

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
    ctx.lineWidth = isSmall ? 3.5 : 4;
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

    const w = canvas.width;
    const h = canvas.height;

    // Redraw guides
    const capHeightY = h * 0.24;
    ctx.strokeStyle = isCap || isAsc ? "#cfc7b8" : "#ebe8e1";
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(10, capHeightY);
    ctx.lineTo(w - 10, capHeightY);
    ctx.stroke();

    const xHeightY = h * 0.48;
    ctx.strokeStyle = isSmall ? "#3b82f6" : "#ebe8e1";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(10, xHeightY);
    ctx.lineTo(w - 10, xHeightY);
    ctx.stroke();

    const baselineY = h * 0.72;
    ctx.strokeStyle = "#1a1c1b";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(10, baselineY);
    ctx.lineTo(w - 10, baselineY);
    ctx.stroke();

    if (isDesc) {
      const descenderY = h * 0.88;
      ctx.strokeStyle = "#e11d48";
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(10, descenderY);
      ctx.lineTo(w - 10, descenderY);
      ctx.stroke();
    }
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
      isSynthesized: false,
      width: canvas.width,
      height: canvas.height,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-100">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-5 shadow-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-base font-semibold text-text">
                Draw Letter: <span className="font-mono text-accent">"{glyph.char}"</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  isCap
                    ? "bg-accent/15 text-accent"
                    : isSmall
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-[#f4f4f2] text-text"
                }`}
              >
                {isCap ? "CAPITAL LETTER" : isSmall ? "SMALL LETTER" : "SYMBOL"}
              </span>
            </div>

            <p className="text-[11px] text-text-muted mt-1">
              {isCap && "Write between the top Cap-Height and the solid Baseline."}
              {isSmall && isAsc && "Ascender letter: loop extends to top line; body stays in x-height."}
              {isSmall && isDesc && "Descender letter: tail drops below solid baseline to red line."}
              {isSmall && !isAsc && !isDesc && "Standard small letter: keep inside the dashed blue x-height line."}
            </p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text text-sm p-1">
            ✕
          </button>
        </div>

        {/* Paired Companion Hint */}
        {paired && (
          <div className="flex items-center justify-between bg-[#f4f4f2] px-2.5 py-1.5 rounded text-[11px] text-text-muted">
            <span>Paired Case Companion:</span>
            <span className="font-mono font-bold text-text">
              {isCap ? `Small "${paired}"` : `Capital "${paired}"`}
            </span>
          </div>
        )}

        {/* Drawing Canvas */}
        <div className="flex justify-center bg-[#fafafa] rounded-lg border border-border p-2">
          <canvas
            ref={canvasRef}
            width={240}
            height={240}
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
            <Button size="sm" onClick={handleSaveDrawing} className="text-xs font-semibold">
              Save Character
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
