import { LayoutTemplate } from "./types";

export const GRID_TEMPLATES: LayoutTemplate[] = [
  // L06: 4-Photo Collage Grid
  {
    id: "L06",
    name: "4-Photo Collage Grid",
    category: "grid",
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
];
