import { LayoutTemplate } from "./types";

export const TEXT_TEMPLATES: LayoutTemplate[] = [
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
