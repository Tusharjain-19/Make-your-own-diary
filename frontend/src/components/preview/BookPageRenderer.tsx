"use client";

import * as React from "react";
import { PageData, El } from "@/lib/editor/types";

interface BookPageRendererProps {
  page?: PageData | null;
  pageNumber: number;
  width?: number; // width in px
  aspectRatio?: number; // default A5 aspect ratio (148 / 210 = 0.7047)
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
      className={`relative w-full aspect-[148/210] overflow-hidden select-none flex flex-col justify-between p-6 sm:p-8 md:p-10 transition-colors shadow-sm ${className}`}
      style={{ backgroundColor: bg }}
    >
      {/* Subtle paper grain texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(#111 1px, transparent 1px), radial-gradient(#111 1px, #FAF8F5 1px)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 10px 10px",
        }}
      />

      {/* Book Spine Shadow / Gutter Gradients */}
      {isLeftPage ? (
        <div className="pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-black/15 to-transparent z-20" />
      ) : (
        <div className="pointer-events-none absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-black/15 to-transparent z-20" />
      )}

      {/* Draft Watermark Layer */}
      {showWatermark && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center select-none rotate-[-25deg] opacity-[0.08]"
        >
          <div className="text-center">
            <span className="font-serif text-3xl sm:text-4xl font-extrabold tracking-[0.25em] text-black block">
              STORYBOUND
            </span>
            <span className="font-mono text-xs tracking-widest text-black uppercase">
              Draft Watermark Preview
            </span>
          </div>
        </div>
      )}

      {/* Running Header */}
      <header className="relative z-10 flex items-center justify-between pb-3 border-b border-black/10 text-[10px] font-mono text-neutral-500 tracking-wider uppercase">
        <span>{isLeftPage ? bookTitle : `Page ${pageNumber}`}</span>
        <span className="italic font-serif normal-case text-neutral-400">
          {isLeftPage ? "Travel Chronicle" : bookTitle}
        </span>
      </header>

      {/* Dynamic Elements Layer (positioned via percentage coordinates derived from mm) */}
      <div className="relative flex-1 w-full h-full my-auto overflow-hidden">
        {elements.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center text-center text-xs text-neutral-400 italic">
            Blank Page
          </div>
        ) : (
          elements.map((el: El) => {
            // Convert mm position to percentage of page
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
              const fontSizeEm = (el.size || 16) / 16;
              return (
                <div
                  key={el.id}
                  style={{
                    ...baseStyle,
                    fontFamily: el.font ? `"${el.font}", cursive, sans-serif` : "Inter, sans-serif",
                    fontSize: `calc(${fontSizeEm} * 1.1vw + 4px)`,
                    color: el.color || "#1A1A1A",
                    fontWeight: el.weight || 400,
                    fontStyle: el.italic ? "italic" : "normal",
                    textDecoration: el.underline ? "underline" : undefined,
                    textAlign: el.align || "left",
                    lineHeight: el.lineHeight || 1.4,
                    letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : undefined,
                  }}
                  className="whitespace-pre-wrap break-words"
                >
                  {el.text}
                </div>
              );
            }

            if (el.type === "image") {
              return (
                <div
                  key={el.id}
                  style={baseStyle}
                  className="overflow-hidden rounded-sm border border-black/10 shadow-sm"
                >
                  <img
                    src={el.src}
                    alt="Book visual element"
                    className="w-full h-full object-cover"
                    style={{
                      borderWidth: el.border?.w ? `${el.border.w}px` : undefined,
                      borderColor: el.border?.color,
                    }}
                  />
                </div>
              );
            }

            if (el.type === "shape") {
              return (
                <div
                  key={el.id}
                  style={{
                    ...baseStyle,
                    backgroundColor: el.fill || "transparent",
                    borderColor: el.stroke || "#1A1A1A",
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
      <footer className="relative z-10 flex items-center justify-between pt-3 border-t border-black/10 text-[10px] font-mono text-neutral-500">
        <span>Storybound Private Press</span>
        <span className="font-semibold text-xs text-neutral-800">{pageNumber}</span>
      </footer>
    </article>
  );
}
