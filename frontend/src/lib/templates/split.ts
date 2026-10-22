import { LayoutTemplate } from "./types";

export const SPLIT_TEMPLATES: LayoutTemplate[] = [
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
];
