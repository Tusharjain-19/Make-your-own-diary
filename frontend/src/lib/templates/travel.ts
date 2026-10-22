import { LayoutTemplate } from "./types";

export const TRAVEL_TEMPLATES: LayoutTemplate[] = [
  // T01: Travel Journal & Passport Stamp Log
  {
    id: "T01",
    name: "Passport Stamp & Travel Log",
    category: "travel",
    desc: "Authentic travel journal with destination header, polaroid photo, passport stamp, and travel notes.",
    slots: (dim) => {
      const m = dim.safeMarginMm;
      const cw = dim.widthMm - m * 2;
      return [
        {
          type: "text",
          role: "destination-tag",
          x: m,
          y: m,
          w: cw,
          h: 8,
          defaultData: {
            text: "✈ DESTINATION: JAIPUR, RAJASTHAN · DAY 02",
            font: "Space Grotesk",
            size: 8.5,
            weight: 600,
            letterSpacing: 1.2,
            color: "#7A1F2B",
            align: "left",
          },
        },
        {
          type: "text",
          role: "title",
          x: m,
          y: m + 10,
          w: cw,
          h: 12,
          defaultData: {
            text: "Exploring the Amber Fort Courtyards",
            font: "Playfair Display",
            size: 18,
            weight: 700,
            color: "#1A1A1A",
            align: "left",
          },
        },
        {
          type: "image",
          role: "travel-photo",
          x: m,
          y: m + 25,
          w: cw * 0.65,
          h: 76,
          defaultData: {
            src: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
            frame: "polaroid",
          },
        },
        {
          type: "shape",
          role: "passport-stamp",
          x: m + cw * 0.68,
          y: m + 32,
          w: cw * 0.32,
          h: 34,
          rot: -6,
          defaultData: {
            shape: "stamp-passport",
            stroke: "#7A1F2B",
            strokeW: 0.8,
          },
        },
        {
          type: "icon",
          role: "pin-icon",
          x: m + cw * 0.74,
          y: m + 72,
          w: 16,
          h: 16,
          defaultData: {
            iconId: "pin",
            color: "#7A1F2B",
          },
        },
        {
          type: "text",
          role: "journal-body",
          x: m,
          y: m + 106,
          w: cw,
          h: 46,
          defaultData: {
            text: "Climbing through the sunlit sandstone corridors felt like stepping backward three hundred years. The mirrored Sheesh Mahal reflected the afternoon lanterns like a galaxy of stars.",
            font: "Caveat",
            size: 14,
            weight: 400,
            lineHeight: 1.6,
            color: "#1A1A1A",
            align: "left",
          },
        },
      ];
    },
  },

  // T02: Travel Itinerary & Daily Chronicles
  {
    id: "T02",
    name: "Travel Itinerary & Highlights",
    category: "travel",
    desc: "Sequential itinerary schedule with times, destinations, and side keepsake photos.",
    slots: (dim) => {
      const m = dim.safeMarginMm;
      const cw = dim.widthMm - m * 2;
      return [
        {
          type: "text",
          role: "day-heading",
          x: m,
          y: m,
          w: cw,
          h: 12,
          defaultData: {
            text: "Morning Chai to Desert Stargazing",
            font: "Playfair Display",
            size: 20,
            weight: 700,
            color: "#1A1A1A",
          },
        },
        {
          type: "text",
          role: "stop-1",
          x: m,
          y: m + 18,
          w: cw * 0.58,
          h: 24,
          defaultData: {
            text: "08:00 AM · Hawa Mahal\nWatching the morning sun illuminate 953 pink latticed windows from the rooftop wind café.",
            font: "Inter",
            size: 9.5,
            weight: 400,
            lineHeight: 1.45,
          },
        },
        {
          type: "image",
          role: "photo-side-1",
          x: m + cw * 0.62,
          y: m + 18,
          w: cw * 0.38,
          h: 40,
          defaultData: {
            src: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop&q=80",
            radius: 3,
          },
        },
        {
          type: "text",
          role: "stop-2",
          x: m,
          y: m + 50,
          w: cw * 0.58,
          h: 24,
          defaultData: {
            text: "01:30 PM · Bapu Bazaar Wanders\nSearching for blue pottery plates and camel leather bound sketchbooks in the covered alleyways.",
            font: "Inter",
            size: 9.5,
            weight: 400,
            lineHeight: 1.45,
          },
        },
        {
          type: "image",
          role: "photo-side-2",
          x: m + cw * 0.62,
          y: m + 64,
          w: cw * 0.38,
          h: 40,
          defaultData: {
            src: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80",
            radius: 3,
          },
        },
        {
          type: "text",
          role: "stop-3",
          x: m,
          y: m + 82,
          w: cw * 0.58,
          h: 24,
          defaultData: {
            text: "06:30 PM · Sunset Over Jal Mahal\nThe water palace floated peacefully in Man Sagar Lake as the pink sandstone hill turned purple.",
            font: "Inter",
            size: 9.5,
            weight: 400,
            lineHeight: 1.45,
          },
        },
      ];
    },
  },

  // T03: Wanderlust Polaroid Wall
  {
    id: "T03",
    name: "Wanderlust Polaroid Trio",
    category: "travel",
    desc: "Trio of tilted polaroid snapshots with tape stickers and handwritten captions.",
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
          h: 10,
          defaultData: {
            text: "SNAPSHOTS OF THE EXPEDITION",
            font: "Space Grotesk",
            size: 10,
            weight: 600,
            letterSpacing: 2,
            color: "#6B6B66",
            align: "center",
          },
        },
        {
          type: "image",
          role: "polaroid-1",
          x: m + 2,
          y: m + 16,
          w: cw * 0.46,
          h: 62,
          rot: -4,
          defaultData: {
            src: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80",
            frame: "polaroid",
          },
        },
        {
          type: "image",
          role: "polaroid-2",
          x: m + cw * 0.5,
          y: m + 18,
          w: cw * 0.46,
          h: 62,
          rot: 3,
          defaultData: {
            src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
            frame: "polaroid",
          },
        },
        {
          type: "image",
          role: "polaroid-3",
          x: m + cw * 0.22,
          y: m + 84,
          w: cw * 0.54,
          h: 68,
          rot: -1.5,
          defaultData: {
            src: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&auto=format&fit=crop&q=80",
            frame: "polaroid",
          },
        },
        {
          type: "text",
          role: "footer-note",
          x: m,
          y: m + 160,
          w: cw,
          h: 10,
          defaultData: {
            text: "“Not all those who wander are lost.” — J.R.R. Tolkien",
            font: "Lora",
            size: 9.5,
            italic: true,
            color: "#6A5D43",
            align: "center",
          },
        },
      ];
    },
  },
];
