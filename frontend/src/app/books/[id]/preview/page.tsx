"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEditorStore } from "@/lib/editor/store";
import { StoryboundLogo } from "@/components/ui/logo";
import { SvgClose, SvgSparkle, SvgFlourish, SvgArrowRight } from "@/components/ui/website-icons";

export default function BookPreviewPage() {
  const params = useParams();
  const bookId = (params?.id as string) || "book-jaipur-101";
  const { book } = useEditorStore();

  const [currentSpreadIndex, setCurrentSpreadIndex] = React.useState(2); // Spread 2 = pages 4-5
  const [viewMode, setViewMode] = React.useState<"single" | "spread" | "cover">("spread");
  const [zoomLevel, setZoomLevel] = React.useState(100);
  const [showWatermark, setShowWatermark] = React.useState(true);
  const [bannerDismissed, setBannerDismissed] = React.useState(false);
  const [flipAnimation, setFlipAnimation] = React.useState(false);

  const title = book?.title || "Jaipur: A City of Royal Memories";
  const totalSpreads = 10; // 20 pages total

  const handleNextSpread = () => {
    if (currentSpreadIndex < totalSpreads) {
      setFlipAnimation(true);
      setTimeout(() => {
        setCurrentSpreadIndex((prev) => Math.min(totalSpreads, prev + 1));
        setFlipAnimation(false);
      }, 200);
    }
  };

  const handlePrevSpread = () => {
    if (currentSpreadIndex > 1) {
      setFlipAnimation(true);
      setTimeout(() => {
        setCurrentSpreadIndex((prev) => Math.max(1, prev - 1));
        setFlipAnimation(false);
      }, 200);
    }
  };

  const pageNumLeft = currentSpreadIndex * 2;
  const pageNumRight = currentSpreadIndex * 2 + 1;

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#161514] text-on-surface antialiased select-none">
      {/* Top Notification Banner */}
      {!bannerDismissed && (
        <aside className="w-full bg-[#272522] border-b border-[#383531] text-[#d6c5a5] px-4 py-1.5 flex items-center justify-between text-xs z-50 shrink-0">
          <div className="flex items-center gap-2 mx-auto">
            <span className="flex h-1.5 w-1.5 rounded-full bg-secondary-fixed animate-pulse" />
            <span className="font-label-sm tracking-wide">
              Preview is watermarked for draft inspection. Download to generate your pristine, clean 300 DPI PDF.
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

      {/* Top Navigation Bar */}
      <header className="bg-surface-container-lowest border-b border-surface-variant flex justify-between items-center w-full px-4 sm:px-6 h-14 z-40 shrink-0 shadow-sm">
        {/* Left: Back to editing & Book Title */}
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
              300 DPI Hardbound Spec
            </span>
          </div>
        </div>

        {/* Center: Watermark toggle */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-on-surface-variant">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-primary">
            <input
              type="checkbox"
              checked={showWatermark}
              onChange={(e) => setShowWatermark(e.target.checked)}
              className="rounded border-surface-variant text-primary focus:ring-0 w-3.5 h-3.5"
            />
            <span className="font-mono text-[11px]">Show Watermark</span>
          </label>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => alert("Physical hardcover orders will begin fulfillment shortly across India! You can download your print-ready PDF today.")}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#c4b59b] bg-[#fbf8f2] hover:bg-[#f3eedf] text-[#4d402b] text-label-md font-medium transition-colors shadow-sm"
          >
            <span>Order printed book</span>
          </button>

          <button
            onClick={() => alert("Downloading your 300 DPI print-ready PDF for ₹50. Order confirmed!")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-neutral-800 text-on-primary text-label-md font-medium shadow-sm transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download PDF · ₹50</span>
          </button>
        </div>
      </header>

      {/* Main Ambient Stage */}
      <main className="preview-ambient-stage flex-1 flex flex-col justify-center items-center p-3 sm:p-6 md:p-8 lg:p-10 relative overflow-hidden">
        {/* Book Container */}
        <div
          className={`relative w-full max-w-5xl flex items-center justify-center my-auto transition-transform duration-300 ${
            flipAnimation ? "scale-[0.98] opacity-90" : "scale-100 opacity-100"
          }`}
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          {viewMode === "cover" ? (
            /* ================= CLOSED HARDCOVER COVER VIEW ================= */
            <div className="relative w-80 sm:w-96 aspect-[3/4] bg-[#4a181d] rounded-r-2xl rounded-l-sm shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8)] border border-[#6b252c] p-8 flex flex-col justify-between book-spine-shadow overflow-hidden group">
              {/* Embossed Gold Edge Foil */}
              <div className="absolute inset-4 border border-[#d4af37]/40 rounded-r-lg pointer-events-none" />
              <div className="absolute inset-5 border border-[#d4af37]/20 rounded-r-lg pointer-events-none" />

              {/* Silk ribbon poking out */}
              <div className="absolute -top-3 left-12 w-4 h-8 bg-[#99222a] rounded-t-sm shadow-md border-x border-[#691218]" />

              <div className="relative z-10 flex justify-between items-center text-[#d4af37] text-xs font-mono">
                <span>VOL. II</span>
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
          ) : (
            /* ================= TWO-PAGE SPREAD VIEW ================= */
            <div className="relative w-full">
              {/* Peeking Cloth Hardcover Shadow and Edge Trim (Rich Maroon Cloth) */}
              <div className="absolute -inset-2.5 sm:-inset-3 bg-[#4a181d] rounded-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_10px_25px_-5px_rgba(0,0,0,0.6)] border border-[#6b252c]">
                {/* Embossed Gold Edge Foil on Book Casing */}
                <div className="absolute inset-[3px] border border-[#a27b40]/30 rounded-lg pointer-events-none" />
              </div>

              {/* Silk Ribbon Marker peeking from top and bottom gutter */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-9 bg-[#99222a] rounded-t-sm shadow-md z-30 pointer-events-none border-l border-r border-[#691218]" />
              <div className="absolute -bottom-6 left-[49%] -translate-x-1/2 w-3.5 h-12 bg-[#99222a] shadow-lg z-30 pointer-events-none rounded-b-md transform -rotate-3 border-r border-[#691218]" />

              {/* The Open Book Spread Container */}
              <div className="relative w-full bg-[#fdfcf9] rounded-lg overflow-hidden flex flex-col md:flex-row shadow-2xl z-10 border border-[#ded8cb]">
                {/* Watermark Repeating Text Layer */}
                {showWatermark && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none opacity-[0.06] flex flex-wrap justify-around items-center select-none rotate-[-15deg] scale-110 z-30"
                  >
                    {Array.from({ length: 12 }).map((_, i) => (
                      <span key={i} className="font-serif text-2xl font-bold tracking-[0.3em] text-[#333] m-8">
                        STORYBOUND PREVIEW
                      </span>
                    ))}
                  </div>
                )}

                {/* ================= LEFT PAGE: NARRATIVE PROSE ================= */}
                <article className="flex-1 paper-texture p-6 sm:p-8 md:p-12 lg:p-14 relative flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#e8e4db] min-h-[460px] sm:min-h-[520px]">
                  {/* Gold Corner Accents */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#bda682]/70 pointer-events-none" />
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#bda682]/70 pointer-events-none" />

                  {/* Spine Shadow Overlay for Left Gutter */}
                  <div className="absolute top-0 right-0 w-12 h-full gutter-spine-gradient pointer-events-none z-20" />

                  {/* Running Header */}
                  <header className="flex items-center justify-between pb-4 border-b border-[#e5dfd3]/80">
                    <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.22em] text-[#827a6f] uppercase">
                      JAIPUR · CHAPTER II
                    </span>
                    <span className="text-xs text-[#9c9386] font-serif italic tracking-wider">
                      A Royal Chronicle
                    </span>
                  </header>

                  {/* Narrative Body */}
                  <div className="my-auto py-6 max-w-[460px] mx-auto w-full">
                    <div className="text-center mb-6">
                      <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.3em] uppercase text-[#968977] block mb-1">
                        Morning Reflections
                      </span>
                      <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#262422] tracking-tight font-medium">
                        Morning in the Pink City
                      </h1>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="h-px w-6 bg-[#cfc5b4]" />
                        <SvgSparkle size={12} className="text-[#a19582]" />
                        <span className="h-px w-6 bg-[#cfc5b4]" />
                      </div>
                    </div>

                    <div className="font-serif text-[#322f2b] text-[15px] sm:text-[17px] leading-[1.8] space-y-4">
                      <p className="text-justify">
                        <span className="float-left text-4xl sm:text-5xl leading-[0.8] pr-2.5 pt-1 font-serif font-semibold text-[#83262e]">
                          B
                        </span>
                        efore the bazaars of Johari awakened with their brilliant displays of beaten silver and uncut emeralds, dawn cast an ember radiance over the terracotta battlements. The morning air carried the scent of crushed marigolds, cardamom seeds, and woodsmoke from courtyard fires, settling gently against the latticed sandstone arches.
                      </p>
                      <p className="text-justify text-[#47433e]">
                        To wander through these quiet colonnades at sunrise is to encounter a memory preserved in stone. Every jharokha window whispered secrets of courtly retinues, capturing the desert breeze that has traveled across Rajasthan for two hundred seasons.
                      </p>
                    </div>

                    <div className="mt-6 text-center text-[#ab9e8b] flex items-center justify-center gap-3">
                      <span className="h-px w-10 bg-[#e3dcd1]" />
                      <SvgFlourish size={16} className="text-[#ab9e8b]" />
                      <span className="h-px w-10 bg-[#e3dcd1]" />
                    </div>
                  </div>

                  {/* Running Footer */}
                  <footer className="pt-4 border-t border-[#e5dfd3]/80 flex justify-between items-center text-xs font-serif text-[#736c61]">
                    <span className="tracking-wide">Storybound Private Press</span>
                    <span className="font-semibold text-sm">{pageNumLeft}</span>
                  </footer>
                </article>

                {/* ================= RIGHT PAGE: EDITORIAL PHOTOGRAPH ================= */}
                <article className="flex-1 paper-texture p-6 sm:p-8 md:p-12 lg:p-14 relative flex flex-col justify-between min-h-[460px] sm:min-h-[520px]">
                  {/* Gold Corner Accents */}
                  <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#bda682]/70 pointer-events-none" />
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#bda682]/70 pointer-events-none" />

                  {/* Spine Shadow Overlay for Right Gutter */}
                  <div className="absolute top-0 left-0 w-12 h-full gutter-spine-gradient-right pointer-events-none z-20" />

                  {/* Running Header */}
                  <header className="flex items-center justify-between pb-4 border-b border-[#e5dfd3]/80">
                    <span className="text-xs text-[#9c9386] font-serif italic tracking-wider">
                      Hawa Mahal · Palace of Winds
                    </span>
                    <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.22em] text-[#827a6f] uppercase">
                      PLATE NO. 08
                    </span>
                  </header>

                  {/* Photograph Frame */}
                  <div className="my-auto py-4 flex flex-col items-center">
                    <div className="relative w-full max-w-[420px] p-2 sm:p-2.5 bg-[#f8f5ee] rounded border border-[#dcd6c8] shadow-sm">
                      <div className="overflow-hidden rounded relative aspect-[4/3]">
                        {/* Hawa Mahal golden hour photograph from Stitch */}
                        <img
                          alt="Majestic golden hour photograph of Hawa Mahal Palace of Winds in Jaipur, India"
                          className="w-full h-full object-cover filter contrast-[1.03] saturate-[1.08] hover:scale-[1.02] transition-transform duration-700 ease-out"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPPeqYeCMigBWahxqaSlsuyxKI5gxubGfVA0b-HhL0qi2FX4noduTVEz8clMJWsDQ67-pn5SA6dcCyZ0nx3qKWXLdww7XyWE-FR5z6ap2HNv57piSM3bKCz_NtBBnx942-R95cQAVHkDwnBrgLadvsXMDsbgv7N-16bT2LtmU6xZLXJuxTiRK-AnILGRr9CHPH5egD-KPvxPNPl-EjvYcaX02AVhrsGx72fuZF9X7ZSr1QBn3M6QGf"
                        />
                        <div className="absolute inset-0 border border-black/10 pointer-events-none" />
                      </div>
                    </div>

                    <div className="mt-4 text-center max-w-[380px]">
                      <span className="font-serif text-[14px] sm:text-[15px] font-medium text-[#292724] tracking-tight block">
                        The Honeycomb Crown of Badi Choupad
                      </span>
                      <p className="font-serif italic text-xs sm:text-sm text-[#666055] mt-1 leading-relaxed">
                        Constructed in 1799 by Maharaja Sawai Pratap Singh. Its 953 casements allowed royal court members to observe festival processions unseen from behind ornate stone jali screens.
                      </p>
                    </div>
                  </div>

                  {/* Running Footer */}
                  <footer className="pt-4 border-t border-[#e5dfd3]/80 flex justify-between items-center text-xs font-serif text-[#736c61]">
                    <span className="font-semibold text-sm">{pageNumRight}</span>
                    <span className="tracking-widest uppercase text-[10px] text-[#968e82]">Rajasthan Expedition</span>
                  </footer>

                  {/* Interactive Page Flip Corner Curl Fold */}
                  <div
                    onClick={handleNextSpread}
                    className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 cursor-pointer transition-all hover:w-12 hover:h-12 z-40"
                    title="Click to turn to next spread"
                    style={{
                      background: "linear-gradient(135deg, transparent 50%, #e2ded5 50%, #f4f0e6 65%, #c8c2b5 100%)",
                      boxShadow: "-3px -3px 7px rgba(0, 0, 0, 0.15)",
                      borderRadius: "4px 0 0 0",
                    }}
                  >
                    <SvgArrowRight size={10} className="absolute bottom-1.5 right-1.5 text-[#71695c]" />
                  </div>
                </article>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Bottom Control Bar */}
      <footer className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-auto max-w-[95vw]">
        <div className="bg-[#1f1e1c]/95 backdrop-blur-md border border-[#3b3833] rounded-full px-4 py-2 flex items-center gap-2 sm:gap-4 shadow-2xl text-[#d4cfc7]">
          {/* Spread Navigation */}
          <div className="flex items-center gap-1 border-r border-[#383530] pr-2 sm:pr-3">
            <button
              onClick={handlePrevSpread}
              disabled={currentSpreadIndex <= 1}
              aria-label="Previous Spread"
              className="p-1.5 hover:bg-[#32302a] hover:text-white rounded-full transition-colors disabled:opacity-30"
              title="Previous Spread"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span className="font-mono text-xs font-medium px-2 text-[#efebe4] whitespace-nowrap">
              {viewMode === "cover" ? "Cover View" : `Pages ${pageNumLeft}–${pageNumRight} of 20`}
            </span>

            <button
              onClick={handleNextSpread}
              disabled={currentSpreadIndex >= totalSpreads}
              aria-label="Next Spread"
              className="p-1.5 hover:bg-[#32302a] hover:text-white rounded-full transition-colors disabled:opacity-30"
              title="Next Spread"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* View Mode Toggles */}
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

          {/* Zoom Controls */}
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
