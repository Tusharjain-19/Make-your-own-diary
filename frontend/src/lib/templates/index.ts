import { LayoutTemplate } from "./types";
import { COVER_TEMPLATES } from "./covers";
import { TRAVEL_TEMPLATES } from "./travel";
import { PHOTO_TEMPLATES } from "./photo";
import { SPLIT_TEMPLATES } from "./split";
import { GRID_TEMPLATES } from "./grid";
import { DIARY_TEMPLATES } from "./diary";
import { COLLAGE_TEMPLATES } from "./collage";
import { TEXT_TEMPLATES } from "./text";

export * from "./types";
export * from "./reflow";
export * from "./covers";
export * from "./travel";
export * from "./photo";
export * from "./split";
export * from "./grid";
export * from "./diary";
export * from "./collage";
export * from "./text";

export const LAYOUT_TEMPLATES: LayoutTemplate[] = [
  // Covers
  ...COVER_TEMPLATES,
  // Travel & Adventure
  ...TRAVEL_TEMPLATES,
  // Photo & Visual
  ...PHOTO_TEMPLATES,
  // Split photo & narrative
  ...SPLIT_TEMPLATES,
  // Grid
  ...GRID_TEMPLATES,
  // Diary & Journaling
  ...DIARY_TEMPLATES,
  // Keepsake & Collage
  ...COLLAGE_TEMPLATES,
  // Editorial & Text
  ...TEXT_TEMPLATES,
];
