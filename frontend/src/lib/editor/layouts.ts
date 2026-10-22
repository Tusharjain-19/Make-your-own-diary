import { El, ImageEl, TextEl, ShapeEl } from "./types";

export interface LayoutSlot {
  type: "image" | "text" | "shape";
  role: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: number;
  defaultData?: Partial<El>;
}

export interface LayoutTemplate {
  id: string;
  name: string;
  category: "all" | "photo" | "split" | "grid" | "collage" | "text" | "diary" | "keepsake";
  desc: string;
  slots: (dim: { widthMm: number; heightMm: number; safeMarginMm: number }) => LayoutSlot[];
}

export const LAYOUT_TEMPLATES: LayoutTemplate[] = [
  // L01: Full-bleed photo
  {
    id: "L01",
    name: "Full-Bleed Photo",
    category: "photo",
    desc: "Single edge-to-edge photograph covering the entire page.",
    slots: (dim) => [
      {
        type: "image",
        role: "hero",
        x: 0,
        y: 0,
        w: dim.widthMm,
        h: dim.heightMm,
        defaultData: {
          src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80",
          frame: "none",
        },
      },
    ],
  },

  // L02: Photo + Story (50/50 Split)
  {
    id: "L02",
    name: "Photo + Story (50/50)",
    category: "split",
    desc: "Hero photo on top half, title and story essay on bottom half.",
    slots: (dim) => {
      const m = dim.safeMarginMm;
      const cw = dim.widthMm - m * 2;
      const ch = dim.heightMm - m * 2;
      return [
        {
          type: "image",
          role: "main-photo",
          x: m,
          y: m,
          w: cw,
          h: ch * 0.52,
          defaultData: {
            src: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
            radius: 4,
          },
        },
        {
          type: "text",
          role: "title",
          x: m,
          y: m + ch * 0.56,
          w: cw,
          h: 14,
          defaultData: {
            text: "Sunset Over the Ghats",
            font: "Playfair Display",
            size: 22,
            weight: 600,
            align: "left",
            lineHeight: 1.2,
          },
        },
        {
          type: "text",
          role: "body",
          x: m,
          y: m + ch * 0.67,
          w: cw,
          h: 36,
          defaultData: {
            text: "The evening bells echoed across the river as rowboats drifted through the holy waters, carrying flickering clay lamps into the twilight.",
            font: "Inter",
            size: 10,
            weight: 400,
            color: "#4A4A45",
            align: "left",
            lineHeight: 1.6,
          },
        },
      ];
    },
  },

  // L03: Photo Top, Text Bottom
  {
    id: "L03",
    name: "Photo Top, Text Bottom",
    category: "split",
    desc: "Wide landscape photograph with editorial narrative below.",
    slots: (dim) => {
      const m = dim.safeMarginMm;
      const cw = dim.widthMm - m * 2;
      const ch = dim.heightMm - m * 2;
      return [
        {
          type: "image",
          role: "top-photo",
          x: m,
          y: m,
          w: cw,
          h: ch * 0.62,
          defaultData: {
            src: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80",
            radius: 3,
          },
        },
        {
          type: "text",
          role: "body",
          x: m,
          y: m + ch * 0.66,
          w: cw,
          h: 30,
          defaultData: {
            text: "We woke before dawn to catch the golden hour. The palaces glowed under morning mist, reflecting centuries of royal heritage.",
            font: "Lora",
            size: 10.5,
            weight: 400,
            align: "left",
            lineHeight: 1.5,
          },
        },
      ];
    },
  },

  // L04: 2-Photo Grid
  {
    id: "L04",
    name: "2-Photo Vertical Stack",
    category: "grid",
    desc: "Two stacked landscape photos with date and location caption.",
    slots: (dim) => {
      const m = dim.safeMarginMm;
      const cw = dim.widthMm - m * 2;
      const ch = dim.heightMm - m * 2;
      const photoH = (ch - 18) / 2;
      return [
        {
          type: "image",
          role: "photo-1",
          x: m,
          y: m,
          w: cw,
          h: photoH,
          defaultData: {
            src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
            radius: 3,
          },
        },
        {
          type: "image",
          role: "photo-2",
          x: m,
          y: m + photoH + 6,
          w: cw,
          h: photoH,
          defaultData: {
            src: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop&q=80",
            radius: 3,
          },
        },
        {
          type: "text",
          role: "caption",
          x: m,
          y: m + photoH * 2 + 10,
          w: cw,
          h: 8,
          defaultData: {
            text: "MORNING SUNRISE & EVENING TIDE · SOUTH COAST",
            font: "Inter",
            size: 8,
            weight: 500,
            align: "center",
            letterSpacing: 0.8,
            color: "#6B6B66",
          },
        },
      ];
    },
  },

  // L05: 3-Photo Collage
  {
    id: "L05",
    name: "3-Photo Collage",
    category: "collage",
    desc: "One dominant portrait hero photo paired with two stacked side shots.",
    slots: (dim) => {
      const m = dim.safeMarginMm;
      const cw = dim.widthMm - m * 2;
      const ch = dim.heightMm - m * 2;
      const leftW = cw * 0.58;
      const rightW = cw * 0.38;
      const rightH = (ch * 0.88 - 6) / 2;
      return [
        {
          type: "image",
          role: "main-hero",
          x: m,
          y: m,
          w: leftW,
          h: ch * 0.88,
          defaultData: {
            src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80",
            radius: 3,
          },
        },
        {
          type: "image",
          role: "side-1",
          x: m + leftW + cw * 0.04,
          y: m,
          w: rightW,
          h: rightH,
          defaultData: {
            src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
            radius: 3,
          },
        },
        {
          type: "image",
          role: "side-2",
          x: m + leftW + cw * 0.04,
          y: m + rightH + 6,
          w: rightW,
          h: rightH,
          defaultData: {
            src: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=80",
            radius: 3,
          },
        },
        {
          type: "text",
          role: "caption",
          x: m,
          y: m + ch * 0.91,
          w: cw,
          h: 8,
          defaultData: {
            text: "Roadtrip through high mountain passes and hidden lakes.",
            font: "Inter",
            size: 8.5,
            weight: 400,
            align: "left",
            color: "#6B6B66",
          },
        },
      ];
    },
  },

  // L06: 4-Photo Collage Grid
  {
    id: "L06",
    name: "4-Photo Collage Grid",
    category: "collage",
    desc: "Harmonious 2x2 photo collage with even gutters.",
    slots: (dim) => {
      const m = dim.safeMarginMm;
      const cw = dim.widthMm - m * 2;
      const ch = dim.heightMm - m * 2;
      const colW = (cw - 6) / 2;
      const rowH = (ch - 6) / 2;
      return [
        {
          type: "image",
          role: "photo-1",
          x: m,
          y: m,
          w: colW,
          h: rowH,
          defaultData: {
            src: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80",
            radius: 3,
          },
        },
        {
          type: "image",
          role: "photo-2",
          x: m + colW + 6,
          y: m,
          w: colW,
          h: rowH,
          defaultData: {
            src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
            radius: 3,
          },
        },
        {
          type: "image",
          role: "photo-3",
          x: m,
          y: m + rowH + 6,
          w: colW,
          h: rowH,
          defaultData: {
            src: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&auto=format&fit=crop&q=80",
            radius: 3,
          },
        },
        {
          type: "image",
          role: "photo-4",
          x: m + colW + 6,
          y: m + rowH + 6,
          w: colW,
          h: rowH,
          defaultData: {
            src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
            radius: 3,
          },
        },
      ];
    },
  },

  // L07: Chapter Opener
  {
    id: "L07",
    name: "Chapter Opener",
    category: "text",
    desc: "Large numeral, bold serif chapter title, and introduction paragraph.",
    slots: (dim) => {
      const m = dim.safeMarginMm;
      const cw = dim.widthMm - m * 2;
      return [
        {
          type: "text",
          role: "chapter-num",
          x: m,
          y: dim.heightMm * 0.25,
          w: cw,
          h: 22,
          defaultData: {
            text: "CHAPTER 01",
            font: "Space Grotesk",
            size: 14,
            weight: 600,
            align: "center",
            letterSpacing: 2,
            color: "#B8A88A",
          },
        },
        {
          type: "text",
          role: "title",
          x: m,
          y: dim.heightMm * 0.32,
          w: cw,
          h: 26,
          defaultData: {
            text: "The Pink City Trails",
            font: "Playfair Display",
            size: 28,
            weight: 700,
            align: "center",
            color: "#1A1A1A",
          },
        },
        {
          type: "text",
          role: "intro",
          x: m + 10,
          y: dim.heightMm * 0.44,
          w: cw - 20,
          h: 40,
          defaultData: {
            text: "Stepping into old Jaipur feels like walking inside a watercolor painting. Every alley smells of cardamom tea and marigolds.",
            font: "Lora",
            size: 11,
            weight: 400,
            align: "center",
            lineHeight: 1.6,
            color: "#4A4A45",
          },
        },
      ];
    },
  },

  // L08: Quote Page
  {
    id: "L08",
    name: "Editorial Quote Page",
    category: "text",
    desc: "Inspiring centered quote with author attribution and decorative accents.",
    slots: (dim) => {
      const m = dim.safeMarginMm;
      const cw = dim.widthMm - m * 2;
      return [
        {
          type: "text",
          role: "quote-body",
          x: m + 8,
          y: dim.heightMm * 0.35,
          w: cw - 16,
          h: 40,
          defaultData: {
            text: "“To travel is to discover that everyone is wrong about other countries.”",
            font: "Playfair Display",
            size: 18,
            weight: 500,
            italic: true,
            align: "center",
            lineHeight: 1.5,
            color: "#1A1A1A",
          },
        },
        {
          type: "text",
          role: "author",
          x: m + 8,
          y: dim.heightMm * 0.35 + 46,
          w: cw - 16,
          h: 10,
          defaultData: {
            text: "Aldous Huxley",
            font: "Inter",
            size: 10,
            weight: 600,
            align: "center",
            letterSpacing: 1,
            color: "#8A7A66",
          },
        },
      ];
    },
  },

  // L09: Daily Diary
  {
    id: "L09",
    name: "Daily Diary (Date + Photo + Text)",
    category: "diary",
    desc: "Date badge, location pill, hero photo, and journal entry.",
    slots: (dim) => {
      const m = dim.safeMarginMm;
      const cw = dim.widthMm - m * 2;
      return [
        {
          type: "text",
          role: "date-badge",
          x: m,
          y: m,
          w: cw,
          h: 10,
          defaultData: {
            text: "FRIDAY, 24 OCTOBER 2026 · OLD HAVELI COURTYARD",
            font: "Inter",
            size: 8.5,
            weight: 600,
            letterSpacing: 1,
            color: "#7A1F2B",
            align: "left",
          },
        },
        {
          type: "image",
          role: "photo",
          x: m,
          y: m + 14,
          w: cw,
          h: (dim.heightMm - m * 2) * 0.44,
          defaultData: {
            src: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80",
            radius: 3,
          },
        },
        {
          type: "text",
          role: "body",
          x: m,
          y: m + 14 + (dim.heightMm - m * 2) * 0.47,
          w: cw,
          h: 45,
          defaultData: {
            text: "We spent the afternoon sketching arches in the courtyard while pigeons fluttered around the sandstone fountain. The light here stays warm until late evening.",
            font: "Caveat",
            size: 15,
            weight: 400,
            lineHeight: 1.5,
            color: "#1A1A1A",
            align: "left",
          },
        },
      ];
    },
  },

  // L10: Timeline of Moments
  {
    id: "L10",
    name: "Timeline of Moments",
    category: "diary",
    desc: "Sequential itinerary timeline with times and brief memories.",
    slots: (dim) => {
      const m = dim.safeMarginMm;
      const cw = dim.widthMm - m * 2;
      return [
        {
          type: "text",
          role: "title",
          x: m,
          y: m,
          w: cw,
          h: 12,
          defaultData: {
            text: "A Day in Motion",
            font: "Playfair Display",
            size: 20,
            weight: 600,
            align: "left",
          },
        },
        {
          type: "text",
          role: "event-1",
          x: m,
          y: m + 20,
          w: cw,
          h: 22,
          defaultData: {
            text: "07:30 AM · Sunrise at Jal Mahal\nThe lake was still like glass. Chai was served in clay cups.",
            font: "Inter",
            size: 9.5,
            weight: 400,
            lineHeight: 1.4,
          },
        },
        {
          type: "text",
          role: "event-2",
          x: m,
          y: m + 48,
          w: cw,
          h: 22,
          defaultData: {
            text: "01:00 PM · Johari Bazaar Spices\nFinding block-printed textiles and handmade paper notebooks.",
            font: "Inter",
            size: 9.5,
            weight: 400,
            lineHeight: 1.4,
          },
        },
        {
          type: "text",
          role: "event-3",
          x: m,
          y: m + 76,
          w: cw,
          h: 22,
          defaultData: {
            text: "06:45 PM · Nahargarh Fort Sunset\nWatched the entire city turn indigo as the desert stars appeared.",
            font: "Inter",
            size: 9.5,
            weight: 400,
            lineHeight: 1.4,
          },
        },
      ];
    },
  },

  // L11: Map / Place Card
  {
    id: "L11",
    name: "Map & Destination Card",
    category: "keepsake",
    desc: "Location place-card frame with coordinates and travel notes.",
    slots: (dim) => {
      const m = dim.safeMarginMm;
      const cw = dim.widthMm - m * 2;
      return [
        {
          type: "image",
          role: "map-image",
          x: m,
          y: m,
          w: cw,
          h: (dim.heightMm - m * 2) * 0.55,
          defaultData: {
            src: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80",
            radius: 4,
          },
        },
        {
          type: "text",
          role: "title",
          x: m,
          y: m + (dim.heightMm - m * 2) * 0.58,
          w: cw,
          h: 12,
          defaultData: {
            text: "26.9124° N, 75.7873° E · JAIPUR",
            font: "Space Grotesk",
            size: 11,
            weight: 600,
            letterSpacing: 1.5,
            color: "#7A1F2B",
          },
        },
        {
          type: "text",
          role: "notes",
          x: m,
          y: m + (dim.heightMm - m * 2) * 0.68,
          w: cw,
          h: 30,
          defaultData: {
            text: "Elevation: 431 m · Recommended for heritage walks, rooftop dinners, and winter stargazing.",
            font: "Inter",
            size: 10,
            weight: 400,
            lineHeight: 1.5,
            color: "#6B6B66",
          },
        },
      ];
    },
  },

  // L12: Ticket & Keepsake Page
  {
    id: "L12",
    name: "Ticket & Keepsake Page",
    category: "keepsake",
    desc: "Two polaroid/keepsake photo frames with tape and memory notes.",
    slots: (dim) => {
      const m = dim.safeMarginMm;
      const cw = dim.widthMm - m * 2;
      return [
        {
          type: "image",
          role: "keepsake-1",
          x: m + 5,
          y: m + 10,
          w: cw * 0.46,
          h: 58,
          rot: -4,
          defaultData: {
            src: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80",
            frame: "polaroid",
          },
        },
        {
          type: "image",
          role: "keepsake-2",
          x: m + cw * 0.5,
          y: m + 18,
          w: cw * 0.46,
          h: 58,
          rot: 3,
          defaultData: {
            src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
            frame: "polaroid",
          },
        },
        {
          type: "text",
          role: "memory-text",
          x: m,
          y: m + 85,
          w: cw,
          h: 30,
          defaultData: {
            text: "Museum tickets, dried bougainvillea petals, and train receipts tucked carefully between the pages.",
            font: "Caveat",
            size: 14,
            weight: 400,
            align: "center",
            color: "#4A4A45",
          },
        },
      ];
    },
  },

  // L13: Minimal Caption Page
  {
    id: "L13",
    name: "Minimal Caption Page",
    category: "photo",
    desc: "Generous whitespace with single centered portrait photo and quiet caption.",
    slots: (dim) => {
      const m = dim.safeMarginMm;
      const cw = dim.widthMm - m * 2;
      const ch = dim.heightMm - m * 2;
      return [
        {
          type: "image",
          role: "center-photo",
          x: m + cw * 0.1,
          y: m + ch * 0.08,
          w: cw * 0.8,
          h: ch * 0.72,
          defaultData: {
            src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80",
            radius: 2,
          },
        },
        {
          type: "text",
          role: "caption",
          x: m,
          y: m + ch * 0.84,
          w: cw,
          h: 8,
          defaultData: {
            text: "Silence before the mountain pass.",
            font: "Lora",
            size: 9,
            weight: 400,
            italic: true,
            align: "center",
            color: "#6B6B66",
          },
        },
      ];
    },
  },

  // L14: Text-Only / Handwriting Friendly
  {
    id: "L14",
    name: "Text-Only Journal",
    category: "text",
    desc: "Full-page lined journal layout typeset for personal handwritten entries.",
    slots: (dim) => {
      const m = dim.safeMarginMm;
      const cw = dim.widthMm - m * 2;
      return [
        {
          type: "text",
          role: "header",
          x: m,
          y: m + 5,
          w: cw,
          h: 12,
          defaultData: {
            text: "October 24 · Personal Journal",
            font: "Playfair Display",
            size: 18,
            weight: 600,
            align: "left",
          },
        },
        {
          type: "text",
          role: "body",
          x: m,
          y: m + 24,
          w: cw,
          h: dim.heightMm * 0.7,
          defaultData: {
            text: "Dear Diary,\n\nWe spent hours sitting on the steps by the water. I listened to people speaking in three different dialects while the bells tolled in the distance.\n\nTraveling alone teaches you to pay attention to details you would normally brush past: the smell of fresh clay cups, the exact hue of the sky before dusk, the quiet comfort of taking your time.",
            font: "Caveat",
            size: 14.5,
            weight: 400,
            lineHeight: 1.6,
            color: "#1A1A1A",
          },
        },
      ];
    },
  },

  // L15: Dedication / Blank
  {
    id: "L15",
    name: "Dedication / Opening Note",
    category: "text",
    desc: "Centered book dedication page with elegant serif typography.",
    slots: (dim) => {
      const m = dim.safeMarginMm;
      const cw = dim.widthMm - m * 2;
      return [
        {
          type: "text",
          role: "dedication",
          x: m + 10,
          y: dim.heightMm * 0.4,
          w: cw - 20,
          h: 30,
          defaultData: {
            text: "For everyone who chooses the longer, scenic route.",
            font: "Playfair Display",
            size: 15,
            weight: 500,
            italic: true,
            align: "center",
            color: "#1A1A1A",
            lineHeight: 1.5,
          },
        },
      ];
    },
  },
];

/**
 * Smart content reflow mapper (Day 12):
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
