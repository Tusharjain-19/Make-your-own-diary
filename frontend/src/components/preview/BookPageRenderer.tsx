"use client";

import * as React from "react";
import { PageData, El } from "@/lib/editor/types";

interface BookPageRendererProps {
  page?: PageData | null;
  pageNumber: number;
  isLeftPage?: boolean;
  showWatermark?: boolean;
  className?: string;
  bookTitle?: string;
}

export function BookPageRenderer({
  page,
  pageNumber,
  isLeftPage = false,
  showWatermark = false,
  className = "",
  bookTitle = "Storybound Diary",
}: BookPageRendererProps) {
  const elements = page?.elements || [];
  const bg = page?.bg || "#FAF8F5";

  // Base mm dimensions for A5 page
  const pageWmm = 148;
  const pageHmm = 210;

  return (
    <article
      className={`relative w-full aspect-[148/210] overflow-hidden select-none flex flex-col justify-between p-6 sm:p-8 md:p-10 transition-colors shadow-xs ${className}`}
      style={{
        backgroundColor: bg,
        containerType: "inline-size",
      }}
    >
      {/* Subtle paper grain texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(#1a1c1b 1px, transparent 1px), radial-gradient(#1a1c1b 1px, #FAF8F5 1px)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 10px 10px",
        }}
      />

      {/* Book Spine Valley Shadow on Binding Gutter */}
      {isLeftPage ? (
        <div className="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-black/20 via-black/5 to-transparent z-20" />
      ) : (
        <div className="pointer-events-none absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-black/20 via-black/5 to-transparent z-20" />
      )}

      {/* Draft Watermark Layer */}
      {showWatermark && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center select-none rotate-[-25deg] opacity-[0.07]"
        >
          <div className="text-center">
            <span className="font-serif text-3xl sm:text-4xl font-extrabold tracking-[0.25em] text-[#1a1c1b] block">
              STORYBOUND
            </span>
            <span className="font-mono text-xs tracking-widest text-[#1a1c1b] uppercase">
              Draft Watermark Preview
            </span>
          </div>
        </div>
      )}

      {/* Running Header */}
      <header className="relative z-10 flex items-center justify-between pb-3 border-b border-[#1a1c1b]/10 text-[10px] font-mono text-[#747878] tracking-wider uppercase">
        <span className="truncate max-w-[140px]">{isLeftPage ? bookTitle : `Page ${pageNumber}`}</span>
        <span className="italic font-serif normal-case text-[#9aa0a6] truncate max-w-[140px]">
          {isLeftPage ? "Travel Chronicle" : bookTitle}
        </span>
      </header>

      {/* Dynamic Elements Canvas Layer */}
      <div className="relative flex-1 w-full h-full my-auto overflow-hidden">
        {elements.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center text-center">
            <span className="font-serif italic text-xs text-[#747878]/50">
              — Clean Page {pageNumber} —
            </span>
          </div>
        ) : (
          elements.map((el: El) => {
            // Convert mm coordinates into percentage of page
            const leftPct = (el.x / pageWmm) * 100;
            const topPct = (el.y / pageHmm) * 100;
            const widthPct = (el.w / pageWmm) * 100;
            const heightPct = (el.h / pageHmm) * 100;

            const baseStyle: React.CSSProperties = {
              position: "absolute",
              left: `${leftPct}%`,
              top: `${topPct}%`,
              width: `${widthPct}%`,
              height: `${heightPct}%`,
              transform: el.rot ? `rotate(${el.rot}deg)` : undefined,
              transformOrigin: "center center",
              opacity: el.opacity ?? 1,
              zIndex: el.z || 10,
            };

            if (el.type === "text") {
              // 1 pt = 0.3528 mm; in % of page width (148 mm): (size * 0.3528 / 148) * 100 cqw
              const fontCqw = (el.size || 16) * 0.23838;
              return (
                <div
                  key={el.id}
                  style={{
                    ...baseStyle,
                    fontFamily: el.font ? `"${el.font}", cursive, serif, sans-serif` : "Inter, sans-serif",
                    fontSize: `${fontCqw}cqw`,
                    color: el.color || "#1A1C1B",
                    fontWeight: el.weight || 400,
                    fontStyle: el.italic ? "italic" : "normal",
                    textDecoration: el.underline ? "underline" : undefined,
                    textAlign: el.align || "left",
                    lineHeight: el.lineHeight || 1.4,
                    letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : undefined,
                    textRendering: "optimizeLegibility",
                    WebkitFontSmoothing: "antialiased",
                    MozOsxFontSmoothing: "grayscale",
                  }}
                  className="whitespace-pre-wrap break-words"
                >
                  {el.text}
                </div>
              );
            }

            if (el.type === "image") {
              const isPolaroid = el.frame === "polaroid";
              return (
                <div
                  key={el.id}
                  style={baseStyle}
                  className={`overflow-hidden rounded-xs ${
                    isPolaroid
                      ? "bg-white p-2 pb-6 shadow-md border border-black/10"
                      : "shadow-xs border border-black/10"
                  }`}
                >
                  <img
                    src={el.src}
                    alt="Book visual element"
                    className="w-full h-full object-cover"
                    style={{
                      borderWidth: el.border?.w ? `${el.border.w}px` : undefined,
                      borderColor: el.border?.color,
                      imageRendering: "auto",
                    }}
                  />
                </div>
              );
            }

            if (el.type === "shape") {
              if (el.shape === "emoji-sticker") {
                return (
                  <div
                    key={el.id}
                    style={baseStyle}
                    className="flex items-center justify-center text-2xl select-none"
                  >
                    {el.emoji || "✨"}
                  </div>
                );
              }

              return (
                <div
                  key={el.id}
                  style={{
                    ...baseStyle,
                    backgroundColor: el.fill || "transparent",
                    borderColor: el.stroke || "#1A1C1B",
                    borderWidth: el.strokeW ? `${el.strokeW}px` : 0,
                    borderRadius: el.shape === "circle" ? "9999px" : "2px",
                  }}
                />
              );
            }

            return null;
          })
        )}
      </div>

      {/* Running Footer */}
      <footer className="relative z-10 flex items-center justify-between pt-3 border-t border-[#1a1c1b]/10 text-[10px] font-mono text-[#747878]">
        <span>Storybound Private Press</span>
        <span className="font-semibold text-xs text-[#1a1c1b]">{pageNumber}</span>
      </footer>
    </article>
  );
}
