import { LayoutTemplate } from "./types";

export const DIARY_TEMPLATES: LayoutTemplate[] = [
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

  // L14: Text-Only / Handwriting Friendly
  {
    id: "L14",
    name: "Text-Only Journal",
    category: "diary",
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
];
