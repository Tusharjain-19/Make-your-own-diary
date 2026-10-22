"use client";

import * as React from "react";
import { PageData, El, TextEl, ImageEl, ShapeEl, IconEl } from "@/lib/editor/types";

interface BookPageRendererProps {
  page?: PageData | null;
  pageNumber: number;
  isLeftPage?: boolean;
  isCover?: boolean;
  showWatermark?: boolean;
  className?: string;
  bookTitle?: string;
}

export function BookPageRenderer({
  page,
  pageNumber,
  isLeftPage = false,
  isCover = false,
  showWatermark = false,
  className = "",
  bookTitle = "Storybound Diary",
}: BookPageRendererProps) {
  const elements = page?.elements || [];
  const bg = page?.bg || (isCover ? "#FDFCF9" : "#FAF8F5");

  // Standard A5 page dimensions in mm
  const pageWmm = 148;
  const pageHmm = 210;

  return (
    <article
      className={`relative w-full aspect-[148/210] overflow-hidden select-none transition-colors ${className}`}
      style={{
        backgroundColor: bg,
        containerType: "inline-size",
      }}
    >
      {/* Subtle paper grain texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-multiply z-10"
        style={{
          backgroundImage:
            "radial-gradient(#1a1c1b 1px, transparent 1px), radial-gradient(#1a1c1b 1px, #FAF8F5 1px)",
          backgroundSize: "16px 16px",
          backgroundPosition: "0 0, 8px 8px",
        }}
      />

      {/* Book Spine Valley Shadow on Binding Gutter (Interior Pages Only) */}
      {!isCover && (
        isLeftPage ? (
          <div className="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-black/20 via-black/5 to-transparent z-25" />
        ) : (
          <div className="pointer-events-none absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-black/20 via-black/5 to-transparent z-25" />
        )
      )}

      {/* Draft Watermark Layer */}
      {showWatermark && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center select-none rotate-[-25deg] opacity-[0.06]"
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

      {/* Running Header (Interior Pages Only) */}
      {!isCover && (
        <header className="absolute top-4 left-6 right-6 z-20 flex items-center justify-between pb-1.5 border-b border-[#1a1c1b]/10 text-[9px] font-mono text-[#747878] tracking-wider uppercase pointer-events-none">
          <span className="truncate max-w-[140px]">{isLeftPage ? bookTitle : `Page ${pageNumber}`}</span>
          <span className="italic font-serif normal-case text-[#9aa0a6] truncate max-w-[140px]">
            {isLeftPage ? "Travel Chronicle" : bookTitle}
          </span>
        </header>
      )}

      {/* Canvas Elements Layer (Aligned 1:1 with Konva Canvas Coordinates 0mm -> 148mm, 0mm -> 210mm) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {elements.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center text-center">
            <span className="font-serif italic text-xs text-[#747878]/50">
              — {isCover ? "Blank Cover" : `Clean Page ${pageNumber}`} —
            </span>
          </div>
        ) : (
          elements.map((el: El) => {
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
              pointerEvents: "auto",
            };

            // 1. TEXT ELEMENT
            if (el.type === "text") {
              const textEl = el as TextEl;
              // 1 pt = 0.3528 mm; in % of page width (148 mm): (size * 0.3528 / 148) * 100 cqw
              const fontCqw = (textEl.size || 16) * 0.23838;
              const displayText = textEl.uppercase ? textEl.text.toUpperCase() : textEl.text;

              return (
                <div
                  key={el.id}
                  style={{
                    ...baseStyle,
                    fontFamily: textEl.font ? `"${textEl.font}", cursive, serif, sans-serif` : "Inter, sans-serif",
                    fontSize: `${fontCqw}cqw`,
                    color: textEl.color || "#1A1C1B",
                    fontWeight: textEl.weight || 400,
                    fontStyle: textEl.italic ? "italic" : "normal",
                    textDecoration: [
                      textEl.underline ? "underline" : "",
                      textEl.strikethrough ? "line-through" : "",
                    ].filter(Boolean).join(" ") || undefined,
                    textAlign: textEl.align || "left",
                    lineHeight: textEl.lineHeight || 1.3,
                    letterSpacing: textEl.letterSpacing ? `${textEl.letterSpacing * 0.25}cqw` : undefined,
                    backgroundColor: textEl.bgPill ? textEl.bgPill.color || "#FFFFFF" : undefined,
                    borderRadius: textEl.bgPill ? `${textEl.bgPill.radius || 4}px` : undefined,
                    padding: textEl.bgPill ? "4px 8px" : undefined,
                    textRendering: "optimizeLegibility",
                    WebkitFontSmoothing: "antialiased",
                    MozOsxFontSmoothing: "grayscale",
                  }}
                  className="whitespace-pre-wrap break-words"
                >
                  {displayText}
                </div>
              );
            }

            // 2. IMAGE ELEMENT
            if (el.type === "image") {
              const imgEl = el as ImageEl;
              const isPolaroid = imgEl.frame === "polaroid";

              return (
                <div
                  key={el.id}
                  style={baseStyle}
                  className={`overflow-hidden transition-transform ${
                    isPolaroid
                      ? "bg-white p-2 pb-5 sm:p-2.5 sm:pb-7 shadow-[0_4px_16px_rgba(0,0,0,0.14)] rounded-[2px] border border-black/8"
                      : "rounded-xs shadow-xs"
                  }`}
                >
                  <img
                    src={imgEl.src}
                    alt="Book photography element"
                    className="w-full h-full object-cover rounded-[1px]"
                    style={{
                      borderWidth: imgEl.border?.w ? `${imgEl.border.w}px` : undefined,
                      borderColor: imgEl.border?.color,
                      borderStyle: imgEl.border?.style || "solid",
                    }}
                  />
                </div>
              );
            }

            // 3. ICON ELEMENT
            if (el.type === "icon") {
              const iconEl = el as IconEl;
              const color = iconEl.color || "#7A1F2B";

              return (
                <div
                  key={el.id}
                  style={baseStyle}
                  className="flex items-center justify-center"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-full h-full"
                  >
                    {iconEl.iconId === "plane" && (
                      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" />
                    )}
                    {iconEl.iconId === "compass" && (
                      <>
                        <circle cx="12" cy="12" r="10" />
                        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} />
                      </>
                    )}
                    {iconEl.iconId === "pin" && (
                      <>
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </>
                    )}
                    {iconEl.iconId === "camera" && (
                      <>
                        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                        <circle cx="12" cy="13" r="3" />
                      </>
                    )}
                    {iconEl.iconId === "heart" && (
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill={color} />
                    )}
                    {!["plane", "compass", "pin", "camera", "heart"].includes(iconEl.iconId) && (
                      <circle cx="12" cy="12" r="9" />
                    )}
                  </svg>
                </div>
              );
            }

            // 4. SHAPE ELEMENT
            if (el.type === "shape") {
              const shapeEl = el as ShapeEl;

              // Decorative Washi Tape Sticker
              if (shapeEl.shape === "tape") {
                return (
                  <div
                    key={el.id}
                    style={{
                      ...baseStyle,
                      backgroundColor: shapeEl.fill || "rgba(220, 185, 120, 0.78)",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                      backgroundImage:
                        "linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 20%, rgba(0,0,0,0.05) 80%, rgba(255,255,255,0.2) 100%)",
                      clipPath:
                        "polygon(0% 10%, 2% 0%, 98% 0%, 100% 10%, 98% 100%, 2% 100%)",
                    }}
                  />
                );
              }

              // Vintage Wanderlust Travel Postmark Stamp
              if (shapeEl.shape === "stamp-wanderlust") {
                const strokeColor = shapeEl.stroke || "#7A1F2B";
                return (
                  <div
                    key={el.id}
                    style={baseStyle}
                    className="flex items-center justify-center select-none"
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ stroke: strokeColor, fill: "none" }}>
                      <circle cx="50" cy="50" r="46" strokeWidth="2.5" strokeDasharray="3 2" />
                      <circle cx="50" cy="50" r="38" strokeWidth="1.5" />
                      <path d="M15 50 Q 50 42, 85 50" strokeWidth="1.2" />
                      <path d="M15 58 Q 50 50, 85 58" strokeWidth="1.2" />
                      <text x="50" y="32" textAnchor="middle" fill={strokeColor} fontSize="9" fontWeight="700" letterSpacing="1.5" fontFamily="Space Grotesk, sans-serif">
                        WANDERLUST
                      </text>
                      <text x="50" y="74" textAnchor="middle" fill={strokeColor} fontSize="8" fontWeight="600" letterSpacing="1" fontFamily="Space Grotesk, sans-serif">
                        AIR MAIL · EXPEDITION
                      </text>
                    </svg>
                  </div>
                );
              }

              // Passport Entry Stamp
              if (shapeEl.shape === "stamp-passport") {
                const strokeColor = shapeEl.stroke || "#7A1F2B";
                return (
                  <div
                    key={el.id}
                    style={baseStyle}
                    className="flex items-center justify-center select-none"
                  >
                    <svg viewBox="0 0 120 70" className="w-full h-full" style={{ stroke: strokeColor, fill: "none" }}>
                      <rect x="4" y="4" width="112" height="62" rx="6" strokeWidth="2" strokeDasharray="5 3" />
                      <rect x="8" y="8" width="104" height="54" rx="4" strokeWidth="1" />
                      <text x="60" y="24" textAnchor="middle" fill={strokeColor} fontSize="8" fontWeight="700" letterSpacing="1.2" fontFamily="Space Grotesk, sans-serif">
                        IMMIGRATION & ENTRY
                      </text>
                      <text x="60" y="42" textAnchor="middle" fill={strokeColor} fontSize="12" fontWeight="800" letterSpacing="2" fontFamily="Space Grotesk, sans-serif">
                        APPROVED
                      </text>
                      <text x="60" y="54" textAnchor="middle" fill={strokeColor} fontSize="7" fontWeight="500" letterSpacing="1" fontFamily="Space Grotesk, sans-serif">
                        RAJASTHAN TOURISM · 2026
                      </text>
                    </svg>
                  </div>
                );
              }

              // Flourish Divider Rule
              if (shapeEl.shape === "divider-rule") {
                const strokeColor = shapeEl.stroke || "#B8A88A";
                return (
                  <div
                    key={el.id}
                    style={baseStyle}
                    className="flex items-center justify-center"
                  >
                    <div className="w-full flex items-center gap-2">
                      <div className="flex-1 h-px" style={{ backgroundColor: strokeColor }} />
                      <div className="h-1.5 w-1.5 rotate-45" style={{ backgroundColor: strokeColor }} />
                      <div className="flex-1 h-px" style={{ backgroundColor: strokeColor }} />
                    </div>
                  </div>
                );
              }

              // Cute Storybound Book Emblem
              if (shapeEl.shape === "cute-book") {
                const fillColor = shapeEl.fill || "#B8A88A";
                return (
                  <div
                    key={el.id}
                    style={baseStyle}
                    className="flex items-center justify-center"
                  >
                    <svg viewBox="0 0 24 24" fill={fillColor} className="w-full h-full opacity-90">
                      <path d="M19 2H6c-1.2 0-2 .8-2 2v16c0 1.2.8 2 2 2h13c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1zm-1 18H6c-.6 0-1-.4-1-1s.4-1 1-1h12v2zm0-4H6c-1.2 0-2 .8-2 2V4c0-.6.4-1 1-1h13v13z" />
                    </svg>
                  </div>
                );
              }

              // Heritage Archway
              if (shapeEl.shape === "arch") {
                const strokeColor = shapeEl.stroke || "#B8A88A";
                return (
                  <div
                    key={el.id}
                    style={baseStyle}
                    className="flex items-center justify-center"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" className="w-full h-full">
                      <path d="M4 21V9a8 8 0 0 1 16 0v12" />
                      <path d="M2 21h20" />
                      <path d="M8 21v-8a4 4 0 0 1 8 0v8" />
                    </svg>
                  </div>
                );
              }

              // Arrow and Curved Arrows
              if (shapeEl.shape.startsWith("arrow")) {
                const color = shapeEl.stroke || shapeEl.fill || "#1A1A1A";
                const strokeW = Math.max(1.5, (shapeEl.strokeW || 1) * 2);

                let pathD = "M 5 50 L 95 50";
                if (shapeEl.shape === "arrow-curved-arch") {
                  pathD = "M 5 95 Q 50 5 95 85";
                } else if (shapeEl.shape === "arrow-curved-up") {
                  pathD = "M 5 95 Q 50 15 95 5";
                } else if (shapeEl.shape === "arrow-curved-down") {
                  pathD = "M 5 5 Q 50 85 95 95";
                } else if (shapeEl.shape === "arrow-curved-left") {
                  pathD = "M 95 85 Q 60 5 5 35";
                } else if (shapeEl.shape === "arrow-s-curve") {
                  pathD = "M 0 85 C 35 10, 65 90, 100 15";
                }

                return (
                  <div key={el.id} style={baseStyle} className="pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" fill="none">
                      <defs>
                        <marker
                          id={`head-${el.id}`}
                          viewBox="0 0 10 10"
                          refX="5"
                          refY="5"
                          markerWidth="6"
                          markerHeight="6"
                          orient="auto-start-reverse"
                        >
                          <path d="M 0 1 L 10 5 L 0 9 z" fill={color} />
                        </marker>
                      </defs>
                      <path
                        d={pathD}
                        stroke={color}
                        strokeWidth={strokeW}
                        fill="none"
                        strokeLinecap="round"
                        markerEnd={`url(#head-${el.id})`}
                      />
                    </svg>
                  </div>
                );
              }

              // Emoji Sticker
              if (shapeEl.shape === "emoji-sticker") {
                return (
                  <div
                    key={el.id}
                    style={baseStyle}
                    className="flex items-center justify-center text-2xl select-none"
                  >
                    {shapeEl.emoji || "✨"}
                  </div>
                );
              }

              // Generic Shape (Circle, Rect)
              return (
                <div
                  key={el.id}
                  style={{
                    ...baseStyle,
                    backgroundColor: shapeEl.fill || "transparent",
                    borderColor: shapeEl.stroke || "#1A1C1B",
                    borderWidth: shapeEl.strokeW ? `${shapeEl.strokeW}px` : 0,
                    borderRadius: shapeEl.shape === "circle" ? "9999px" : "2px",
                  }}
                />
              );
            }

            return null;
          })
        )}
      </div>

      {/* Running Footer (Interior Pages Only) */}
      {!isCover && (
        <footer className="absolute bottom-4 left-6 right-6 z-20 flex items-center justify-between pt-1.5 border-t border-[#1a1c1b]/10 text-[9px] font-mono text-[#747878] pointer-events-none">
          <span>Storybound Private Press</span>
          <span className="font-semibold text-[10px] text-[#1a1c1b]">{pageNumber}</span>
        </footer>
      )}
    </article>
  );
}
