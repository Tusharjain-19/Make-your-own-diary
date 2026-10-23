import * as opentype from "opentype.js";
import { ProcessedGlyph, HandwritingFontMetadata } from "./types";
import { vectorizeGlyph } from "./vectorizer";

export const USER_FONTS_STORAGE_KEY = "storybound_user_handwriting_fonts";

/**
 * Builds a true OpenType font from extracted glyphs using opentype.js
 */
export async function buildOpenTypeFont(
  fontName: string,
  glyphs: ProcessedGlyph[],
  userId = "user-default"
): Promise<{ font: opentype.Font; arrayBuffer: ArrayBuffer; dataUrl: string }> {
  const unitsPerEm = 1000;
  const ascender = 800;
  const descender = -200;

  // 1. Mandatory .notdef glyph
  const notdefPath = new opentype.Path();
  notdefPath.moveTo(100, 0);
  notdefPath.lineTo(500, 0);
  notdefPath.lineTo(500, 700);
  notdefPath.lineTo(100, 700);
  notdefPath.close();

  const notdefGlyph = new opentype.Glyph({
    name: ".notdef",
    unicode: 0,
    advanceWidth: 600,
    path: notdefPath,
  });

  // 2. Space glyph
  const spaceGlyph = new opentype.Glyph({
    name: "space",
    unicode: 32,
    advanceWidth: 320,
    path: new opentype.Path(),
  });

  const fontGlyphs = [notdefGlyph, spaceGlyph];

  // 3. Processed user characters
  for (const glyph of glyphs) {
    if (glyph.status === "empty") continue;

    const path = await vectorizeGlyph(glyph, unitsPerEm);
    const unicode = glyph.char.charCodeAt(0);
    // Advance width = glyph width scaled + side bearings
    const scale = (unitsPerEm * 0.7) / Math.max(glyph.width, glyph.height || 1);
    const advanceWidth = Math.round(140 + glyph.width * scale);

    const otfGlyph = new opentype.Glyph({
      name: `uni${unicode.toString(16).padStart(4, "0")}`,
      unicode,
      advanceWidth,
      path,
    });

    fontGlyphs.push(otfGlyph);
  }

  // 4. Construct OpenType Font
  const font = new opentype.Font({
    familyName: fontName,
    styleName: "Regular",
    unitsPerEm,
    ascender,
    descender,
    glyphs: fontGlyphs,
  });

  // 5. Export to binary ArrayBuffer and Data URL
  const arrayBuffer = font.toArrayBuffer();
  const blob = new Blob([arrayBuffer], { type: "font/opentype" });
  const dataUrl = URL.createObjectURL(blob);

  // 6. Dynamically register in browser document fonts for live usage
  try {
    const fontFace = new FontFace(fontName, arrayBuffer);
    await fontFace.load();
    document.fonts.add(fontFace);
    console.log(`[Storybound] Successfully loaded handwriting font into DOM: "${fontName}"`);
  } catch (err) {
    console.warn(`Could not register font face directly:`, err);
  }

  // 7. Persist to local storage metadata
  saveFontToLocalRegistry({
    id: `font-${Date.now()}`,
    userId,
    name: fontName,
    createdAt: new Date().toISOString(),
    glyphCount: fontGlyphs.length - 2, // minus notdef and space
    dataUrl,
    status: "ready",
  });

  return { font, arrayBuffer, dataUrl };
}

export function getLocalFontsRegistry(): HandwritingFontMetadata[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(USER_FONTS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveFontToLocalRegistry(meta: HandwritingFontMetadata) {
  if (typeof window === "undefined") return;
  try {
    const current = getLocalFontsRegistry();
    // Enforce 3 fonts per user constraint
    const updated = [meta, ...current.filter((f) => f.name !== meta.name)].slice(0, 3);
    localStorage.setItem(USER_FONTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Error saving font metadata:", err);
  }
}

export function deleteFontFromRegistry(name: string) {
  if (typeof window === "undefined") return;
  try {
    const current = getLocalFontsRegistry();
    const updated = current.filter((f) => f.name !== name);
    localStorage.setItem(USER_FONTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Error deleting font:", err);
  }
}
