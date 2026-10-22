"use client";

import * as React from "react";
import { Check, ChevronDown, Copy, X, Palette, Search } from "lucide-react";
import { useEditorStore } from "@/lib/editor/store";
import { themes } from "@/lib/themes";
import {
  hsvToHex,
  hexToHsv,
  COLOR_NAMES,
  hsvToRgb,
  HSV,
} from "@/lib/editor/color-utils";

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
  "#B8A88A",
  "#7A1F2B",
  "#D4AF37",
  "#2F5D50",
  "#FF6B5E",
  "#FFFFFF",
];

export function ColorPicker({ color, onChange, label, className = "" }: ColorPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hsv, setHsv] = React.useState<HSV>(() => hexToHsv(color || "#1A1A1A"));
  const [hexInput, setHexInput] = React.useState(color || "#1A1A1A");
  const [copied, setCopied] = React.useState(false);
  const [recents, setRecents] = React.useState<string[]>(DEFAULT_RECENTS);

  const pickerRef = React.useRef<HTMLDivElement | null>(null);
  const satValRef = React.useRef<HTMLDivElement | null>(null);
  const hueRef = React.useRef<HTMLDivElement | null>(null);

  const isDraggingSatVal = React.useRef(false);
  const isDraggingHue = React.useRef(false);

  const { book } = useEditorStore();
  const currentTheme = themes.find((t) => t.id === book?.themeId) || themes[0];

  // Sync external color changes
  React.useEffect(() => {
    if (color) {
      setHsv(hexToHsv(color));
      setHexInput(color.toUpperCase());
    }
  }, [color]);

  // Load recent colors
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setRecents(JSON.parse(saved));
    } catch {}
  }, []);

  const addRecent = (hex: string) => {
    const formatted = hex.toUpperCase();
    const updated = [formatted, ...recents.filter((c) => c !== formatted)].slice(0, 10);
    setRecents(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Saturation / Value 2D Box Drag Handlers
  const updateSatValFromEvent = (clientX: number, clientY: number) => {
    if (!satValRef.current) return;
    const rect = satValRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

    const s = Math.round((x / rect.width) * 100);
    const v = Math.round((1 - y / rect.height) * 100);

    const newHsv = { ...hsv, s, v };
    setHsv(newHsv);
    const newHex = hsvToHex(newHsv.h, newHsv.s, newHsv.v);
    setHexInput(newHex);
    onChange(newHex);
  };

  const handleSatValPointerDown = (e: React.PointerEvent) => {
    isDraggingSatVal.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateSatValFromEvent(e.clientX, e.clientY);
  };

  const handleSatValPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingSatVal.current) return;
    updateSatValFromEvent(e.clientX, e.clientY);
  };

  const handleSatValPointerUp = (e: React.PointerEvent) => {
    if (isDraggingSatVal.current) {
      isDraggingSatVal.current = false;
      addRecent(hsvToHex(hsv.h, hsv.s, hsv.v));
    }
  };

  // Hue Slider Drag Handlers
  const updateHueFromEvent = (clientX: number) => {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const h = Math.round((x / rect.width) * 360) % 360;

    const newHsv = { ...hsv, h };
    setHsv(newHsv);
    const newHex = hsvToHex(newHsv.h, newHsv.s, newHsv.v);
    setHexInput(newHex);
    onChange(newHex);
  };

  const handleHuePointerDown = (e: React.PointerEvent) => {
    isDraggingHue.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateHueFromEvent(e.clientX);
  };

  const handleHuePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingHue.current) return;
    updateHueFromEvent(e.clientX);
  };

  const handleHuePointerUp = () => {
    if (isDraggingHue.current) {
      isDraggingHue.current = false;
      addRecent(hsvToHex(hsv.h, hsv.s, hsv.v));
    }
  };

  // Hex / Named Color Input Handler
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);

    // Check if color name (e.g. "maroon", "gold")
    const clean = val.trim().toLowerCase().replace(/^#/, "");
    if (COLOR_NAMES[clean]) {
      const targetHex = COLOR_NAMES[clean];
      setHsv(hexToHsv(targetHex));
      onChange(targetHex);
      addRecent(targetHex);
      return;
    }

    // Check if valid hex
    if (/^[0-9A-Fa-f]{6}$/.test(clean) || /^[0-9A-Fa-f]{3}$/.test(clean)) {
      const targetHex = `#${clean.toUpperCase()}`;
      setHsv(hexToHsv(targetHex));
      onChange(targetHex);
      addRecent(targetHex);
    }
  };

  const handleCopyHex = () => {
    const hex = hsvToHex(hsv.h, hsv.s, hsv.v);
    navigator.clipboard?.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentHex = hsvToHex(hsv.h, hsv.s, hsv.v);
  const currentRgb = hsvToRgb(hsv.h, hsv.s, hsv.v);

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
        title="Open Colour Picker"
      >
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full border border-black/10 shadow-inner shrink-0"
            style={{ backgroundColor: color || "#1A1A1A" }}
          />
          <span className="font-mono text-xs uppercase">{color || "#1A1A1A"}</span>
          {label && <span className="text-[11px] text-text-muted">({label})</span>}
        </div>
        <ChevronDown className="h-3 w-3 text-text-muted shrink-0" />
      </button>

      {/* Google-Style Colour Picker Modal Popover */}
      {isOpen && (
        <div className="absolute left-0 top-full z-[120] mt-1.5 w-80 rounded-xl border border-[#3b3833] bg-[#202124] p-4 text-[#e8eaed] shadow-2xl backdrop-blur-md animate-in fade-in-50 zoom-in-95 select-none font-sans">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 text-sm font-medium text-[#e8eaed]">
            <span>Colour picker</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#9aa0a6] hover:text-white transition-colors p-0.5 rounded"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Top Row: Current Swatch (Left) + 2D Saturation-Value Canvas (Right) */}
          <div className="flex gap-2.5 h-36 mb-3">
            {/* Left Swatch Preview Box */}
            <div
              className="w-24 rounded-lg shadow-inner border border-white/10 shrink-0 flex items-end p-2 transition-colors"
              style={{ backgroundColor: currentHex }}
            >
              <span className="text-[10px] font-mono font-semibold px-1 py-0.5 rounded bg-black/40 text-white backdrop-blur-xs">
                {currentHex}
              </span>
            </div>

            {/* Right 2D Saturation/Value Plane */}
            <div
              ref={satValRef}
              onPointerDown={handleSatValPointerDown}
              onPointerMove={handleSatValPointerMove}
              onPointerUp={handleSatValPointerUp}
              className="relative flex-1 rounded-lg overflow-hidden cursor-crosshair touch-none shadow-inner border border-white/10"
              style={{
                backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
              }}
            >
              {/* White horizontal gradient */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(to right, #ffffff, transparent)",
                }}
              />
              {/* Black vertical gradient */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(to top, #000000, transparent)",
                }}
              />

              {/* Draggable Circle Knob */}
              <div
                className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${hsv.s}%`,
                  top: `${100 - hsv.v}%`,
                  backgroundColor: currentHex,
                }}
              />
            </div>
          </div>

          {/* Rainbow Continuous Hue Slider */}
          <div className="mb-3.5">
            <div
              ref={hueRef}
              onPointerDown={handleHuePointerDown}
              onPointerMove={handleHuePointerMove}
              onPointerUp={handleHuePointerUp}
              className="relative h-4 rounded-full cursor-pointer touch-none shadow-inner border border-white/10"
              style={{
                background:
                  "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
              }}
            >
              {/* Draggable Hue Circle Knob */}
              <div
                className="absolute top-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${(hsv.h / 360) * 100}%`,
                  backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
                }}
              />
            </div>
          </div>

          {/* HEX Input Box with Label & Copy Button */}
          <div className="relative mb-3.5">
            <div className="flex items-center justify-between rounded-lg border border-[#3c4043] bg-[#303134] px-3 py-1.5 focus-within:border-[#8ab4f8]">
              <div className="flex items-center gap-2 flex-1">
                <span className="font-mono text-xs text-[#9aa0a6] uppercase font-bold shrink-0">
                  HEX
                </span>
                <input
                  type="text"
                  value={hexInput}
                  onChange={handleHexChange}
                  placeholder="#1A1A1A or color name"
                  className="w-full bg-transparent font-mono text-xs text-[#e8eaed] uppercase focus:outline-none tracking-wide"
                />
              </div>

              <button
                type="button"
                onClick={handleCopyHex}
                className="text-[#9aa0a6] hover:text-[#8ab4f8] transition-colors p-1"
                title="Copy HEX value"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <div className="flex justify-between items-center text-[10px] text-[#9aa0a6] mt-1 px-1">
              <span>rgb({currentRgb.r}, {currentRgb.g}, {currentRgb.b})</span>
              <span>Search: type "gold", "maroon", "coral"...</span>
            </div>
          </div>

          {/* Theme Palette Swatches */}
          <div className="mb-2.5 pt-2.5 border-t border-[#3c4043]">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9aa0a6] mb-1.5 flex items-center justify-between">
              <span>Theme: {currentTheme.name}</span>
              <Palette className="h-3 w-3 text-[#8ab4f8]" />
            </div>
            <div className="flex items-center gap-1.5">
              {themeColors.map((tc, idx) => (
                <button
                  key={`${tc.label}-${idx}`}
                  type="button"
                  title={`${tc.label}: ${tc.hex}`}
                  onClick={() => {
                    onChange(tc.hex);
                    setHsv(hexToHsv(tc.hex));
                    setHexInput(tc.hex.toUpperCase());
                    addRecent(tc.hex);
                  }}
                  className="h-6 w-6 rounded-full border border-white/20 shadow-xs hover:scale-110 transition-transform flex items-center justify-center shrink-0"
                  style={{ backgroundColor: tc.hex }}
                >
                  {currentHex.toUpperCase() === tc.hex.toUpperCase() && (
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
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9aa0a6] mb-1">
              Recent Colors
            </div>
            <div className="grid grid-cols-8 gap-1">
              {recents.map((rc, idx) => (
                <button
                  key={`recent-${idx}-${rc}`}
                  type="button"
                  title={rc}
                  onClick={() => {
                    onChange(rc);
                    setHsv(hexToHsv(rc));
                    setHexInput(rc.toUpperCase());
                  }}
                  className="h-5 w-5 rounded border border-white/20 hover:scale-110 transition-transform"
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
