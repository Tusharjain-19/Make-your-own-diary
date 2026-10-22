import { LayoutTemplate } from "./types";

export const PHOTO_TEMPLATES: LayoutTemplate[] = [
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

  // L04: 2-Photo Grid
  {
    id: "L04",
    name: "2-Photo Vertical Stack",
    category: "photo",
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
];
