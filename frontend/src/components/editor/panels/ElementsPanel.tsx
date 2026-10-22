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
  Heart,
  BookOpen,
  Award,
  Smile,
  Navigation,
} from "lucide-react";
import { useEditorStore } from "@/lib/editor/store";
import { ShapeEl, IconEl } from "@/lib/editor/types";
import { EDITOR_ICONS } from "@/lib/editor/icons";
import { themes } from "@/lib/themes";

const EMOJI_CATEGORIES = [
  {
    name: "Sparks & Sentiment",
    emojis: ["✨", "💖", "❤️", "⭐", "🌟", "🔥", "🌈", "☕", "🕊️", "💫", "☀️", "🌙", "🌸", "🌺", "🍃", "🍁"],
  },
  {
    name: "Travel & Exploration",
    emojis: ["✈️", "🧳", "📸", "🗺️", "🧭", "🚗", "🚂", "🚢", "🏔️", "🏖️", "⛺", "🏰", "🏛️", "🎟️", "🛵", "🚲"],
  },
  {
    name: "Diary & Celebrations",
    emojis: ["📖", "💌", "🎈", "🎉", "👑", "💎", "🎨", "🥨", "🍕", "🍦", "🍹", "🥂", "🌻", "🪷", "🏮", "🎐"],
  },
];

export function ElementsPanel() {
  const { addElement, book } = useEditorStore();
  const [activeTab, setActiveTab] = React.useState<"shapes" | "arrows" | "frames" | "dividers" | "cute" | "icons" | "emojis">("shapes");
  const [iconCategory, setIconCategory] = React.useState<"all" | "travel" | "decor" | "writing">("all");

  const currentTheme = themes.find((t) => t.id === book?.themeId) || themes[0];
  const accentColor = currentTheme.palette.accent || "#B8A88A";

  const handleAddShape = (
    shape: ShapeEl["shape"],
    options?: Partial<ShapeEl>
  ) => {
    const baseId = `shape-${Date.now()}`;
    const isArrow = shape.startsWith("arrow");

    const newShape: ShapeEl = {
      id: baseId,
      type: "shape",
      shape,
      x: 35,
      y: 45,
      w:
        shape === "line" || shape === "divider-rule" || shape === "divider-dotted"
          ? 90
          : shape === "cute-wavy" || shape === "cute-dots"
          ? 75
          : isArrow
          ? 55
          : shape === "tape"
          ? 45
          : shape === "frame-polaroid"
          ? 70
          : shape === "cute-heart" || shape === "cute-book"
          ? 26
          : shape === "cute-seal"
          ? 32
          : 50,
      h:
        shape === "line" || shape === "divider-rule" || shape === "divider-dotted"
          ? 4
          : shape === "cute-wavy" || shape === "cute-dots"
          ? 8
          : isArrow
          ? 35
          : shape === "tape"
          ? 12
          : shape === "frame-polaroid"
          ? 85
          : shape === "cute-heart" || shape === "cute-book"
          ? 24
          : shape === "cute-seal"
          ? 32
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
          : shape === "cute-heart"
          ? "#F5D0D5"
          : shape === "cute-book"
          ? accentColor
          : shape === "cute-seal"
          ? "#8B2635"
          : isArrow
          ? accentColor
          : "#F0EEE9",
      stroke:
        shape === "line" || shape === "divider-rule" || shape === "divider-dotted"
          ? accentColor
          : shape === "cute-wavy"
          ? accentColor
          : isArrow
          ? accentColor
          : shape === "cute-heart" || shape === "cute-dots"
          ? "#C96D7C"
          : shape === "stamp"
          ? accentColor
          : "#D4D0C8",
      strokeW: shape === "cute-wavy" || isArrow ? 1.5 : 0.75,
      opacity: shape === "tape" ? 0.88 : 1,
      themeToken: "accent",
      ...options,
    };
    addElement(newShape);
  };

  const handleAddEmoji = (emoji: string) => {
    const baseId = `emoji-${Date.now()}`;
    const newShape: ShapeEl = {
      id: baseId,
      type: "shape",
      shape: "emoji-sticker",
      emoji,
      x: 45,
      y: 45,
      w: 24,
      h: 24,
      rot: 0,
      z: 4,
      opacity: 1,
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
          Insert vector shapes, curved arrows, stickers, frames, and travel icons.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border pb-1 gap-1 overflow-x-auto scrollbar-none">
        {[
          { id: "shapes", label: "Shapes" },
          { id: "arrows", label: "Curved Arrows" },
          { id: "emojis", label: "Emojis" },
          { id: "frames", label: "Frames" },
          { id: "dividers", label: "Dividers" },
          { id: "cute", label: "Cute" },
          { id: "icons", label: "Icons" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-2.5 py-1 text-xs font-medium rounded-t transition-colors whitespace-nowrap ${
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
            <span>Straight Arrow</span>
          </button>
        </div>
      )}

      {/* TAB 2: CURVED ARROWS (Rotatable & Customizable) */}
      {activeTab === "arrows" && (
        <div className="space-y-3">
          <div className="text-xs text-text-muted leading-relaxed">
            Click to add curved vector arrows. You can rotate them to any angle with live degree guides!
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Curved Arrow Up-Right */}
            <button
              onClick={() => handleAddShape("arrow-curved-up")}
              className="flex flex-col items-center justify-center gap-2 rounded-[8px] border border-border bg-surface p-3.5 hover:bg-accent-soft/40 transition-all text-xs font-medium group"
            >
              <svg className="w-10 h-8 text-accent group-hover:scale-105 transition-transform" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
                <path d="M 10,50 Q 50,10 85,20" />
                <path d="M 68,14 L 88,20 L 80,38" fill="currentColor" stroke="none" />
              </svg>
              <span>Curve Up-Right</span>
            </button>

            {/* Curved Arrow Down-Right */}
            <button
              onClick={() => handleAddShape("arrow-curved-down")}
              className="flex flex-col items-center justify-center gap-2 rounded-[8px] border border-border bg-surface p-3.5 hover:bg-accent-soft/40 transition-all text-xs font-medium group"
            >
              <svg className="w-10 h-8 text-accent group-hover:scale-105 transition-transform" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
                <path d="M 10,10 Q 50,55 85,45" />
                <path d="M 68,48 L 88,44 L 78,28" fill="currentColor" stroke="none" />
              </svg>
              <span>Curve Down-Right</span>
            </button>

            {/* Curved Arrow Loop Left */}
            <button
              onClick={() => handleAddShape("arrow-curved-left")}
              className="flex flex-col items-center justify-center gap-2 rounded-[8px] border border-border bg-surface p-3.5 hover:bg-accent-soft/40 transition-all text-xs font-medium group"
            >
              <svg className="w-10 h-8 text-accent group-hover:scale-105 transition-transform" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
                <path d="M 90,50 Q 50,8 15,30" />
                <path d="M 32,22 L 12,30 L 22,48" fill="currentColor" stroke="none" />
              </svg>
              <span>Curve Loop Left</span>
            </button>

            {/* Arch Arrow */}
            <button
              onClick={() => handleAddShape("arrow-curved-arch")}
              className="flex flex-col items-center justify-center gap-2 rounded-[8px] border border-border bg-surface p-3.5 hover:bg-accent-soft/40 transition-all text-xs font-medium group"
            >
              <svg className="w-10 h-8 text-accent group-hover:scale-105 transition-transform" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
                <path d="M 12,50 Q 50,0 88,48" />
                <path d="M 72,36 L 89,50 L 94,30" fill="currentColor" stroke="none" />
              </svg>
              <span>Arch Arrow</span>
            </button>

            {/* S-Curve Arrow */}
            <button
              onClick={() => handleAddShape("arrow-s-curve")}
              className="flex flex-col items-center justify-center gap-2 rounded-[8px] border border-border bg-surface p-3.5 hover:bg-accent-soft/40 transition-all text-xs font-medium group"
            >
              <svg className="w-10 h-8 text-accent group-hover:scale-105 transition-transform" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
                <path d="M 10,48 Q 30,5 50,30 T 90,15" />
                <path d="M 72,12 L 92,14 L 84,32" fill="currentColor" stroke="none" />
              </svg>
              <span>S-Curve Arrow</span>
            </button>

            {/* Double-Headed Curved Arrow */}
            <button
              onClick={() => handleAddShape("arrow-double-curved")}
              className="flex flex-col items-center justify-center gap-2 rounded-[8px] border border-border bg-surface p-3.5 hover:bg-accent-soft/40 transition-all text-xs font-medium group"
            >
              <svg className="w-10 h-8 text-accent group-hover:scale-105 transition-transform" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
                <path d="M 15,48 Q 50,5 85,48" />
                <path d="M 70,36 L 86,49 L 91,30" fill="currentColor" stroke="none" />
                <path d="M 30,36 L 14,49 L 9,30" fill="currentColor" stroke="none" />
              </svg>
              <span>Double Curved</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: EMOJIS & STICKERS */}
      {activeTab === "emojis" && (
        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
          <div className="text-xs text-text-muted">
            Click any emoji to add it as a rotatable, resizable sticker on your page.
          </div>

          {EMOJI_CATEGORIES.map((cat) => (
            <div key={cat.name} className="space-y-2">
              <div className="text-[11px] font-medium font-serif text-text-muted uppercase tracking-wider">
                {cat.name}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {cat.emojis.map((emoji, idx) => (
                  <button
                    key={`${cat.name}-${idx}`}
                    onClick={() => handleAddEmoji(emoji)}
                    className="flex h-11 w-full items-center justify-center rounded-[8px] border border-border bg-surface text-xl hover:bg-accent-soft/60 hover:scale-110 active:scale-95 transition-all shadow-xs"
                    title={`Add ${emoji}`}
                  >
                    <span>{emoji}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: FRAMES & TAPE */}
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

      {/* TAB 5: DIVIDERS */}
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

      {/* TAB 6: CUTE & STATIONERY */}
      {activeTab === "cute" && (
        <div className="space-y-2.5">
          {/* Cute Wavy Doodle Line */}
          <button
            onClick={() => handleAddShape("cute-wavy")}
            className="flex w-full items-center gap-3 rounded-[8px] border border-border bg-surface p-3 text-left hover:bg-accent-soft/40 transition-all"
          >
            <div className="flex h-10 w-12 items-center justify-center rounded border border-border bg-[#FFFDF9] shadow-xs">
              <svg className="h-6 w-8 text-[#C29B38]" viewBox="0 0 100 24" fill="none" stroke="currentColor" strokeWidth="4">
                <path d="M 0,12 Q 12.5,0 25,12 T 50,12 T 75,12 T 100,12" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-medium text-text">Cute Wavy Doodle Line</div>
              <div className="text-[10px] text-text-muted">Playful hand-drawn sine wave separator</div>
            </div>
          </button>

          {/* Cute Stationery Heart */}
          <button
            onClick={() => handleAddShape("cute-heart")}
            className="flex w-full items-center gap-3 rounded-[8px] border border-border bg-surface p-3 text-left hover:bg-accent-soft/40 transition-all"
          >
            <div className="flex h-10 w-12 items-center justify-center rounded border border-border bg-[#FFF0F2] shadow-xs">
              <Heart className="h-5 w-5 fill-[#F5D0D5] text-[#C96D7C]" />
            </div>
            <div>
              <div className="text-xs font-medium text-text">Cute Stationery Heart</div>
              <div className="text-[10px] text-text-muted">Soft blush pastel keepsake heart</div>
            </div>
          </button>

          {/* Cute Storybound Book Emblem */}
          <button
            onClick={() => handleAddShape("cute-book")}
            className="flex w-full items-center gap-3 rounded-[8px] border border-border bg-surface p-3 text-left hover:bg-accent-soft/40 transition-all"
          >
            <div className="flex h-10 w-12 items-center justify-center rounded border border-border bg-[#F9F7F2] shadow-xs">
              <BookOpen className="h-5 w-5 text-accent" />
            </div>
            <div>
              <div className="text-xs font-medium text-text">Storybound Book Emblem</div>
              <div className="text-[10px] text-text-muted">Handcrafted open diary logo stamp</div>
            </div>
          </button>

          {/* Cute Vintage Wax Seal */}
          <button
            onClick={() => handleAddShape("cute-seal")}
            className="flex w-full items-center gap-3 rounded-[8px] border border-border bg-surface p-3 text-left hover:bg-accent-soft/40 transition-all"
          >
            <div className="flex h-10 w-12 items-center justify-center rounded border border-border bg-[#8B2635] shadow-xs">
              <Award className="h-5 w-5 text-[#E8A87C]" />
            </div>
            <div>
              <div className="text-xs font-medium text-text">Vintage Wax Seal Badge</div>
              <div className="text-[10px] text-text-muted">Deep crimson royal wax seal with emblem</div>
            </div>
          </button>

          {/* Cute Dotted Heart Trail */}
          <button
            onClick={() => handleAddShape("cute-dots")}
            className="flex w-full items-center gap-3 rounded-[8px] border border-border bg-surface p-3 text-left hover:bg-accent-soft/40 transition-all"
          >
            <div className="flex h-10 w-12 items-center justify-center rounded border border-border bg-surface shadow-xs">
              <div className="flex items-center gap-1">
                <span className="text-[#C96D7C] text-xs">···</span>
                <Heart className="h-3 w-3 fill-[#C96D7C] text-[#C96D7C]" />
                <span className="text-[#C96D7C] text-xs">···</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-text">Dotted Heart Trail</div>
              <div className="text-[10px] text-text-muted">Whimsical dotted flourish with center heart</div>
            </div>
          </button>
        </div>
      )}

      {/* TAB 7: ICONS (SVG with currentColor) */}
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
