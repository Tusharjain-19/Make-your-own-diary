"use client";

import * as React from "react";
import { Check, ChevronDown, Palette } from "lucide-react";
import { useEditorStore } from "@/lib/editor/store";
import { themes } from "@/lib/themes";

interface ColorPickerProps {
  color: string;
  onChange: (hex: string) => void;
  label?: string;
  className?: string;
}

const STORAGE_KEY = "storybound_recent_colors";
const DEFAULT_RECENTS = [
  "#1A1A1A",
  "#4A4A45",
  "#6B6B66",
  "#B8A88A",
  "#7A1F2B",
  "#2F5D50",
  "#FF6B5E",
  "#FFFFFF",
];

export function ColorPicker({ color, onChange, label, className = "" }: ColorPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hexInput, setHexInput] = React.useState(color || "#1A1A1A");
  const [recents, setRecents] = React.useState<string[]>(DEFAULT_RECENTS);
  const pickerRef = React.useRef<HTMLDivElement | null>(null);

  const { book } = useEditorStore();
  const currentTheme = themes.find((t) => t.id === book?.themeId) || themes[0];

  // Load recent colors from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setRecents(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    setHexInput(color || "#1A1A1A");
  }, [color]);

  const addRecent = (newColor: string) => {
    const formatted = newColor.toUpperCase();
    const updated = [formatted, ...recents.filter((c) => c !== formatted)].slice(0, 10);
    setRecents(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleHexSubmit = () => {
    let val = hexInput.trim();
    if (!val.startsWith("#")) val = `#${val}`;
    if (/^#[0-9A-Fa-f]{6}$/.test(val) || /^#[0-9A-Fa-f]{3}$/.test(val)) {
      onChange(val);
      addRecent(val);
    } else {
      setHexInput(color || "#1A1A1A");
    }
  };

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

  const themeColors = [
    { label: "Background", hex: currentTheme.palette.bg },
    { label: "Primary", hex: currentTheme.palette.primary },
    { label: "Accent", hex: currentTheme.palette.accent },
    { label: "Muted", hex: currentTheme.palette.muted },
    { label: "Text", hex: currentTheme.palette.text },
  ];

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-full items-center justify-between rounded-[6px] border border-border bg-surface px-2.5 text-xs text-text hover:bg-accent-soft/40 transition-colors focus:outline-none focus:ring-1 focus:ring-accent"
      >
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full border border-border/80 shadow-inner shrink-0"
            style={{ backgroundColor: color || "#1A1A1A" }}
          />
          <span className="font-mono text-xs uppercase">{color || "#1A1A1A"}</span>
          {label && <span className="text-[11px] text-text-muted">({label})</span>}
        </div>
        <ChevronDown className="h-3 w-3 text-text-muted shrink-0" />
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-64 rounded-[10px] border border-border bg-surface p-3 shadow-card backdrop-blur-md animate-in fade-in-50 zoom-in-95">
          {/* Native Picker & Hex Input */}
          <div className="flex items-center gap-2 mb-3">
            <input
              type="color"
              value={color?.startsWith("#") ? color : "#1A1A1A"}
              onChange={(e) => {
                setHexInput(e.target.value);
                onChange(e.target.value);
                addRecent(e.target.value);
              }}
              className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent shrink-0"
            />
            <div className="flex-1 relative">
              <input
                type="text"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                onBlur={handleHexSubmit}
                onKeyDown={(e) => e.key === "Enter" && handleHexSubmit()}
                placeholder="#1A1A1A"
                className="w-full rounded-[6px] border border-border bg-bg px-2 py-1 text-xs font-mono uppercase text-text focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          {/* Theme Palette Colors ("My Colors") */}
          <div className="mb-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1.5 flex items-center justify-between">
              <span>Theme Colors ({currentTheme.name})</span>
              <Palette className="h-3 w-3 text-accent" />
            </div>
            <div className="flex items-center gap-1.5">
              {themeColors.map((tc, idx) => (
                <button
                  key={`${tc.label}-${idx}`}
                  type="button"
                  title={`${tc.label}: ${tc.hex}`}
                  onClick={() => {
                    onChange(tc.hex);
                    addRecent(tc.hex);
                  }}
                  className="group relative h-6 w-6 rounded-full border border-border shadow-xs hover:scale-110 transition-transform flex items-center justify-center"
                  style={{ backgroundColor: tc.hex }}
                >
                  {color.toUpperCase() === tc.hex.toUpperCase() && (
                    <Check
                      className={`h-3 w-3 ${
                        tc.hex.toLowerCase() === "#ffffff" || tc.hex.toLowerCase() === "#fafaf8"
                          ? "text-black"
                          : "text-white"
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Colors */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">
              Recent Colors
            </div>
            <div className="grid grid-cols-8 gap-1">
              {recents.map((rc, idx) => (
                <button
                  key={`recent-${idx}-${rc}`}
                  type="button"
                  title={rc}
                  onClick={() => onChange(rc)}
                  className="h-5 w-5 rounded border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: rc }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
