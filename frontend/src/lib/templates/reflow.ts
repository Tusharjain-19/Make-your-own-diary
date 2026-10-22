import { El, ImageEl, TextEl, ShapeEl, IconEl } from "@/lib/editor/types";
import { LayoutTemplate } from "./types";

/**
 * Smart content reflow mapper:
 * Maps existing photos & text into slots by order, keeping any extra elements.
 */
export function reflowContentToLayout(
  existingElements: El[],
  template: LayoutTemplate,
  dim: { widthMm: number; heightMm: number; safeMarginMm: number },
  themePalette?: { primary: string; accent: string; text: string }
): El[] {
  const slots = template.slots(dim);

  const existingImages = existingElements.filter((e) => e.type === "image") as ImageEl[];
  const existingTexts = existingElements.filter((e) => e.type === "text") as TextEl[];
  const otherElements = existingElements.filter((e) => e.type !== "image" && e.type !== "text");

  let imgIdx = 0;
  let textIdx = 0;

  const result: El[] = [];

  slots.forEach((slot, idx) => {
    const baseId = `layout-${template.id}-${idx}-${Date.now()}`;

    if (slot.type === "image") {
      if (imgIdx < existingImages.length) {
        // Reuse existing image's src and settings, but adapt to new slot coordinates
        const existing = existingImages[imgIdx++];
        result.push({
          ...existing,
          id: existing.id || baseId,
          x: slot.x,
          y: slot.y,
          w: slot.w,
          h: slot.h,
          rot: slot.rot || 0,
          z: idx + 1,
        });
      } else {
        // Fill slot with template default image
        result.push({
          id: baseId,
          type: "image",
          src: (slot.defaultData as Partial<ImageEl>)?.src || "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
          x: slot.x,
          y: slot.y,
          w: slot.w,
          h: slot.h,
          rot: slot.rot || 0,
          z: idx + 1,
          frame: (slot.defaultData as Partial<ImageEl>)?.frame || "none",
          radius: (slot.defaultData as Partial<ImageEl>)?.radius || 0,
        } as ImageEl);
      }
    } else if (slot.type === "text") {
      const defaultTextData = (slot.defaultData || {}) as Partial<TextEl>;
      if (textIdx < existingTexts.length) {
        // Reuse existing user text content, adapt to slot position & font hierarchy
        const existing = existingTexts[textIdx++];
        result.push({
          ...existing,
          id: existing.id || baseId,
          x: slot.x,
          y: slot.y,
          w: slot.w,
          h: slot.h,
          rot: slot.rot || 0,
          z: idx + 1,
          font: defaultTextData.font || existing.font || "Inter",
          size: defaultTextData.size || existing.size || 11,
          weight: defaultTextData.weight || existing.weight || 400,
          italic: defaultTextData.italic ?? existing.italic,
          align: defaultTextData.align || existing.align || "left",
          lineHeight: defaultTextData.lineHeight || existing.lineHeight || 1.3,
          letterSpacing: defaultTextData.letterSpacing || existing.letterSpacing || 0,
          color: defaultTextData.color || existing.color || themePalette?.text || "#1A1A1A",
        });
      } else {
        // Fill slot with template default text
        result.push({
          id: baseId,
          type: "text",
          text: defaultTextData.text || "Add text here",
          font: defaultTextData.font || "Playfair Display",
          size: defaultTextData.size || 14,
          weight: defaultTextData.weight || 500,
          italic: defaultTextData.italic || false,
          color: defaultTextData.color || themePalette?.text || "#1A1A1A",
          align: defaultTextData.align || "left",
          lineHeight: defaultTextData.lineHeight || 1.3,
          letterSpacing: defaultTextData.letterSpacing || 0,
          x: slot.x,
          y: slot.y,
          w: slot.w,
          h: slot.h,
          rot: slot.rot || 0,
          z: idx + 1,
        } as TextEl);
      }
    } else if (slot.type === "shape") {
      const defaultShapeData = (slot.defaultData || {}) as Partial<ShapeEl>;
      result.push({
        id: baseId,
        type: "shape",
        shape: defaultShapeData.shape || "divider-rule",
        x: slot.x,
        y: slot.y,
        w: slot.w,
        h: slot.h,
        rot: slot.rot || 0,
        z: idx + 1,
        fill: defaultShapeData.fill,
        stroke: defaultShapeData.stroke || themePalette?.accent || "#B8A88A",
        strokeW: defaultShapeData.strokeW || 0.75,
      } as ShapeEl);
    } else if (slot.type === "icon") {
      const defaultIconData = (slot.defaultData || {}) as Partial<IconEl>;
      result.push({
        id: baseId,
        type: "icon",
        iconId: defaultIconData.iconId || "compass",
        color: defaultIconData.color || themePalette?.accent || "#7A1F2B",
        x: slot.x,
        y: slot.y,
        w: slot.w,
        h: slot.h,
        rot: slot.rot || 0,
        z: idx + 1,
      } as IconEl);
    }
  });

  // Keep EXTRA existing photos that didn't fit in the template slots
  while (imgIdx < existingImages.length) {
    result.push(existingImages[imgIdx++]);
  }

  // Keep EXTRA existing text elements that didn't fit in the template slots
  while (textIdx < existingTexts.length) {
    result.push(existingTexts[textIdx++]);
  }

  // Preserve shapes, icons, and decor already on the page
  otherElements.forEach((el) => {
    result.push(el);
  });

  return result;
}
