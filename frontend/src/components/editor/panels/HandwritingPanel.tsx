"use client";

import * as React from "react";
import Link from "next/link";
import { Download, PenTool, Upload, Sparkles, RefreshCw, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/editor/store";
import { TextEl } from "@/lib/editor/types";
import { useAuth } from "@/lib/auth/auth-context";
import { processHandwritingSheet, generateDemoHandwritingSheet } from "@/lib/handwriting/pipeline";
import { buildOpenTypeFont, getLocalFontsRegistry, deleteFontFromRegistry } from "@/lib/handwriting/font-builder";
import { ProcessedGlyph, HandwritingFontMetadata } from "@/lib/handwriting/types";
import { GlyphReview } from "./GlyphReview";
import { FontPreview } from "./FontPreview";

export function HandwritingPanel() {
  const { user } = useAuth();
  const { book, activePageIndex, selectedIds, updateElement, saveToStorage } = useEditorStore();

  const [step, setStep] = React.useState<"overview" | "upload" | "review" | "preview">("overview");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isBuildingFont, setIsBuildingFont] = React.useState(false);
  const [processedGlyphs, setProcessedGlyphs] = React.useState<ProcessedGlyph[]>([]);
  const [fontName, setFontName] = React.useState(
    user?.name ? `${user.name.split(" ")[0]}'s Script` : "Personal Script"
  );
  const [savedFonts, setSavedFonts] = React.useState<HandwritingFontMetadata[]>([]);
  const [activeFont, setActiveFont] = React.useState<HandwritingFontMetadata | null>(null);
  const [uploadPreviewUrl, setUploadPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const list = getLocalFontsRegistry();
    setSavedFonts(list);
    if (list.length > 0 && !activeFont) {
      setActiveFont(list[0]);
    }
  }, [activeFont]);

  // Handle uploading real sheet photo or scan
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setUploadPreviewUrl(URL.createObjectURL(file));
      const glyphs = await processHandwritingSheet(file);
      setProcessedGlyphs(glyphs);
      setStep("review");
    } catch (err) {
      console.error("Error processing handwriting sheet:", err);
      alert("Failed to process sheet. Please ensure the 4 corner markers are clearly visible.");
    } finally {
      setIsProcessing(false);
    }
  };

  // One-click demo test sheet
  const handleTrySampleSheet = async () => {
    try {
      setIsProcessing(true);
      const sampleBlob = await generateDemoHandwritingSheet();
      setUploadPreviewUrl(URL.createObjectURL(sampleBlob));
      const glyphs = await processHandwritingSheet(sampleBlob);
      setProcessedGlyphs(glyphs);
      setStep("review");
    } catch (err) {
      console.error("Error generating sample sheet:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Compile font from review grid
  const handleCompileFont = async () => {
    if (!fontName.trim()) return;
    try {
      setIsBuildingFont(true);
      const { dataUrl, synthesizedCount } = await buildOpenTypeFont(
        fontName.trim(),
        processedGlyphs,
        user?.id || "user-tushar-01"
      );

      // Notify backend API
      try {
        await fetch("/api/handwriting", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fontName.trim(),
            glyphCount: processedGlyphs.filter((g) => g.status !== "empty").length + synthesizedCount,
            userId: user?.id || "user-tushar-01",
          }),
        });
      } catch (e) {
        console.warn("Backend API sync skipped in offline mode", e);
      }

      const updatedList = getLocalFontsRegistry();
      setSavedFonts(updatedList);
      const newMeta = updatedList.find((f) => f.name === fontName.trim()) || {
        id: `font-${Date.now()}`,
        userId: user?.id || "user-tushar-01",
        name: fontName.trim(),
        createdAt: new Date().toISOString(),
        glyphCount: processedGlyphs.filter((g) => g.status !== "empty").length + synthesizedCount,
        dataUrl,
        status: "ready",
      };
      setActiveFont(newMeta);
      setStep("preview");
    } catch (err) {
      console.error("Error compiling font:", err);
      alert("Error compiling font. Please check that at least 3 glyphs are filled.");
    } finally {
      setIsBuildingFont(false);
    }
  };

  const handleApplyHandwriting = (fontToApply: string) => {
    if (!book || selectedIds.length === 0) return;
    const page = book.pages[activePageIndex];
    if (!page) return;

    for (const id of selectedIds) {
      const el = page.elements.find((e) => e.id === id);
      if (el && el.type === "text") {
        updateElement(id, { font: fontToApply } as Partial<TextEl>);
      }
    }
    saveToStorage();
  };

  const handleDeleteFont = (name: string) => {
    deleteFontFromRegistry(name);
    const updated = getLocalFontsRegistry();
    setSavedFonts(updated);
    if (activeFont?.name === name) {
      setActiveFont(updated[0] || null);
      if (updated.length === 0) setStep("overview");
    }
  };

  const handleUpdateGlyph = (index: number, updated: ProcessedGlyph) => {
    setProcessedGlyphs((prev) => {
      const next = [...prev];
      next[index] = updated;
      return next;
    });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent mb-1">
          <PenTool className="h-3 w-3" /> Signature Feature
        </div>
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-base font-medium text-text">Handwriting Studio</h3>
          {step !== "overview" && (
            <button
              onClick={() => setStep("overview")}
              className="text-[11px] text-text-muted hover:text-accent flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Reset
            </button>
          )}
        </div>
        <p className="text-xs text-text-muted mt-0.5">
          Transform your handwritten letters into a private vector font.
        </p>
      </div>

      {/* ================= STEP: OVERVIEW ================= */}
      {step === "overview" && (
        <div className="space-y-4">
          {/* Saved Custom Fonts */}
          {savedFonts.length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-3 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-text">
                <span>My Generated Fonts ({savedFonts.length}/3)</span>
                <span className="text-[10px] text-text-muted">Enforced max 3</span>
              </div>
              <div className="space-y-1.5">
                {savedFonts.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-[#faf8f5] px-3 py-2 text-left hover:border-accent transition-all group"
                  >
                    <div>
                      <div
                        className="text-sm text-text font-normal"
                        style={{ fontFamily: `"${f.name}", cursive, sans-serif` }}
                      >
                        {f.name}
                      </div>
                      <div className="text-[10px] text-text-muted">
                        {f.glyphCount} glyphs · Ready
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleApplyHandwriting(f.name)}
                        className="h-7 text-[11px] px-2.5"
                      >
                        Apply
                      </Button>
                      <button
                        onClick={() => {
                          setActiveFont(f);
                          setStep("preview");
                        }}
                        className="p-1 text-text-muted hover:text-text rounded"
                        title="Preview & test font"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Creation Steps Card */}
          <div className="rounded-xl border border-border bg-accent-soft/20 p-3.5 space-y-3">
            <div className="text-xs font-semibold text-text flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> Create New Handwriting Font
            </div>

            <div className="space-y-2 text-[11px] text-text-muted">
              <div className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent text-white text-[9px] font-bold">
                  1
                </span>
                <span>Download & print our calibrated A4 sheet (covers A–Z Capitals & a–z Small Letters).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent text-white text-[9px] font-bold">
                  2
                </span>
                <span>Fill in characters with a dark ink pen (x-height & baseline guides provided).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent text-white text-[9px] font-bold">
                  3
                </span>
                <span>Upload a photo. Our system automatically pairs and balances both Capital & Small letters.</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <Link href="/glyph-template.pdf" target="_blank" className="block">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <Download className="mr-1.5 h-3.5 w-3.5" /> Step 1: Download A4 Sheet
                </Button>
              </Link>

              <Button
                size="sm"
                onClick={() => setStep("upload")}
                className="w-full text-xs"
              >
                <Upload className="mr-1.5 h-3.5 w-3.5" /> Step 2: Upload Photo / Scan
              </Button>
            </div>
          </div>

          {/* Fast Track Demo Button */}
          <div className="rounded-lg border border-dashed border-accent/40 bg-accent-soft/10 p-3 text-center space-y-1.5">
            <div className="text-xs font-medium text-text">Testing without a printer?</div>
            <p className="text-[11px] text-text-muted">
              Run our AI synthesis on an authentic sample sheet in one click.
            </p>
            <Button
              variant="secondary"
              size="sm"
              disabled={isProcessing}
              onClick={handleTrySampleSheet}
              className="w-full text-xs"
            >
              {isProcessing ? (
                <>Processing Sample...</>
              ) : (
                <>
                  <Sparkles className="mr-1.5 h-3.5 w-3.5 text-accent" /> Try Sample Hand-drawn Sheet
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP: UPLOAD ================= */}
      {step === "upload" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-dashed border-border bg-surface p-6 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
              <Upload className="h-6 w-6" />
            </div>

            <div>
              <div className="text-xs font-semibold text-text">Upload Filled Sheet</div>
              <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                Take a top-down phone photo in good lighting. Make sure all 4 black corner squares are visible.
              </p>
            </div>

            <label className="block">
              <Button
                size="sm"
                disabled={isProcessing}
                className="cursor-pointer text-xs w-full"
                asChild
              >
                <span>
                  {isProcessing ? "Processing OpenCV Warping..." : "Choose Image (PNG / JPG)"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                </span>
              </Button>
            </label>

            <div className="pt-2 text-[10px] text-text-muted border-t border-border">
              Or{" "}
              <button
                type="button"
                onClick={handleTrySampleSheet}
                className="text-accent underline font-medium"
              >
                use synthetic demo scan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP: GLYPH REVIEW ================= */}
      {step === "review" && (
        <GlyphReview
          glyphs={processedGlyphs}
          onUpdateGlyph={handleUpdateGlyph}
          onGenerateFont={handleCompileFont}
          fontName={fontName}
          setFontName={setFontName}
          isBuildingFont={isBuildingFont}
        />
      )}

      {/* ================= STEP: LIVE PREVIEW & TEST ================= */}
      {step === "preview" && activeFont && (
        <FontPreview
          font={activeFont}
          onApplyFont={handleApplyHandwriting}
          onDeleteFont={handleDeleteFont}
        />
      )}
    </div>
  );
}
