"use client";

import * as React from "react";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  iconOnly?: boolean;
  href?: string | null;
  className?: string;
  tagline?: string;
  variant?: "default" | "light" | "monochrome";
}

export function StoryboundLogo({
  size = "md",
  showText = true,
  iconOnly = false,
  href = "/",
  className = "",
  tagline,
  variant = "default",
}: LogoProps) {
  const shouldShowText = showText && !iconOnly;
  const iconDimensions = {
    sm: "h-7 w-7",
    md: "h-8 w-8",
    lg: "h-11 w-11",
  }[size];

  const textSize = {
    sm: "text-base",
    md: "text-lg sm:text-xl",
    lg: "text-2xl sm:text-3xl",
  }[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Editorial Open Book Emblem with Bookmark Ribbon */}
      <div
        className={`relative flex items-center justify-center rounded-[8px] bg-[#1a1c1b] text-white shadow-sm transition-transform group-hover:scale-105 shrink-0 ${iconDimensions}`}
      >
        <svg
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-[70%] w-[70%]"
        >
          {/* Left Book Page */}
          <path
            d="M5 6C9 6 12 7.5 13.5 9.5V23C12 21 9 19.5 5 19.5V6Z"
            fill="#F4F4F2"
            stroke="#1A1C1B"
            strokeWidth="0.8"
          />
          {/* Right Book Page */}
          <path
            d="M23 6C19 6 16 7.5 14.5 9.5V23C16 21 19 19.5 23 19.5V6Z"
            fill="#FFFFFF"
            stroke="#1A1C1B"
            strokeWidth="0.8"
          />
          {/* Book Spine Center Line */}
          <line
            x1="14"
            y1="9.5"
            x2="14"
            y2="23.5"
            stroke="#B8A88A"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Foil Accent Lines on Left Page */}
          <line x1="7.5" y1="10.5" x2="11" y2="10.5" stroke="#B8A88A" strokeWidth="0.75" strokeLinecap="round" />
          <line x1="7.5" y1="13" x2="11.5" y2="13" stroke="#B8A88A" strokeWidth="0.75" strokeLinecap="round" />
          <line x1="7.5" y1="15.5" x2="10" y2="15.5" stroke="#B8A88A" strokeWidth="0.75" strokeLinecap="round" />
          {/* Foil Accent Lines on Right Page */}
          <line x1="16.5" y1="10.5" x2="20.5" y2="10.5" stroke="#B8A88A" strokeWidth="0.75" strokeLinecap="round" />
          <line x1="16.5" y1="13" x2="20" y2="13" stroke="#B8A88A" strokeWidth="0.75" strokeLinecap="round" />
          <line x1="16.5" y1="15.5" x2="19" y2="15.5" stroke="#B8A88A" strokeWidth="0.75" strokeLinecap="round" />
          {/* Red/Gold Bookmark Ribbon Hanging Down */}
          <path
            d="M14 6V11.5L15 10.5L16 11.5V6H14Z"
            fill="#C9A66B"
          />
        </svg>
      </div>

      {shouldShowText && (
        <div className="flex flex-col">
          <span
            className={`font-serif font-semibold tracking-tight leading-none ${
              variant === "light" ? "text-white" : "text-[#1a1c1b]"
            } ${textSize}`}
          >
            Storybound
          </span>
          {tagline && (
            <span
              className={`font-mono text-[9px] uppercase tracking-wider mt-0.5 ${
                variant === "light" ? "text-white/60" : "text-text-muted"
              }`}
            >
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="Storybound Home">
        {content}
      </Link>
    );
  }

  return content;
}
