import { LayoutTemplate } from "./types";

export const COLLAGE_TEMPLATES: LayoutTemplate[] = [
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
];
