export interface FontDefinition {
  name: string;
  category: "Serif Display" | "Serif Body" | "Sans" | "Display" | "Handwriting" | "Typewriter";
  weights: number[];
  sampleText?: string;
  isUserFont?: boolean;
}

export const FONTS: FontDefinition[] = [
  // User & Handwriting Fonts (Pinned at top)
  {
    name: "Caveat",
    category: "Handwriting",
    weights: [400, 700],
    sampleText: "A warm handwritten note from the journey",
  },
  {
    name: "Patrick Hand",
    category: "Handwriting",
    weights: [400],
    sampleText: "Casual handwriting style with playful curves",
  },
  {
    name: "Dancing Script",
    category: "Handwriting",
    weights: [400, 700],
    sampleText: "Flowing cursive handwriting with soft loops",
  },
  {
    name: "Great Vibes",
    category: "Handwriting",
    weights: [400],
    sampleText: "Elegant calligraphy for titles and romance",
  },

  // Typewriter
  {
    name: "Special Elite",
    category: "Typewriter",
    weights: [400],
    sampleText: "Vintage mechanical typewriter with worn ink",
  },

  // Serif Display
  {
    name: "Playfair Display",
    category: "Serif Display",
    weights: [400, 600, 700],
    sampleText: "Luxury editorial headlines and cover titles",
  },
  {
    name: "Cormorant Garamond",
    category: "Serif Display",
    weights: [400, 600, 700],
    sampleText: "Royal classic poise and traditional book design",
  },
  {
    name: "DM Serif Display",
    category: "Serif Display",
    weights: [400],
    sampleText: "Bold, modern transitional serif with high contrast",
  },

  // Serif Body
  {
    name: "Lora",
    category: "Serif Body",
    weights: [400, 500, 600, 700],
    sampleText: "Contemporary serif crafted for long stories and essays",
  },
  {
    name: "Libre Baskerville",
    category: "Serif Body",
    weights: [400, 700],
    sampleText: "Timeless classic literature typeset with clarity",
  },

  // Sans
  {
    name: "Inter",
    category: "Sans",
    weights: [300, 400, 500, 600, 700],
    sampleText: "Clean modern geometric sans for captions and notes",
  },
  {
    name: "DM Sans",
    category: "Sans",
    weights: [400, 500, 700],
    sampleText: "Approachable modern sans with low-contrast strokes",
  },
  {
    name: "Manrope",
    category: "Sans",
    weights: [400, 500, 600, 700],
    sampleText: "Sleek European geometric grotesque with open counters",
  },
  {
    name: "Poppins",
    category: "Sans",
    weights: [400, 500, 600, 700],
    sampleText: "Vibrant rounded geometric sans for modern posters",
  },
  {
    name: "Montserrat",
    category: "Sans",
    weights: [400, 500, 600, 700],
    sampleText: "Architectural urban typography inspired by street signs",
  },

  // Display
  {
    name: "Oswald",
    category: "Display",
    weights: [400, 500, 600, 700],
    sampleText: "Condensed bold display for adventure & dates",
  },
  {
    name: "Bebas Neue",
    category: "Display",
    weights: [400],
    sampleText: "ALL-CAPS BOLD ARCHIVAL HEADLINE",
  },
  {
    name: "Space Grotesk",
    category: "Display",
    weights: [400, 500, 600, 700],
    sampleText: "Monospace-flavored modern editorial design",
  },
];
