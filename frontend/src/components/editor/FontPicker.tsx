"use client";

import * as React from "react";
import { Search, ChevronDown, Check, PenTool } from "lucide-react";
import { FONTS, FontDefinition } from "@/lib/editor/fonts";

interface FontPickerProps {
  currentFont: string;
  onSelectFont: (fontName: string) => void;
  className?: string;
}

export function FontPicker({ currentFont, onSelectFont, className = "" }: FontPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const pickerRef = React.useRef<HTMLDivElement | null>(null);

  // Close when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const categories = ["All", "Handwriting", "Serif Display", "Serif Body", "Sans", "Display", "Typewriter"];

  const filteredFonts = React.useMemo(() => {
    return FONTS.filter((f) => {
      const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" ||
        (selectedCategory === "Serif" && (f.category === "Serif Display" || f.category === "Serif Body")) ||
        f.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {/* Current Selection Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-full items-center justify-between rounded-[6px] border border-border bg-surface px-2.5 text-xs text-text hover:bg-accent-soft/40 transition-colors focus:outline-none focus:ring-1 focus:ring-accent"
        title="Change Font Family"
      >
        <span
          className="truncate text-sm font-medium"
          style={{ fontFamily: currentFont }}
        >
          {currentFont || "Inter"}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-text-muted shrink-0 ml-1.5" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-72 rounded-[10px] border border-border bg-surface p-2 shadow-card backdrop-blur-md animate-in fade-in-50 zoom-in-95">
          {/* Search Box */}
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search 20 fonts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-[6px] border border-border bg-bg pl-8 pr-2.5 py-1.5 text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
              autoFocus
            />
          </div>

          {/* Category Chips */}
          <div className="flex gap-1 overflow-x-auto pb-1.5 mb-1.5 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-accent text-white"
                    : "bg-accent-soft/60 text-text-muted hover:text-text"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Font List with Previews */}
          <div className="max-h-60 overflow-y-auto space-y-0.5 pr-1">
            {filteredFonts.length === 0 ? (
              <div className="py-4 text-center text-xs text-text-muted">No fonts found</div>
            ) : (
              filteredFonts.map((font) => {
                const isSelected = font.name === currentFont;
                const isHandwriting = font.category === "Handwriting";

                return (
                  <button
                    key={font.name}
                    type="button"
                    onClick={() => {
                      onSelectFont(font.name);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-[6px] px-2.5 py-2 text-left transition-colors ${
                      isSelected
                        ? "bg-accent-soft text-accent font-semibold"
                        : "hover:bg-accent-soft/50 text-text"
                    }`}
                  >
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        {isHandwriting && <PenTool className="h-3 w-3 text-accent shrink-0" />}
                        <span
                          className="truncate text-base"
                          style={{ fontFamily: font.name }}
                        >
                          {font.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-text-muted truncate mt-0.5">
                        {font.category} · {font.sampleText || "The quick brown fox"}
                      </span>
                    </div>

                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-accent shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
