"use client";

import * as React from "react";
import {
  Square,
  Circle,
  Minus,
  MoveRight,
  Image as ImageIcon,
  Stamp,
  Bookmark,
  Sparkles,
} from "lucide-react";
import { useEditorStore } from "@/lib/editor/store";
import { ShapeEl, IconEl } from "@/lib/editor/types";
import { EDITOR_ICONS } from "@/lib/editor/icons";
import { themes } from "@/lib/themes";

export function ElementsPanel() {
  const { addElement, book } = useEditorStore();
  const [activeTab, setActiveTab] = React.useState<"shapes" | "frames" | "dividers" | "icons">("shapes");
  const [iconCategory, setIconCategory] = React.useState<"all" | "travel" | "decor" | "writing">("all");

  const currentTheme = themes.find((t) => t.id === book?.themeId) || themes[0];
  const accentColor = currentTheme.palette.accent || "#B8A88A";

  const handleAddShape = (
    shape: ShapeEl["shape"],
    options?: Partial<ShapeEl>
  ) => {
    const baseId = `shape-${Date.now()}`;
    const newShape: ShapeEl = {
      id: baseId,
      type: "shape",
      shape,
      x: 35,
      y: 45,
      w:
        shape === "line" || shape === "divider-rule" || shape === "divider-dotted"
          ? 90
          : shape === "tape"
          ? 45
          : shape === "frame-polaroid"
          ? 70
          : 50,
      h:
        shape === "line" || shape === "divider-rule" || shape === "divider-dotted"
          ? 4
          : shape === "tape"
          ? 12
          : shape === "frame-polaroid"
          ? 85
          : 50,
      rot: shape === "tape" ? -3 : 0,
      z: 2,
      fill:
        shape === "tape"
          ? "#F0DEBD"
          : shape === "frame-polaroid"
          ? "#F4F1EA"
          : shape === "stamp"
          ? "#FFF9F0"
          : "#F0EEE9",
      stroke:
        shape === "line" || shape === "divider-rule" || shape === "divider-dotted"
          ? accentColor
          : shape === "stamp"
          ? accentColor
          : "#D4D0C8",
      strokeW: 0.75,
      opacity: shape === "tape" ? 0.88 : 1,
      themeToken: "accent",
      ...options,
    };
    addElement(newShape);
  };

  const handleAddIcon = (iconId: string) => {
    const baseId = `icon-${Date.now()}`;
    const newIcon: IconEl = {
      id: baseId,
      type: "icon",
      iconId,
      x: 45,
      y: 50,
      w: 24,
      h: 24,
      rot: 0,
      z: 3,
      color: accentColor,
      opacity: 1,
      themeToken: "accent",
    };
    addElement(newIcon);
  };

  const filteredIcons = React.useMemo(() => {
    if (iconCategory === "all") return EDITOR_ICONS;
    return EDITOR_ICONS.filter((i) => i.category === iconCategory);
  }, [iconCategory]);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-serif text-base font-medium text-text">Elements & Graphics</h3>
        <p className="text-xs text-text-muted mt-0.5">
          Insert vector shapes, frames, tape, stamps, and editorial travel icons.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border pb-1 gap-1">
        {[
          { id: "shapes", label: "Shapes" },
          { id: "frames", label: "Frames" },
          { id: "dividers", label: "Dividers" },
          { id: "icons", label: "Icons" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-2.5 py-1 text-xs font-medium rounded-t transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-accent text-accent font-semibold"
                : "text-text-muted hover:text-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: BASIC SHAPES */}
      {activeTab === "shapes" && (
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => handleAddShape("rect")}
            className="flex flex-col items-center justify-center gap-2 rounded-[8px] border border-border bg-surface p-4 hover:bg-accent-soft/40 transition-all text-xs font-medium"
          >
            <Square className="h-6 w-6 text-accent" />
            <span>Rectangle</span>
          </button>

          <button
            onClick={() => handleAddShape("circle")}
            className="flex flex-col items-center justify-center gap-2 rounded-[8px] border border-border bg-surface p-4 hover:bg-accent-soft/40 transition-all text-xs font-medium"
          >
            <Circle className="h-6 w-6 text-accent" />
            <span>Circle</span>
          </button>

          <button
            onClick={() => handleAddShape("line")}
            className="flex flex-col items-center justify-center gap-2 rounded-[8px] border border-border bg-surface p-3 hover:bg-accent-soft/40 transition-all text-xs font-medium"
          >
            <Minus className="h-5 w-5 text-accent" />
            <span>Rule Line</span>
          </button>

          <button
            onClick={() => handleAddShape("arrow")}
            className="flex flex-col items-center justify-center gap-2 rounded-[8px] border border-border bg-surface p-3 hover:bg-accent-soft/40 transition-all text-xs font-medium"
          >
            <MoveRight className="h-5 w-5 text-accent" />
            <span>Direction Arrow</span>
          </button>
        </div>
      )}

      {/* TAB 2: FRAMES & TAPE */}
      {activeTab === "frames" && (
        <div className="space-y-2.5">
          <button
            onClick={() => handleAddShape("frame-polaroid")}
            className="flex w-full items-center gap-3 rounded-[8px] border border-border bg-surface p-3 text-left hover:bg-accent-soft/40 transition-all"
          >
            <div className="flex h-10 w-8 items-center justify-center rounded border border-border bg-surface shadow-xs">
              <ImageIcon className="h-4 w-4 text-text-muted" />
            </div>
            <div>
              <div className="text-xs font-medium text-text">Polaroid Keepsake Frame</div>
              <div className="text-[10px] text-text-muted">Classic photo frame with white border</div>
            </div>
          </button>

          <button
            onClick={() => handleAddShape("frame-arch")}
            className="flex w-full items-center gap-3 rounded-[8px] border border-border bg-surface p-3 text-left hover:bg-accent-soft/40 transition-all"
          >
            <div className="flex h-10 w-8 items-center justify-center rounded-t-full border border-border bg-surface shadow-xs">
              <Bookmark className="h-4 w-4 text-text-muted" />
            </div>
            <div>
              <div className="text-xs font-medium text-text">Royal Arch Frame</div>
              <div className="text-[10px] text-text-muted">Jaali arch silhouette for heritage photos</div>
            </div>
          </button>

          <button
            onClick={() => handleAddShape("tape")}
            className="flex w-full items-center gap-3 rounded-[8px] border border-border bg-surface p-3 text-left hover:bg-accent-soft/40 transition-all"
          >
            <div className="h-4 w-10 -rotate-6 rounded-xs bg-[#F0DEBD] border border-[#D6C5A5] shadow-xs" />
            <div>
              <div className="text-xs font-medium text-text">Washi Tape Strip</div>
              <div className="text-[10px] text-text-muted">Stationery tape to stick over photos</div>
            </div>
          </button>

          <button
            onClick={() => handleAddShape("stamp")}
            className="flex w-full items-center gap-3 rounded-[8px] border border-border bg-surface p-3 text-left hover:bg-accent-soft/40 transition-all"
          >
            <div className="flex h-9 w-9 items-center justify-center border-2 border-dashed border-[#B8A88A] bg-[#FFF9F0]">
              <Stamp className="h-4 w-4 text-[#B8A88A]" />
            </div>
            <div>
              <div className="text-xs font-medium text-text">Postage Stamp</div>
              <div className="text-[10px] text-text-muted">Perforated travel souvenir stamp</div>
            </div>
          </button>
        </div>
      )}

      {/* TAB 3: DIVIDERS */}
      {activeTab === "dividers" && (
        <div className="space-y-2.5">
          <button
            onClick={() => handleAddShape("divider-rule")}
            className="flex w-full flex-col gap-1.5 rounded-[8px] border border-border bg-surface p-3 text-left hover:bg-accent-soft/40 transition-all"
          >
            <div className="text-xs font-medium text-text">Diamond Flourish Divider</div>
            <div className="flex items-center gap-2 py-1">
              <div className="h-px flex-1 bg-[#B8A88A]" />
              <div className="h-1.5 w-1.5 rotate-45 bg-[#B8A88A]" />
              <div className="h-px flex-1 bg-[#B8A88A]" />
            </div>
          </button>

          <button
            onClick={() => handleAddShape("divider-dotted")}
            className="flex w-full flex-col gap-1.5 rounded-[8px] border border-border bg-surface p-3 text-left hover:bg-accent-soft/40 transition-all"
          >
            <div className="text-xs font-medium text-text">Dotted Trailing Line</div>
            <div className="border-b border-dashed border-text-muted py-1" />
          </button>
        </div>
      )}

      {/* TAB 4: ICONS (SVG with currentColor) */}
      {activeTab === "icons" && (
        <div className="space-y-3">
          {/* Subcategory Pills */}
          <div className="flex gap-1">
            {(["all", "travel", "decor", "writing"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setIconCategory(cat)}
                className={`rounded-full px-2 py-0.5 text-[10px] capitalize transition-colors ${
                  iconCategory === cat
                    ? "bg-accent text-white"
                    : "bg-accent-soft/60 text-text-muted hover:text-text"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-2 max-h-72 overflow-y-auto pr-1">
            {filteredIcons.map((icon) => {
              const IconSvg = icon.svg;
              return (
                <button
                  key={icon.id}
                  onClick={() => handleAddIcon(icon.id)}
                  title={icon.name}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-[8px] border border-border bg-surface p-2.5 hover:bg-accent-soft hover:scale-105 transition-all text-text"
                >
                  <IconSvg className="h-5 w-5" style={{ color: accentColor }} />
                  <span className="text-[9px] text-text-muted truncate w-full text-center">
                    {icon.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
