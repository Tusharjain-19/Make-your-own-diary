import themesData from "./themes.json";
import layoutsData from "./layouts.json";

export interface ThemePalette {
  bg: string;
  surface: string;
  primary: string;
  accent: string;
  text: string;
  muted: string;
}

export interface ThemeFonts {
  heading: string;
  body: string;
  accent: string;
}

export interface ThemeDefaults {
  marginMm: number;
  headingSize: number;
  bodySize: number;
  lineHeight: number;
}

export interface ThemeDefinition {
  id: string;
  name: string;
  palette: ThemePalette;
  fonts: ThemeFonts;
  defaults: ThemeDefaults;
  layouts: string[];
  decor: string[];
  cover: {
    templates: string[];
  };
}

export interface LayoutDefinition {
  id: string;
  name: string;
  category: string;
  slots: string[];
}

export const themes: ThemeDefinition[] = themesData as ThemeDefinition[];
export const layouts: LayoutDefinition[] = layoutsData as LayoutDefinition[];

export function getThemeById(id: string): ThemeDefinition | undefined {
  return themes.find((t) => t.id === id);
}

export function getLayoutById(id: string): LayoutDefinition | undefined {
  return layouts.find((l) => l.id === id);
}
