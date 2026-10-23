import * as opentype from "opentype.js";
import { ProcessedGlyph, HandwritingFontMetadata } from "./types";
import { vectorizeGlyph } from "./vectorizer";
import { isCapitalLetter, isSmallLetter, isAscender, isDescender, isSmallXHeight } from "./grid";

export const USER_FONTS_STORAGE_KEY = "storybound_user_handwriting_fonts";

/**
 * Intelligent Dual-Case Synthesis:
 * Guarantees that both Capital Letters (A-Z) and Small Letters (a-z) are available.
 * If user only drew Capitals, small-caps are automatically generated for small letters.
 * If user only drew Small letters, capital variants are automatically generated.
 */
export function synthesizeMissingCases(glyphs: ProcessedGlyph[]): {
  completeGlyphs: ProcessedGlyph[];
  synthesizedCount: number;
} {
  const glyphMap = new Map<string, ProcessedGlyph>();
  for (const g of glyphs) {
    if (g.status !== "empty") {
      glyphMap.set(g.char, g);
    }
  }

  let synthesizedCount = 0;
  const result: ProcessedGlyph[] = [...glyphs];

  // 1. Check A-Z and synthesize missing small letters a-z
  for (let i = 65; i <= 90; i++) {
    const capitalChar = String.fromCharCode(i);
    const smallChar = String.fromCharCode(i + 32);

    const hasCapital = glyphMap.has(capitalChar);
    const hasSmall = glyphMap.has(smallChar);

    if (hasCapital && !hasSmall) {
      const capGlyph = glyphMap.get(capitalChar)!;
      const smallIdx = result.findIndex((g) => g.char === smallChar);
      const synthesizedSmall: ProcessedGlyph = {
        char: smallChar,
        label: smallChar,
        row: smallIdx >= 0 ? result[smallIdx].row : capGlyph.row,
        col: smallIdx >= 0 ? result[smallIdx].col : capGlyph.col,
        dataUrl: capGlyph.dataUrl,
        qualityScore: Math.round(capGlyph.qualityScore * 0.92),
        status: capGlyph.status === "good" ? "good" : "warning",
        width: Math.round(capGlyph.width * 0.76),
        height: Math.round(capGlyph.height * 0.72),
        baselineOffset: Math.round(capGlyph.baselineOffset * 0.72),
        category: "small",
        pairedChar: capitalChar,
        isAscender: isAscender(smallChar),
        isDescender: isDescender(smallChar),
        isSmallXHeight: isSmallXHeight(smallChar),
        isSynthesized: true,
      };

      if (smallIdx >= 0) {
        result[smallIdx] = synthesizedSmall;
      } else {
        result.push(synthesizedSmall);
      }
      glyphMap.set(smallChar, synthesizedSmall);
      synthesizedCount++;
    } else if (hasSmall && !hasCapital) {
      // 2. Synthesize missing Capital letter from Small letter
      const smallGlyph = glyphMap.get(smallChar)!;
      const capIdx = result.findIndex((g) => g.char === capitalChar);
      const synthesizedCap: ProcessedGlyph = {
        char: capitalChar,
        label: capitalChar,
        row: capIdx >= 0 ? result[capIdx].row : smallGlyph.row,
        col: capIdx >= 0 ? result[capIdx].col : smallGlyph.col,
        dataUrl: smallGlyph.dataUrl,
        qualityScore: Math.round(smallGlyph.qualityScore * 0.90),
        status: smallGlyph.status === "good" ? "good" : "warning",
        width: Math.round(smallGlyph.width * 1.3),
        height: Math.round(smallGlyph.height * 1.38),
        baselineOffset: Math.round(smallGlyph.baselineOffset * 1.38),
        category: "capital",
        pairedChar: smallChar,
        isAscender: false,
        isDescender: false,
        isSmallXHeight: false,
        isSynthesized: true,
      };

      if (capIdx >= 0) {
        result[capIdx] = synthesizedCap;
      } else {
        result.push(synthesizedCap);
      }
      glyphMap.set(capitalChar, synthesizedCap);
      synthesizedCount++;
    }
  }

  return { completeGlyphs: result, synthesizedCount };
}

/**
 * Builds a true OpenType font from extracted glyphs using opentype.js
 * Guaranteeing full dual-case capital and small letter support with typographic advance widths
 */
export async function buildOpenTypeFont(
  fontName: string,
  rawGlyphs: ProcessedGlyph[],
  userId = "user-default"
): Promise<{ font: opentype.Font; arrayBuffer: ArrayBuffer; dataUrl: string; synthesizedCount: number }> {
  const unitsPerEm = 1000;
  const ascender = 800;
  const descender = -200;

  // 1. Synthesize any missing cases (so both capital and small letter are guaranteed)
  const { completeGlyphs, synthesizedCount } = synthesizeMissingCases(rawGlyphs);

  // 2. Mandatory .notdef glyph
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

  // 3. Space glyph (natural handwriting space ~340 units)
  const spaceGlyph = new opentype.Glyph({
    name: "space",
    unicode: 32,
    advanceWidth: 340,
    path: new opentype.Path(),
  });

  const fontGlyphs = [notdefGlyph, spaceGlyph];

  // 4. Process all characters
  for (const glyph of completeGlyphs) {
    if (glyph.status === "empty") continue;

    // Scale multiplier: synthesized small caps are slightly refined
    const scaleMultiplier = glyph.isSynthesized && isSmallLetter(glyph.char) ? 0.82 : 1.0;
    const path = await vectorizeGlyph(glyph, unitsPerEm, scaleMultiplier);
    const unicode = glyph.char.charCodeAt(0);

    // Compute optical advance width tailored to capital vs small letters
    let advanceWidth: number;
    if (isCapitalLetter(glyph.char)) {
      // Capitals: wider stance (typically 500 - 750 units)
      advanceWidth = Math.min(850, Math.max(480, Math.round(180 + glyph.width * 5.5)));
    } else if (isSmallLetter(glyph.char)) {
      // Small letters: compact cursive spacing (typically 320 - 550 units)
      if (["i", "l", "j", "t", "r"].includes(glyph.char)) {
        advanceWidth = Math.min(420, Math.max(260, Math.round(100 + glyph.width * 5.0)));
      } else if (["m", "w"].includes(glyph.char)) {
        advanceWidth = Math.min(780, Math.max(520, Math.round(140 + glyph.width * 5.2)));
      } else {
        advanceWidth = Math.min(620, Math.max(340, Math.round(120 + glyph.width * 5.2)));
      }
    } else if (glyph.char >= "0" && glyph.char <= "9") {
      // Tabular numbers
      advanceWidth = 550;
    } else {
      // Punctuation
      advanceWidth = [".", ",", "'", "!"].includes(glyph.char) ? 240 : 420;
    }

    const otfGlyph = new opentype.Glyph({
      name: isCapitalLetter(glyph.char)
        ? `cap_${glyph.char}`
        : isSmallLetter(glyph.char)
        ? `small_${glyph.char}`
        : `uni${unicode.toString(16).padStart(4, "0")}`,
      unicode,
      advanceWidth,
      path,
    });

    fontGlyphs.push(otfGlyph);
  }

  // 5. Construct OpenType Font
  const font = new opentype.Font({
    familyName: fontName,
    styleName: "Regular",
    unitsPerEm,
    ascender,
    descender,
    glyphs: fontGlyphs,
  });

  // 6. Export to binary ArrayBuffer and Data URL
  const arrayBuffer = font.toArrayBuffer();
  const blob = new Blob([arrayBuffer], { type: "font/opentype" });
  const dataUrl = URL.createObjectURL(blob);

  // 7. Dynamically register in browser document fonts for live usage
  try {
    const fontFace = new FontFace(fontName, arrayBuffer);
    await fontFace.load();
    document.fonts.add(fontFace);
    console.log(`[Storybound] Successfully loaded dual-case handwriting font into DOM: "${fontName}" (${fontGlyphs.length} glyphs)`);
  } catch (err) {
    console.warn(`Could not register font face directly:`, err);
  }

  // 8. Persist to local storage metadata
  saveFontToLocalRegistry({
    id: `font-${Date.now()}`,
    userId,
    name: fontName,
    createdAt: new Date().toISOString(),
    glyphCount: fontGlyphs.length - 2, // minus notdef and space
    dataUrl,
    status: "ready",
  });

  return { font, arrayBuffer, dataUrl, synthesizedCount };
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
