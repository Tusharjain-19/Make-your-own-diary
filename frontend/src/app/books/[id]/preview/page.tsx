"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEditorStore, createSampleCoverElements } from "@/lib/editor/store";
import { useAuth } from "@/lib/auth/auth-context";
import { loadBookFromIndexedDB } from "@/lib/storage/indexeddb";
import { PageSize, El, PageData } from "@/lib/editor/types";
import { BookPageRenderer } from "@/components/preview/BookPageRenderer";
import { pageTurnAudio } from "@/lib/audio/page-turn-sound";
import { SvgClose, SvgArrowRight } from "@/components/ui/website-icons";
import { Volume2, VolumeX, BookOpen, ArrowLeft, Package } from "lucide-react";

export default function BookPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = (params?.id as string) || "book-jaipur-101";

  const { getBookById, getBookPages } = useAuth();
  const { book, setBook } = useEditorStore();

  const [currentSpreadIndex, setCurrentSpreadIndex] = React.useState(1); // Spread 1 = pages 2-3
  const [viewMode, setViewMode] = React.useState<"spread" | "cover">("spread");
  const [zoomLevel, setZoomLevel] = React.useState(100);
  const [showWatermark, setShowWatermark] = React.useState(true);
  const [bannerDismissed, setBannerDismissed] = React.useState(false);
  const [soundEnabled, setSoundEnabled] = React.useState(true);

  // 3D Leaf Turn Animation State
  const [isFlipping, setIsFlipping] = React.useState(false);
  const [flipDirection, setFlipDirection] = React.useState<"next" | "prev" | null>(null);

  // Initialize book from localStorage / store / IndexedDB if not loaded
  React.useEffect(() => {
    if (!book || book.id !== bookId) {
      const rawBook = getBookById(bookId);
      const rawPages = getBookPages(bookId);

      if (rawBook && rawPages && rawPages.length > 0) {
        const fullPages: PageData[] = rawPages.map((rp, idx) => {
          let elements: El[] = (rp.data?.elements || []) as El[];
          if (
            idx === 0 &&
            (elements.length === 0 ||
              elements.some((e) => e.id === "cover-title-1" && !elements.some((x) => x.id === "cover-badge-1")))
          ) {
            elements = createSampleCoverElements({
              title: rawBook.title,
              subtitle: rawBook.subtitle,
              author: rawBook.author,
              dates: rawBook.dates,
            });
          }
          return {
            id: rp.id,
            position: rp.position || idx + 1,
            bg: rp.data?.bg || "#FAF8F5",
            layoutId: rp.data?.layoutId,
            elements,
          };
        });

        setBook({
          id: rawBook.id,
          title: rawBook.title,
          subtitle: rawBook.subtitle,
          author: rawBook.author,
          dates: rawBook.dates,
          size: (rawBook.size as PageSize) || "A5",
          themeId: rawBook.themeId || "warm-editorial",
          status: (rawBook.status as "draft" | "exported" | "ordered") || "draft",
          pages: fullPages,
        });
      } else {
        loadBookFromIndexedDB(bookId).then((idbBook) => {
          if (idbBook) setBook(idbBook);
        });
      }
    }
  }, [bookId, book, getBookById, getBookPages, setBook]);

  // Auto-on audio: enable audio and unlock Web Audio context on user's first gesture
  React.useEffect(() => {
    pageTurnAudio.enabled = soundEnabled;
    const unlockAudio = () => {
      pageTurnAudio.play();
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, [soundEnabled]);

  const title = book?.title || "Jaipur: A City of Royal Memories";
  const author = book?.author || "Tushar";
  const pages = book?.pages || [];
  const totalPages = Math.max(20, pages.length);
  const totalSpreads = Math.ceil((totalPages - 1) / 2); // Exclude cover

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

  // Active spread page numbers & user data (1-indexed)
  const leftPageNum = currentSpreadIndex * 2;
  const rightPageNum = currentSpreadIndex * 2 + 1;
  const leftPageData = pages[leftPageNum - 1] || null;
  const rightPageData = pages[rightPageNum - 1] || null;

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#f9f9f7] text-[#1a1c1b] antialiased select-none font-sans">
      {/* Top Notification Banner (Warm Editorial Stationery) */}
      {!bannerDismissed && (
        <aside className="w-full bg-[#eeeeec] border-b border-[#e2e3e1] text-[#444748] px-4 py-1.5 flex items-center justify-between text-xs z-50 shrink-0">
          <div className="flex items-center gap-2 mx-auto">
            <span className="flex h-2 w-2 rounded-full bg-[#6a5d43] animate-pulse" />
            <span className="font-mono text-[11px] tracking-wide text-[#1a1c1b]">
              Interactive Hardcover Spread · Real Canvas Content · Spatial Sound Enabled
            </span>
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            aria-label="Dismiss banner"
            className="text-[#747878] hover:text-[#1a1c1b] transition-colors p-1 rounded"
          >
            <SvgClose size={12} />
          </button>
        </aside>
      )}

      {/* Top Header (Warm Editorial Stationery Light Mode) */}
      <header className="bg-white/95 border-b border-[#e2e3e1] flex justify-between items-center w-full px-4 sm:px-6 h-14 z-40 shrink-0 shadow-xs backdrop-blur-md">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link
            href={`/books/${bookId}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e2e3e1] bg-white hover:bg-[#f4f4f2] text-[#1a1c1b] text-xs font-medium transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Editor</span>
          </Link>

          <div className="h-4 w-px bg-[#e2e3e1] hidden sm:block" />

          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#6a5d43]" />
            <span className="font-serif text-base sm:text-lg font-semibold tracking-tight text-[#1a1c1b] line-clamp-1">
              {title}
            </span>
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#f4f4f2] text-[#747878] border border-[#e2e3e1]">
              Hardcover Spec · 300 DPI
            </span>
          </div>
        </div>

        {/* Center: Controls for Watermark & Sound */}
        <div className="hidden lg:flex items-center gap-4 text-xs text-[#444748]">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#1a1c1b] transition-colors">
            <input
              type="checkbox"
              checked={showWatermark}
              onChange={(e) => setShowWatermark(e.target.checked)}
              className="rounded border-[#c4c7c7] text-[#000000] focus:ring-0 w-3.5 h-3.5"
            />
            <span className="font-mono text-[11px]">Draft Watermark</span>
          </label>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#e2e3e1] bg-[#f4f4f2] text-[#1a1c1b] hover:bg-[#eeeeec] transition-colors text-[11px] font-mono shadow-2xs"
            title={soundEnabled ? "Mute page turn sound" : "Enable page turn sound"}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="h-3.5 w-3.5 text-emerald-700" />
                <span>Page Sound: On</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3.5 w-3.5 text-[#747878]" />
                <span>Page Sound: Off</span>
              </>
            )}
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => router.push(`/books/${bookId}/order`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#9e3d48] hover:bg-[#832d36] text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Order Hardcover Print</span>
          </button>

          <button
            onClick={() => router.push(`/books/${bookId}/checkout`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#000000] hover:bg-[#2f3130] text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download PDF · ₹50</span>
          </button>
        </div>
      </header>

      {/* Main 3D Book Stage (Warm Light Studio Aesthetic) */}
      <main
        className="flex-1 flex flex-col justify-center items-center p-3 sm:p-6 md:p-8 lg:p-10 relative overflow-hidden"
        style={{
          perspective: "2400px",
          background: "radial-gradient(circle at 50% 35%, #ffffff 0%, #f9f9f7 60%, #eeeeec 100%)",
        }}
      >
        {/* Physical Book Wrapper with 3D Depth */}
        <div
          className="relative w-full max-w-5xl flex items-center justify-center my-auto transition-transform duration-300"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* ================= CLOSED HARDCOVER COVER VIEW (EXACT USER COVER DESIGN FROM EDITOR) ================= */}
          {viewMode === "cover" && (
            <div
              className={`relative w-80 sm:w-[380px] md:w-[420px] aspect-[148/210] rounded-r-2xl rounded-l-sm shadow-[0_35px_80px_-15px_rgba(26,28,27,0.4),0_15px_30px_rgba(26,28,27,0.22)] border border-[#d8d1c2] cursor-pointer transition-all duration-700 hover:scale-[1.015] group overflow-visible ${
                isFlipping ? "rotate-y-[-70deg] opacity-75" : "rotate-y-0 opacity-100"
              }`}
              onClick={handleNext}
              title="Click to open book"
              style={{
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Outer Hardcover Casing Boards */}
              <div
                className="absolute -inset-2.5 sm:-inset-3.5 bg-[#2c1d1a] rounded-r-2xl rounded-l-sm shadow-2xl -z-10 border border-[#48312c]"
                style={{
                  backgroundImage:
                    "radial-gradient(#3d2824 15%, transparent 16%), radial-gradient(#3d2824 15%, transparent 16%)",
                  backgroundSize: "6px 6px",
                  backgroundPosition: "0 0, 3px 3px",
                }}
              >
                <div className="absolute inset-1.5 border border-[#c4a468]/30 rounded-r-xl rounded-l-xs pointer-events-none" />
              </div>

              {/* Silk bookmark ribbon hanging out */}
              <div className="absolute -top-4 left-10 w-4 h-10 bg-[#8c1c24] rounded-t-sm shadow-md border-x border-[#590e14] z-40" />
              <div className="absolute -bottom-6 left-12 w-3.5 h-12 bg-[#8c1c24] rounded-b-sm shadow-lg border-x border-[#590e14] z-40 transform rotate-3" />

              {/* Spine edge fold & crease along left binding */}
              <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-black/30 via-black/10 to-transparent z-30 pointer-events-none rounded-l-sm" />
              <div className="absolute top-0 left-7 bottom-0 w-0.5 bg-black/20 z-30 pointer-events-none" />

              {/* The Actual Page 0 (Cover) from Editor */}
              <BookPageRenderer
                page={pages[0] || null}
                pageNumber={1}
                isCover={true}
                showWatermark={showWatermark}
                bookTitle={title}
                className="rounded-r-xl rounded-l-xs"
              />

              {/* Floating "Click to open book" guide */}
              <div className="absolute bottom-3 right-4 z-40 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 hover:bg-black/85 text-white text-[10px] font-mono tracking-wider backdrop-blur pointer-events-none transition-all shadow-md">
                <span>Click to Open Book</span>
                <span className="text-xs">→</span>
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
              {/* Outer Hardcover Casing Boards */}
              <div
                className="absolute -inset-3 sm:-inset-4 bg-[#3a1317] rounded-2xl shadow-[0_35px_80px_-20px_rgba(26,28,27,0.35),0_15px_30px_rgba(26,28,27,0.18)] border border-[#521b21]"
                style={{
                  backgroundImage:
                    "radial-gradient(#4d191f 15%, transparent 16%), radial-gradient(#4d191f 15%, transparent 16%)",
                  backgroundSize: "6px 6px",
                  backgroundPosition: "0 0, 3px 3px",
                }}
              >
                <div className="absolute inset-1.5 border border-[#a27b40]/30 rounded-xl pointer-events-none" />
              </div>

              {/* Realistic Stacked Paper Edge Block (showing book thickness ~200 pages) */}
              <div
                className="absolute -inset-y-1.5 -inset-x-1.5 bg-[#f5efe3] rounded-lg border border-[#cfc8b8] shadow-xs pointer-events-none"
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
                {/* Left Page (Exact User Content from Editor) */}
                <div className="flex-1 relative">
                  <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-black/20 via-black/5 to-transparent pointer-events-none z-30" />

                  <BookPageRenderer
                    page={leftPageData}
                    pageNumber={leftPageNum}
                    isLeftPage={true}
                    showWatermark={showWatermark}
                    bookTitle={title}
                  />

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

                {/* Right Page (Exact User Content from Editor) */}
                <div className="flex-1 relative border-t md:border-t-0 md:border-l border-[#e8e4db]">
                  <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none z-30" />

                  <BookPageRenderer
                    page={rightPageData}
                    pageNumber={rightPageNum}
                    isLeftPage={false}
                    showWatermark={showWatermark}
                    bookTitle={title}
                  />

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
                      boxShadow: "-15px 0 30px rgba(0,0,0,0.25)",
                    }}
                  >
                    <div className="w-full h-full bg-[#fdfcf9] paper-texture border-l border-[#d8d1c2] flex items-center justify-center p-8">
                      <span className="font-serif italic text-xs text-[#747878]">Turning page...</span>
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
                      boxShadow: "15px 0 30px rgba(0,0,0,0.25)",
                    }}
                  >
                    <div className="w-full h-full bg-[#fdfcf9] paper-texture border-r border-[#d8d1c2] flex items-center justify-center p-8">
                      <span className="font-serif italic text-xs text-[#747878]">Turning page...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Bottom Navigation Controller (Warm Editorial Stationery Light Mode) */}
      <footer className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-auto max-w-[95vw]">
        <div className="bg-white/95 backdrop-blur-md border border-[#e2e3e1] rounded-full px-4 py-2 flex items-center gap-2 sm:gap-4 shadow-xl text-[#1a1c1b]">
          {/* Previous / Next buttons */}
          <div className="flex items-center gap-1 border-r border-[#e2e3e1] pr-2 sm:pr-3">
            <button
              onClick={handlePrev}
              disabled={viewMode === "cover" || isFlipping}
              aria-label="Previous Page"
              className="p-1.5 hover:bg-[#f4f4f2] text-[#1a1c1b] rounded-full transition-colors disabled:opacity-30"
              title="Previous Page (Left Arrow)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span className="font-mono text-xs font-medium px-2 text-[#1a1c1b] whitespace-nowrap">
              {viewMode === "cover" ? "Cover View" : `Pages ${leftPageNum}–${rightPageNum} of ${totalPages}`}
            </span>

            <button
              onClick={handleNext}
              disabled={(viewMode === "spread" && currentSpreadIndex >= totalSpreads) || isFlipping}
              aria-label="Next Page"
              className="p-1.5 hover:bg-[#f4f4f2] text-[#1a1c1b] rounded-full transition-colors disabled:opacity-30"
              title="Next Page (Right Arrow)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1 bg-[#f4f4f2] p-0.5 rounded-full border border-[#e2e3e1] text-xs">
            <button
              onClick={() => {
                if (viewMode !== "spread") {
                  pageTurnAudio.play();
                  setViewMode("spread");
                }
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                viewMode === "spread"
                  ? "bg-white text-[#1a1c1b] shadow-xs font-semibold"
                  : "text-[#747878] hover:text-[#1a1c1b]"
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
                  ? "bg-white text-[#1a1c1b] shadow-xs font-semibold"
                  : "text-[#747878] hover:text-[#1a1c1b]"
              }`}
            >
              Cover
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 hover:bg-[#f4f4f2] rounded-full text-[#444748] hover:text-[#1a1c1b] transition-colors"
            title={soundEnabled ? "Mute Sound" : "Enable Sound"}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-700" /> : <VolumeX className="h-4 w-4 text-[#747878]" />}
          </button>

          {/* Zoom */}
          <div className="hidden sm:flex items-center gap-1 border-l border-[#e2e3e1] pl-3">
            <button
              onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
              className="p-1 hover:bg-[#f4f4f2] text-[#444748] hover:text-[#1a1c1b] rounded-full transition-colors"
              title="Zoom Out"
            >
              −
            </button>
            <span className="font-mono text-[11px] text-[#747878] px-1 w-10 text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
              className="p-1 hover:bg-[#f4f4f2] text-[#444748] hover:text-[#1a1c1b] rounded-full transition-colors"
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
