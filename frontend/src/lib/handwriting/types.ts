export interface ProcessedGlyph {
  char: string;
  label: string;
  row: number;
  col: number;
  dataUrl: string; // base64 PNG of cropped glyph
  svgPath?: string; // vectorized SVG path
  qualityScore: number; // 0 to 100
  status: "good" | "warning" | "empty";
  width: number;
  height: number;
  baselineOffset: number; // offset in px from baseline
  isManualDrawing?: boolean;
}

export interface HandwritingFontMetadata {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  glyphCount: number;
  dataUrl?: string; // base64 or blob URL of the .otf font
  status: "ready" | "processing" | "failed";
}
