export type Unit = "mm";

export type PageSize = "A5" | "A4" | "Square";

export interface BaseEl {
  id: string;
  x: number; // in mm
  y: number; // in mm
  w: number; // in mm
  h: number; // in mm
  rot: number; // degrees
  z: number; // stacking index
  locked?: boolean;
  opacity?: number; // 0 to 1
  themeToken?: "primary" | "accent" | "muted" | "text" | "surface";
  flipX?: boolean;
  flipY?: boolean;
}

export interface TextEl extends BaseEl {
  type: "text";
  text: string;
  font: string;
  size: number; // in pt (1 pt = 0.352778 mm)
  weight: number;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  uppercase?: boolean;
  color: string;
  align: "left" | "center" | "right" | "justify";
  lineHeight: number;
  letterSpacing: number;
  border?: { w: number; color: string; radius?: number; style?: "solid" | "dashed" };
  // Canva-style text transparency & effects
  isHollow?: boolean; // Transparent text knockout fill with outline
  effect?: "none" | "shadow" | "lift" | "neon" | "hollow" | "background";
  effectColor?: string;
  effectIntensity?: number; // 0 to 1
  bgPill?: { color: string; opacity: number; padding?: number; radius?: number };
}

export interface ImageEl extends BaseEl {
  type: "image";
  src: string;
  assetId?: string;
  originalWidth?: number;
  originalHeight?: number;
  crop?: { x: number; y: number; w: number; h: number };
  frame?: "none" | "polaroid" | "round" | "arch";
  border?: { w: number; color: string; radius?: number; style?: "solid" | "dashed" };
  radius?: number;
}

export interface ShapeEl extends BaseEl {
  type: "shape";
  shape:
    | "rect"
    | "circle"
    | "line"
    | "arrow"
    | "arrow-curved-up"
    | "arrow-curved-down"
    | "arrow-curved-left"
    | "arrow-curved-arch"
    | "arrow-s-curve"
    | "arrow-double-curved"
    | "emoji-sticker"
    | "frame-polaroid"
    | "frame-arch"
    | "divider-rule"
    | "divider-dotted"
    | "tape"
    | "stamp"
    | "stamp-wanderlust"
    | "stamp-passport"
    | "arch"
    | "cute-wavy"
    | "cute-heart"
    | "cute-book"
    | "cute-seal"
    | "cute-dots";
  fill?: string;
  stroke?: string;
  strokeW?: number;
  cornerRadius?: number;
  emoji?: string;
}

export interface IconEl extends BaseEl {
  type: "icon";
  iconId: string;
  color: string;
}

export type El = TextEl | ImageEl | ShapeEl | IconEl;

export interface PageData {
  id: string;
  position: number;
  bg: string;
  bgImage?: string;
  layoutId?: string;
  elements: El[];
}

export interface BookModel {
  id: string;
  userId?: string;
  title: string;
  subtitle?: string;
  author?: string;
  dates?: string;
  size: PageSize;
  themeId: string;
  status: "draft" | "exported" | "ordered";
  pages: PageData[];
}
