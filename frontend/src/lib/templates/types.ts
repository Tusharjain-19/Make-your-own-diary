import { El } from "@/lib/editor/types";

export interface LayoutSlot {
  type: "image" | "text" | "shape" | "icon";
  role: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: number;
  defaultData?: Partial<El>;
}

export type LayoutCategory =
  | "all"
  | "cover"
  | "travel"
  | "photo"
  | "split"
  | "grid"
  | "collage"
  | "text"
  | "diary"
  | "keepsake";

export interface LayoutTemplate {
  id: string;
  name: string;
  category: LayoutCategory;
  desc: string;
  slots: (dim: { widthMm: number; heightMm: number; safeMarginMm: number }) => LayoutSlot[];
}
