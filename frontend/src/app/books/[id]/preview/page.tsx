"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEditorStore } from "@/lib/editor/store";
import { BookPageRenderer } from "@/components/preview/BookPageRenderer";
import { SvgClose, SvgSparkle, SvgFlourish, SvgArrowRight } from "@/components/ui/website-icons";

export default function BookPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = (params?.id as string) || "book-jaipur-101";
  const { book } = useEditorStore();

  const [currentSpreadIndex, setCurrentSpreadIndex] = React.useState(1); // Spread 1 = pages 2-3
  const [viewMode, setViewMode] = React.useState<"spread" | "single" | "cover">("spread");
  const [singlePageIndex, setSinglePageIndex] = React.useState(1); // 0-indexed
  const [zoomLevel, setZoomLevel] = React.useState(100);
  const [showWatermark, setShowWatermark] = React.useState(true);
  const [bannerDismissed, setBannerDismissed] = React.useState(false);
  const [isFlipping, setIsFlipping] = React.useState(false);
  const [flipDirection, setFlipDirection] = React.useState<"next" | "prev">("next");

  const title = book?.title || "Jaipur: A City of Royal Memories";
  const pages = book?.pages || [];
  const totalPages = Math.max(20, pages.length);
  const totalSpreads = Math.ceil((totalPages - 1) / 2); // Exclude cover

  // Keyboard Navigation: Arrow keys, Home, End
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "ArrowRight" || e.key === "PageDown") {
        handleNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        handlePrev();
      } else if (e.key === "Home") {
        setViewMode("cover");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, currentSpreadIndex, singlePageIndex, totalSpreads, totalPages]);

  const handleNext = () => {
    if (viewMode === "cover") {
      setViewMode("spread");
      setCurrentSpreadIndex(1);
      return;
    }

    if (viewMode === "spread" && currentSpreadIndex < totalSpreads) {
      setFlipDirection("next");
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentSpreadIndex((prev) => Math.min(totalSpreads, prev + 1));
        setIsFlipping(false);
      }, 250);
    } else if (viewMode === "single" && singlePageIndex < totalPages - 1) {
      setFlipDirection("next");
      setIsFlipping(true);
      setTimeout(() => {
        setSinglePageIndex((prev) => Math.min(totalPages - 1, prev + 1));
        setIsFlipping(false);
      }, 250);
    }
  };

  const handlePrev = () => {
    if (viewMode === "spread") {
      if (currentSpreadIndex > 1) {
        setFlipDirection("prev");
        setIsFlipping(true);
        setTimeout(() => {
          setCurrentSpreadIndex((prev) => Math.max(1, prev - 1));
          setIsFlipping(false);
        }, 250);
      } else {
        setViewMode("cover");
      }
    } else if (viewMode === "single") {
      if (singlePageIndex > 0) {
        setFlipDirection("prev");
        setIsFlipping(true);
        setTimeout(() => {
          setSinglePageIndex((prev) => Math.max(0, prev - 1));
          setIsFlipping(false);
        }, 250);
      } else {
        setViewMode("cover");
      }
    }
  };

  // Page Numbers
  const leftPageNum = currentSpreadIndex * 2;
  const rightPageNum = currentSpreadIndex * 2 + 1;
  const leftPageData = pages[leftPageNum - 1] || null;
  const rightPageData = pages[rightPageNum - 1] || null;
  const singlePageData = pages[singlePageIndex] || null;

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#161514] text-on-surface antialiased select-none">
      {/* Top Notification Banner */}
      {!bannerDismissed && (
        <aside className="w-full bg-[#272522] border-b border-[#383531] text-[#d6c5a5] px-4 py-1.5 flex items-center justify-between text-xs z-50 shrink-0">
          <div className="flex items-center gap-2 mx-auto">
            <span className="flex h-1.5 w-1.5 rounded-full bg-secondary-fixed animate-pulse" />
            <span className="font-label-sm tracking-wide">
              Preview is watermarked for draft inspection. Download unlocks your clean, 300 DPI print-ready PDF.
            </span>
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            aria-label="Dismiss banner"
            className="text-[#a8a39a] hover:text-white transition-colors p-1 rounded inline-flex items-center justify-center"
          >
            <SvgClose size={12} />
          </button>
        </aside>
      )}

      {/* Top Header */}
      <header className="bg-surface-container-lowest border-b border-surface-variant flex justify-between items-center w-full px-4 sm:px-6 h-14 z-40 shrink-0 shadow-sm">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link
            href={`/books/${bookId}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-variant hover:bg-surface-container-low text-on-surface text-label-md font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Back to editing</span>
          </Link>

          <div className="h-4 w-px bg-surface-variant hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-serif text-base sm:text-lg font-semibold tracking-tight text-on-surface line-clamp-1">
              {title}
            </span>
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-surface-container text-on-surface-variant border border-surface-variant">
              300 DPI A5 Spec
            </span>
          </div>
        </div>

        {/* Watermark toggle */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-on-surface-variant">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-primary">
            <input
              type="checkbox"
              checked={showWatermark}
              onChange={(e) => setShowWatermark(e.target.checked)}
              className="rounded border-surface-variant text-primary focus:ring-0 w-3.5 h-3.5"
            />
            <span className="font-mono text-[11px]">Draft Watermark</span>
          </label>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => router.push(`/books/${bookId}/checkout`)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-neutral-800 text-on-primary text-label-md font-medium shadow-sm transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download PDF · ₹50</span>
          </button>
        </div>
      </header>

      {/* 3D Flipbook Stage */}
      <main
        className="preview-ambient-stage flex-1 flex flex-col justify-center items-center p-3 sm:p-6 md:p-8 lg:p-10 relative overflow-hidden"
        style={{ perspective: "1600px" }}
      >
        <div
          className={`relative w-full max-w-5xl flex items-center justify-center my-auto transition-transform duration-300`}
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* ================= COVER VIEW ================= */}
          {viewMode === "cover" && (
            <div
              className={`relative w-80 sm:w-96 aspect-[3/4] bg-[#4a181d] rounded-r-2xl rounded-l-sm shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85)] border border-[#6b252c] p-8 flex flex-col justify-between cursor-pointer transition-all duration-500 hover:scale-[1.02] ${
                isFlipping ? "rotate-y-[-45deg] opacity-75" : "rotate-y-0 opacity-100"
              }`}
              onClick={handleNext}
              title="Click to open book"
            >
              <div className="absolute inset-4 border border-[#d4af37]/40 rounded-r-lg pointer-events-none" />
              <div className="absolute inset-5 border border-[#d4af37]/20 rounded-r-lg pointer-events-none" />
              <div className="absolute -top-3 left-12 w-4 h-8 bg-[#99222a] rounded-t-sm shadow-md border-x border-[#691218]" />

              <div className="relative z-10 flex justify-between items-center text-[#d4af37] text-xs font-mono">
                <span>VOL. I</span>
                <span>EST. 2026</span>
              </div>

              <div className="relative z-10 text-center space-y-3 my-auto">
                <div className="h-0.5 w-10 bg-[#d4af37]/60 mx-auto" />
                <h2 className="font-serif text-3xl sm:text-4xl text-[#f7dfa5] font-normal tracking-wide gold-foil">
                  {title}
                </h2>
                <p className="font-serif italic text-sm text-[#e8cda2]/80 tracking-wider">
                  A Handcrafted Travel Chronicle
                </p>
                <div className="h-0.5 w-10 bg-[#d4af37]/60 mx-auto" />
              </div>

              <div className="relative z-10 text-center text-[#d4af37]/70 text-[11px] font-mono tracking-widest uppercase">
                STORYBOUND PRIVATE PRESS · HARDBOUND
              </div>
            </div>
          )}

          {/* ================= TWO-PAGE SPREAD VIEW ================= */}
          {viewMode === "spread" && (
            <div
              className={`relative w-full transition-transform duration-300 ease-out ${
                isFlipping
                  ? flipDirection === "next"
                    ? "rotate-y-[-8deg] scale-[0.98]"
                    : "rotate-y-[8deg] scale-[0.98]"
                  : "rotate-y-0 scale-100"
              }`}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Maroon cloth book backing casing */}
              <div className="absolute -inset-2.5 sm:-inset-3 bg-[#4a181d] rounded-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_10px_25px_-5px_rgba(0,0,0,0.6)] border border-[#6b252c]">
                <div className="absolute inset-[3px] border border-[#a27b40]/30 rounded-lg pointer-events-none" />
              </div>

              {/* Silk ribbon marker */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-9 bg-[#99222a] rounded-t-sm shadow-md z-30 pointer-events-none border-l border-r border-[#691218]" />
              <div className="absolute -bottom-6 left-[49%] -translate-x-1/2 w-3.5 h-12 bg-[#99222a] shadow-lg z-30 pointer-events-none rounded-b-md transform -rotate-3 border-r border-[#691218]" />

              {/* Open Spread */}
              <div className="relative w-full bg-[#fdfcf9] rounded-lg overflow-hidden flex flex-col md:flex-row shadow-2xl z-10 border border-[#ded8cb]">
                {/* Left Page */}
                <div className="flex-1 relative">
                  {leftPageData && leftPageData.elements.length > 0 ? (
                    <BookPageRenderer
                      page={leftPageData}
                      pageNumber={leftPageNum}
                      isLeftPage={true}
                      showWatermark={showWatermark}
                      bookTitle={title}
                    />
                  ) : (
                    /* High-fidelity editorial default layout for left page */
                    <article className="paper-texture p-6 sm:p-8 md:p-12 relative flex flex-col justify-between min-h-[460px] sm:min-h-[520px]">
                      <div className="absolute top-0 right-0 w-12 h-full gutter-spine-gradient pointer-events-none z-20" />
                      {showWatermark && (
                        <div className="absolute inset-0 pointer-events-none opacity-[0.06] flex items-center justify-center rotate-[-15deg]">
                          <span className="font-serif text-3xl font-bold text-black">STORYBOUND PREVIEW</span>
                        </div>
                      )}
                      <header className="flex justify-between pb-3 border-b border-[#e5dfd3]">
                        <span className="font-mono text-[10px] tracking-widest text-[#827a6f]">CHAPTER II</span>
                        <span className="font-serif italic text-xs text-[#9c9386]">A Royal Chronicle</span>
                      </header>
                      <div className="my-auto py-6 max-w-[420px] mx-auto text-center space-y-4">
                        <h1 className="font-serif text-2xl sm:text-3xl text-[#262422]">
                          Morning in the Pink City
                        </h1>
                        <p className="font-serif text-[#322f2b] text-[15px] leading-relaxed text-justify">
                          Before the bazaars of Johari awakened with their brilliant displays of beaten silver, dawn cast an ember radiance over the terracotta battlements. The morning air carried the scent of crushed marigolds and cardamom seeds.
                        </p>
                      </div>
                      <footer className="pt-3 border-t border-[#e5dfd3] flex justify-between text-xs font-serif text-[#736c61]">
                        <span>Storybound Press</span>
                        <span>{leftPageNum}</span>
                      </footer>
                    </article>
                  )}
                </div>

                {/* Right Page */}
                <div className="flex-1 relative border-t md:border-t-0 md:border-l border-[#e8e4db]">
                  {rightPageData && rightPageData.elements.length > 0 ? (
                    <BookPageRenderer
                      page={rightPageData}
                      pageNumber={rightPageNum}
                      isLeftPage={false}
                      showWatermark={showWatermark}
                      bookTitle={title}
                    />
                  ) : (
                    /* High-fidelity editorial photograph layout for right page */
                    <article className="paper-texture p-6 sm:p-8 md:p-12 relative flex flex-col justify-between min-h-[460px] sm:min-h-[520px]">
                      <div className="absolute top-0 left-0 w-12 h-full gutter-spine-gradient-right pointer-events-none z-20" />
                      {showWatermark && (
                        <div className="absolute inset-0 pointer-events-none opacity-[0.06] flex items-center justify-center rotate-[-15deg]">
                          <span className="font-serif text-3xl font-bold text-black">STORYBOUND PREVIEW</span>
                        </div>
                      )}
                      <header className="flex justify-between pb-3 border-b border-[#e5dfd3]">
                        <span className="font-serif italic text-xs text-[#9c9386]">Hawa Mahal</span>
                        <span className="font-mono text-[10px] tracking-widest text-[#827a6f]">PLATE 08</span>
                      </header>
                      <div className="my-auto py-4 flex flex-col items-center">
                        <div className="relative w-full max-w-[380px] p-2 bg-[#f8f5ee] rounded border border-[#dcd6c8]">
                          <img
                            alt="Jaipur Monument"
                            className="w-full aspect-[4/3] object-cover rounded"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPPeqYeCMigBWahxqaSlsuyxKI5gxubGfVA0b-HhL0qi2FX4noduTVEz8clMJWsDQ67-pn5SA6dcCyZ0nx3qKWXLdww7XyWE-FR5z6ap2HNv57piSM3bKCz_NtBBnx942-R95cQAVHkDwnBrgLadvsXMDsbgv7N-16bT2LtmU6xZLXJuxTiRK-AnILGRr9CHPH5egD-KPvxPNPl-EjvYcaX02AVhrsGx72fuZF9X7ZSr1QBn3M6QGf"
                          />
                        </div>
                        <span className="font-serif text-sm font-medium text-[#292724] mt-3">
                          The Honeycomb Crown of Badi Choupad
                        </span>
                      </div>
                      <footer className="pt-3 border-t border-[#e5dfd3] flex justify-between text-xs font-serif text-[#736c61]">
                        <span>{rightPageNum}</span>
                        <span className="uppercase text-[10px] tracking-wider">Jaipur Chronicle</span>
                      </footer>
                    </article>
                  )}

                  {/* Corner fold curl for turning page */}
                  <div
                    onClick={handleNext}
                    className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 cursor-pointer transition-all hover:w-12 hover:h-12 z-40"
                    title="Click to turn page"
                    style={{
                      background: "linear-gradient(135deg, transparent 50%, #e2ded5 50%, #f4f0e6 65%, #c8c2b5 100%)",
                      boxShadow: "-3px -3px 7px rgba(0, 0, 0, 0.15)",
                      borderRadius: "4px 0 0 0",
                    }}
                  >
                    <SvgArrowRight size={10} className="absolute bottom-1.5 right-1.5 text-[#71695c]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= SINGLE PAGE VIEW ================= */}
          {viewMode === "single" && (
            <div
              className={`relative w-full max-w-md mx-auto transition-transform duration-300 ${
                isFlipping ? "scale-[0.98] opacity-80" : "scale-100 opacity-100"
              }`}
            >
              <div className="bg-[#fdfcf9] rounded-lg shadow-2xl overflow-hidden border border-[#ded8cb]">
                <BookPageRenderer
                  page={singlePageData}
                  pageNumber={singlePageIndex + 1}
                  showWatermark={showWatermark}
                  bookTitle={title}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Bottom Navigation Controller */}
      <footer className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-auto max-w-[95vw]">
        <div className="bg-[#1f1e1c]/95 backdrop-blur-md border border-[#3b3833] rounded-full px-4 py-2 flex items-center gap-2 sm:gap-4 shadow-2xl text-[#d4cfc7]">
          {/* Previous / Next buttons */}
          <div className="flex items-center gap-1 border-r border-[#383530] pr-2 sm:pr-3">
            <button
              onClick={handlePrev}
              disabled={viewMode === "cover"}
              aria-label="Previous Page"
              className="p-1.5 hover:bg-[#32302a] hover:text-white rounded-full transition-colors disabled:opacity-30"
              title="Previous (Left Arrow)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span className="font-mono text-xs font-medium px-2 text-[#efebe4] whitespace-nowrap">
              {viewMode === "cover"
                ? "Cover View"
                : viewMode === "single"
                ? `Page ${singlePageIndex + 1} of ${totalPages}`
                : `Pages ${leftPageNum}–${rightPageNum} of ${totalPages}`}
            </span>

            <button
              onClick={handleNext}
              disabled={
                viewMode === "spread"
                  ? currentSpreadIndex >= totalSpreads
                  : singlePageIndex >= totalPages - 1
              }
              aria-label="Next Page"
              className="p-1.5 hover:bg-[#32302a] hover:text-white rounded-full transition-colors disabled:opacity-30"
              title="Next (Right Arrow)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1 bg-[#141412] p-0.5 rounded-full border border-[#2e2b26] text-xs">
            <button
              onClick={() => setViewMode("spread")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                viewMode === "spread"
                  ? "bg-[#2f2c27] text-[#f2ede4] shadow-sm"
                  : "text-[#8e8981] hover:text-white"
              }`}
            >
              Spread
            </button>
            <button
              onClick={() => setViewMode("single")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                viewMode === "single"
                  ? "bg-[#2f2c27] text-[#f2ede4] shadow-sm"
                  : "text-[#8e8981] hover:text-white"
              }`}
            >
              Single
            </button>
            <button
              onClick={() => setViewMode("cover")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                viewMode === "cover"
                  ? "bg-[#2f2c27] text-[#f2ede4] shadow-sm"
                  : "text-[#8e8981] hover:text-white"
              }`}
            >
              Cover
            </button>
          </div>

          {/* Zoom */}
          <div className="hidden sm:flex items-center gap-1 border-l border-[#383530] pl-3">
            <button
              onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
              className="p-1 hover:bg-[#32302a] hover:text-white rounded-full transition-colors"
              title="Zoom Out"
            >
              −
            </button>
            <span className="font-mono text-[11px] text-[#a19a90] px-1 w-10 text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
              className="p-1 hover:bg-[#32302a] hover:text-white rounded-full transition-colors"
              title="Zoom In"
            >
              +
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
