"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEditorStore } from "@/lib/editor/store";
import { BookPageRenderer } from "@/components/preview/BookPageRenderer";
import { pageTurnAudio } from "@/lib/audio/page-turn-sound";
import { SvgClose, SvgSparkle, SvgFlourish, SvgArrowRight } from "@/components/ui/website-icons";
import { Volume2, VolumeX, Sparkles, BookOpen } from "lucide-react";

export default function BookPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = (params?.id as string) || "book-jaipur-101";
  const { book } = useEditorStore();

  const [currentSpreadIndex, setCurrentSpreadIndex] = React.useState(1); // Spread 1 = pages 2-3
  const [viewMode, setViewMode] = React.useState<"spread" | "cover">("spread");
  const [zoomLevel, setZoomLevel] = React.useState(100);
  const [showWatermark, setShowWatermark] = React.useState(true);
  const [bannerDismissed, setBannerDismissed] = React.useState(false);
  const [soundEnabled, setSoundEnabled] = React.useState(true);

  // 3D Turning Leaf Animation State
  const [isFlipping, setIsFlipping] = React.useState(false);
  const [flipDirection, setFlipDirection] = React.useState<"next" | "prev" | null>(null);

  const title = book?.title || "Jaipur: A City of Royal Memories";
  const pages = book?.pages || [];
  const totalPages = Math.max(20, pages.length);
  const totalSpreads = Math.ceil((totalPages - 1) / 2); // Exclude cover

  // Keep audio sync with soundEnabled state
  React.useEffect(() => {
    pageTurnAudio.enabled = soundEnabled;
  }, [soundEnabled]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "Home") {
        setViewMode("cover");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, currentSpreadIndex, totalSpreads, isFlipping]);

  const handleNext = () => {
    if (isFlipping) return;

    if (viewMode === "cover") {
      pageTurnAudio.play();
      setIsFlipping(true);
      setFlipDirection("next");
      setTimeout(() => {
        setViewMode("spread");
        setCurrentSpreadIndex(1);
        setIsFlipping(false);
        setFlipDirection(null);
      }, 550);
      return;
    }

    if (currentSpreadIndex < totalSpreads) {
      pageTurnAudio.play();
      setIsFlipping(true);
      setFlipDirection("next");
      setTimeout(() => {
        setCurrentSpreadIndex((prev) => Math.min(totalSpreads, prev + 1));
        setIsFlipping(false);
        setFlipDirection(null);
      }, 550);
    }
  };

  const handlePrev = () => {
    if (isFlipping) return;

    if (viewMode === "spread") {
      if (currentSpreadIndex > 1) {
        pageTurnAudio.play();
        setIsFlipping(true);
        setFlipDirection("prev");
        setTimeout(() => {
          setCurrentSpreadIndex((prev) => Math.max(1, prev - 1));
          setIsFlipping(false);
          setFlipDirection(null);
        }, 550);
      } else {
        pageTurnAudio.play();
        setIsFlipping(true);
        setFlipDirection("prev");
        setTimeout(() => {
          setViewMode("cover");
          setIsFlipping(false);
          setFlipDirection(null);
        }, 550);
      }
    }
  };

  // Active spread page numbers
  const leftPageNum = currentSpreadIndex * 2;
  const rightPageNum = currentSpreadIndex * 2 + 1;
  const leftPageData = pages[leftPageNum - 1] || null;
  const rightPageData = pages[rightPageNum - 1] || null;

  // Next spread pages for preview during flip
  const nextLeftPageNum = (currentSpreadIndex + 1) * 2;
  const nextRightPageNum = (currentSpreadIndex + 1) * 2 + 1;
  const nextLeftPageData = pages[nextLeftPageNum - 1] || null;
  const nextRightPageData = pages[nextRightPageNum - 1] || null;

  // Prev spread pages for preview during flip
  const prevLeftPageNum = (currentSpreadIndex - 1) * 2;
  const prevRightPageNum = (currentSpreadIndex - 1) * 2 + 1;
  const prevLeftPageData = pages[prevLeftPageNum - 1] || null;
  const prevRightPageData = pages[prevRightPageNum - 1] || null;

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#121110] text-[#ded8cb] antialiased select-none font-sans">
      {/* Top Notification Banner */}
      {!bannerDismissed && (
        <aside className="w-full bg-[#1e1c19] border-b border-[#312e2a] text-[#d6c5a5] px-4 py-1.5 flex items-center justify-between text-xs z-50 shrink-0">
          <div className="flex items-center gap-2 mx-auto">
            <span className="flex h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-mono text-[11px] tracking-wide">
              Physical Hardcover Preview Mode · Interactive 3D Page Turn with Spatial Sound
            </span>
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            aria-label="Dismiss banner"
            className="text-[#a8a39a] hover:text-white transition-colors p-1 rounded"
          >
            <SvgClose size={12} />
          </button>
        </aside>
      )}

      {/* Top Header */}
      <header className="bg-[#1a1917] border-b border-[#2e2a25] flex justify-between items-center w-full px-4 sm:px-6 h-14 z-40 shrink-0 shadow-sm">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link
            href={`/books/${bookId}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#3b362f] hover:bg-[#252320] text-[#dcd6ca] text-xs font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Back to Editor</span>
          </Link>

          <div className="h-4 w-px bg-[#3b362f] hidden sm:block" />

          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#d4af37]" />
            <span className="font-serif text-base sm:text-lg font-semibold tracking-tight text-[#f2ede4] line-clamp-1">
              {title}
            </span>
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#2a2621] text-[#c4b9a5] border border-[#3e3831]">
              Hardcover Spec · 300 DPI
            </span>
          </div>
        </div>

        {/* Center: Controls for Watermark & Sound */}
        <div className="hidden lg:flex items-center gap-4 text-xs text-[#a39a8c]">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={showWatermark}
              onChange={(e) => setShowWatermark(e.target.checked)}
              className="rounded border-[#3e3831] text-[#9e3d48] focus:ring-0 w-3.5 h-3.5 bg-[#252320]"
            />
            <span className="font-mono text-[11px]">Draft Watermark</span>
          </label>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#3e3831] bg-[#252320] text-[#c4b9a5] hover:text-white transition-colors text-[11px] font-mono"
            title={soundEnabled ? "Mute page turn sound" : "Enable page turn sound"}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Page Sound: On</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3.5 w-3.5 text-neutral-400" />
                <span>Page Sound: Off</span>
              </>
            )}
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => router.push(`/books/${bookId}/checkout`)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#9e3d48] hover:bg-[#852f39] text-white text-xs font-semibold shadow-md transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download PDF · ₹50</span>
          </button>
        </div>
      </header>

      {/* Main 3D Book Stage */}
      <main
        className="flex-1 flex flex-col justify-center items-center p-3 sm:p-6 md:p-8 lg:p-10 relative overflow-hidden bg-radial from-[#1e1c19] via-[#141311] to-[#0a0a09]"
        style={{ perspective: "2400px" }}
      >
        {/* Physical Book Wrapper with 3D Depth */}
        <div
          className="relative w-full max-w-5xl flex items-center justify-center my-auto transition-transform duration-300"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* ================= CLOSED HARDCOVER COVER VIEW ================= */}
          {viewMode === "cover" && (
            <div
              className={`relative w-80 sm:w-96 aspect-[3/4] bg-[#3a1317] rounded-r-2xl rounded-l-sm shadow-[0_35px_80px_-15px_rgba(0,0,0,0.9),0_15px_30px_rgba(0,0,0,0.8)] border border-[#5a1c22] p-8 flex flex-col justify-between cursor-pointer transition-all duration-700 hover:scale-[1.02] ${
                isFlipping ? "rotate-y-[-70deg] opacity-75" : "rotate-y-0 opacity-100"
              }`}
              onClick={handleNext}
              title="Click to open book"
              style={{
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
                backgroundImage:
                  "radial-gradient(#4d191f 15%, transparent 16%), radial-gradient(#4d191f 15%, transparent 16%)",
                backgroundSize: "6px 6px",
                backgroundPosition: "0 0, 3px 3px",
              }}
            >
              {/* Embossed Leather Spine & Gold Foil Accents */}
              <div className="absolute inset-4 border border-[#d4af37]/50 rounded-r-lg pointer-events-none" />
              <div className="absolute inset-5 border border-[#d4af37]/20 rounded-r-lg pointer-events-none" />

              {/* Silk bookmark ribbon hanging out */}
              <div className="absolute -top-3.5 left-12 w-4 h-9 bg-[#8c1c24] rounded-t-sm shadow-md border-x border-[#590e14] z-20" />
              <div className="absolute -bottom-5 left-14 w-3.5 h-10 bg-[#8c1c24] rounded-b-sm shadow-md border-x border-[#590e14] z-20 transform rotate-3" />

              {/* Spine edge hinge crease */}
              <div className="absolute top-0 left-5 bottom-0 w-1 bg-gradient-to-r from-black/40 via-transparent to-white/10" />

              <div className="relative z-10 flex justify-between items-center text-[#d4af37] text-xs font-mono">
                <span>VOL. I</span>
                <span>EST. 2026</span>
              </div>

              <div className="relative z-10 text-center space-y-3 my-auto">
                <div className="h-0.5 w-12 bg-[#d4af37]/70 mx-auto" />
                <h2 className="font-serif text-3xl sm:text-4xl text-[#fce8ba] font-normal tracking-wide gold-foil drop-shadow-sm">
                  {title}
                </h2>
                <p className="font-serif italic text-sm text-[#e8cda2]/90 tracking-wider">
                  A Handcrafted Travel Chronicle
                </p>
                <div className="h-0.5 w-12 bg-[#d4af37]/70 mx-auto" />
              </div>

              <div className="relative z-10 text-center text-[#d4af37]/80 text-[11px] font-mono tracking-widest uppercase">
                STORYBOUND PRIVATE PRESS · HARDBOUND
              </div>
            </div>
          )}

          {/* ================= OPEN TWO-PAGE PHYSICAL BOOK SPREAD ================= */}
          {viewMode === "spread" && (
            <div
              className="relative w-full"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* Outer Hardcover Casing (Extending 12px beyond page block) */}
              <div
                className="absolute -inset-3 sm:-inset-4 bg-[#3a1317] rounded-2xl shadow-[0_40px_90px_-20px_rgba(0,0,0,0.95),0_20px_40px_rgba(0,0,0,0.8)] border border-[#521b21]"
                style={{
                  backgroundImage:
                    "radial-gradient(#4d191f 15%, transparent 16%), radial-gradient(#4d191f 15%, transparent 16%)",
                  backgroundSize: "6px 6px",
                  backgroundPosition: "0 0, 3px 3px",
                }}
              >
                {/* Gold perimeter rule stamped into casing */}
                <div className="absolute inset-1.5 border border-[#a27b40]/30 rounded-xl pointer-events-none" />
              </div>

              {/* Realistic Stacked Paper Edge Block (showing book thickness ~200 pages) */}
              <div
                className="absolute -inset-y-1.5 -inset-x-1.5 bg-[#f5efe3] rounded-lg border border-[#cfc8b8] shadow-md pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, #dcd5c5 0px, #dcd5c5 1px, #faf6ee 1px, #faf6ee 3px)",
                }}
              />

              {/* Silk ribbon bookmark trailing down across the open spread */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-10 bg-[#8c1c24] rounded-t-sm shadow-md z-40 pointer-events-none border-x border-[#590e14]" />
              <div
                className="absolute -bottom-8 left-[49.5%] -translate-x-1/2 w-3.5 h-16 bg-[#8c1c24] shadow-xl z-40 pointer-events-none rounded-b-md transform -rotate-6 border-r border-[#590e14]"
                style={{
                  background: "linear-gradient(135deg, #8c1c24 0%, #aa2530 50%, #6e131a 100%)",
                }}
              />

              {/* The Actual Open Pages Container */}
              <div
                className="relative w-full bg-[#fdfcf9] rounded-md overflow-hidden flex flex-col md:flex-row shadow-2xl z-10 border border-[#d8d1c2]"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Left Page (Static Base) */}
                <div className="flex-1 relative">
                  {/* Deep Gutter Spine Shadow on inner fold */}
                  <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-black/25 via-black/8 to-transparent pointer-events-none z-30" />

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
                        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#968977] block">
                          Morning Reflections
                        </span>
                        <h1 className="font-serif text-2xl sm:text-3xl text-[#262422] font-medium">
                          Morning in the Pink City
                        </h1>
                        <p className="font-serif text-[#322f2b] text-[15px] leading-relaxed text-justify">
                          Before the bazaars of Johari awakened with their brilliant displays of beaten silver, dawn cast an ember radiance over the terracotta battlements. The morning air carried the scent of crushed marigolds and cardamom seeds from ancient palace fires.
                        </p>
                      </div>
                      <footer className="pt-3 border-t border-[#e5dfd3] flex justify-between text-xs font-serif text-[#736c61]">
                        <span>Storybound Press</span>
                        <span>{leftPageNum}</span>
                      </footer>
                    </article>
                  )}

                  {/* Corner Curl Clickable Prev Target */}
                  <div
                    onClick={handlePrev}
                    className="absolute bottom-0 left-0 w-8 h-8 sm:w-10 sm:h-10 cursor-pointer transition-all hover:w-12 hover:h-12 z-30"
                    title="Click to turn to previous page"
                    style={{
                      background:
                        "linear-gradient(-135deg, transparent 50%, #e2ded5 50%, #f4f0e6 65%, #c8c2b5 100%)",
                      boxShadow: "3px -3px 7px rgba(0, 0, 0, 0.15)",
                      borderRadius: "0 4px 0 0",
                    }}
                  />
                </div>

                {/* Right Page (Static Base) */}
                <div className="flex-1 relative border-t md:border-t-0 md:border-l border-[#e8e4db]">
                  {/* Deep Gutter Spine Shadow on inner fold */}
                  <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-black/25 via-black/8 to-transparent pointer-events-none z-30" />

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

                  {/* Corner Curl Clickable Next Target */}
                  <div
                    onClick={handleNext}
                    className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 cursor-pointer transition-all hover:w-12 hover:h-12 z-30"
                    title="Click to turn to next page"
                    style={{
                      background:
                        "linear-gradient(135deg, transparent 50%, #e2ded5 50%, #f4f0e6 65%, #c8c2b5 100%)",
                      boxShadow: "-3px -3px 7px rgba(0, 0, 0, 0.15)",
                      borderRadius: "4px 0 0 0",
                    }}
                  >
                    <SvgArrowRight size={10} className="absolute bottom-1.5 right-1.5 text-[#71695c]" />
                  </div>
                </div>

                {/* ================= 3D ANIMATED TURNING LEAF LAYER ================= */}
                {isFlipping && flipDirection === "next" && (
                  <div
                    className="absolute top-0 right-0 w-1/2 h-full z-40 overflow-hidden pointer-events-none"
                    style={{
                      transformOrigin: "left center",
                      animation: "pageFlipNext 550ms cubic-bezier(0.25, 1, 0.5, 1) forwards",
                      transformStyle: "preserve-3d",
                      boxShadow: "-15px 0 30px rgba(0,0,0,0.35)",
                    }}
                  >
                    {/* Turning leaf face */}
                    <div className="w-full h-full bg-[#fdfcf9] paper-texture border-l border-[#d8d1c2] flex items-center justify-center p-8">
                      <span className="font-serif italic text-xs text-[#8c8273]">Turning page...</span>
                    </div>
                  </div>
                )}

                {isFlipping && flipDirection === "prev" && (
                  <div
                    className="absolute top-0 left-0 w-1/2 h-full z-40 overflow-hidden pointer-events-none"
                    style={{
                      transformOrigin: "right center",
                      animation: "pageFlipPrev 550ms cubic-bezier(0.25, 1, 0.5, 1) forwards",
                      transformStyle: "preserve-3d",
                      boxShadow: "15px 0 30px rgba(0,0,0,0.35)",
                    }}
                  >
                    {/* Turning leaf face */}
                    <div className="w-full h-full bg-[#fdfcf9] paper-texture border-r border-[#d8d1c2] flex items-center justify-center p-8">
                      <span className="font-serif italic text-xs text-[#8c8273]">Turning page...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Bottom Navigation Controller */}
      <footer className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-auto max-w-[95vw]">
        <div className="bg-[#1e1c19]/95 backdrop-blur-md border border-[#3b362f] rounded-full px-4 py-2 flex items-center gap-2 sm:gap-4 shadow-2xl text-[#d4cfc7]">
          {/* Previous / Next buttons */}
          <div className="flex items-center gap-1 border-r border-[#383530] pr-2 sm:pr-3">
            <button
              onClick={handlePrev}
              disabled={viewMode === "cover" || isFlipping}
              aria-label="Previous Page"
              className="p-1.5 hover:bg-[#32302a] hover:text-white rounded-full transition-colors disabled:opacity-30"
              title="Previous Page (Left Arrow)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span className="font-mono text-xs font-medium px-2 text-[#efebe4] whitespace-nowrap">
              {viewMode === "cover" ? "Cover View" : `Pages ${leftPageNum}–${rightPageNum} of ${totalPages}`}
            </span>

            <button
              onClick={handleNext}
              disabled={(viewMode === "spread" && currentSpreadIndex >= totalSpreads) || isFlipping}
              aria-label="Next Page"
              className="p-1.5 hover:bg-[#32302a] hover:text-white rounded-full transition-colors disabled:opacity-30"
              title="Next Page (Right Arrow)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1 bg-[#141412] p-0.5 rounded-full border border-[#2e2b26] text-xs">
            <button
              onClick={() => {
                if (viewMode !== "spread") {
                  pageTurnAudio.play();
                  setViewMode("spread");
                }
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                viewMode === "spread"
                  ? "bg-[#2f2c27] text-[#f2ede4] shadow-sm"
                  : "text-[#8e8981] hover:text-white"
              }`}
            >
              Spread
            </button>
            <button
              onClick={() => {
                if (viewMode !== "cover") {
                  pageTurnAudio.play();
                  setViewMode("cover");
                }
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                viewMode === "cover"
                  ? "bg-[#2f2c27] text-[#f2ede4] shadow-sm"
                  : "text-[#8e8981] hover:text-white"
              }`}
            >
              Cover
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 hover:bg-[#32302a] rounded-full text-[#c4b9a5] hover:text-white transition-colors"
            title={soundEnabled ? "Mute Sound" : "Enable Sound"}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-400" /> : <VolumeX className="h-4 w-4 text-neutral-400" />}
          </button>

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
