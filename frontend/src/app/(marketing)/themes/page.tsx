"use client";

import * as React from "react";
import Link from "next/link";
import { StoryboundLogo } from "@/components/ui/logo";
import { useAuth } from "@/lib/auth/auth-context";
import { ScrollReveal, ScrollToTopProgress } from "@/components/ui/scroll-reveal";
import { SvgBook, SvgCheck, SvgSparkle } from "@/components/ui/website-icons";

interface ThemeItem {
  id: string;
  name: string;
  category: "Travel" | "Couples" | "Friends" | "Minimal" | "Dark" | "Colorful";
  tag: string;
  desc: string;
  bg: string;
  primary: string;
  accent: string;
  swatches: string[];
  coverSubtitle?: string;
  isDark?: boolean;
  coverImg?: string;
}

const ALL_10_THEMES: ThemeItem[] = [
  {
    id: "minimal-memories",
    name: "Minimal Memories",
    category: "Minimal",
    tag: "Minimal · Journal",
    desc: "Clean layouts, generous white space, and quiet typography for timeless reflections.",
    bg: "#FAFAF8",
    primary: "#1A1A1A",
    accent: "#D1CEBE",
    swatches: ["#FAFAF8", "#1A1A1A", "#D1CEBE"],
    coverSubtitle: "FOLIO NO. 01",
  },
  {
    id: "vintage-journal",
    name: "Vintage Journal",
    category: "Travel",
    tag: "Travel · Vintage",
    desc: "Nostalgic kraft tones, traveler's notebook aesthetic with classic stamps and borders.",
    bg: "#EFE7DA",
    primary: "#2B2118",
    accent: "#7A5C3E",
    swatches: ["#EFE7DA", "#7A5C3E", "#2B2118"],
    coverSubtitle: "EST. MCMXXIV",
  },
  {
    id: "royal-india",
    name: "Royal India",
    category: "Travel",
    tag: "Travel · Heritage",
    desc: "Rich sandstone hues, palace archways, and warm regal golden details inspired by the Pink City.",
    bg: "#D2826F",
    primary: "#3B2621",
    accent: "#DDB976",
    swatches: ["#D2826F", "#DDB976", "#3B2621"],
    coverSubtitle: "JAIPUR CHRONICLES",
    coverImg:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCEbfcverIxgdvAjWuW2HeWC4nHD6brIKGTKsWHi475F_E53FjXpASQ79bdCyXe5C0dJ2gFC8_z7U7t-kMgkwMXN3GNncYlNrBc7r2ncmYVTGqSdN4-4nMYZzUBYxeJhd1GYNvG2B4bSaVi1xOHJlkM7cjlq6_hOAAUuvWmTBDHR72sxeaddjtgOIAy2AHdLZcQf15IssbfsQOYUZ5aKR_ltKwnqE6ridr05FGJGVqJYj5dLlTvtGFO",
  },
  {
    id: "modern-editorial",
    name: "Modern Editorial",
    category: "Travel",
    tag: "Magazine · Editorial",
    desc: "Magazine-style split layouts, bold typography pairings, and gallery-worthy spreads.",
    bg: "#F4F1DE",
    primary: "#2F3E46",
    accent: "#84A98C",
    swatches: ["#F4F1DE", "#2F3E46", "#84A98C"],
    coverSubtitle: "PHOTO ESSAY VOL. V",
  },
  {
    id: "polaroid-scrapbook",
    name: "Polaroid Scrapbook",
    category: "Friends",
    tag: "Friends · Playful",
    desc: "Casual tape accents, white-bordered photo cards, and carefree handwritten captions.",
    bg: "#F7F5EE",
    primary: "#262626",
    accent: "#FF8E72",
    swatches: ["#F7F5EE", "#FF8E72", "#4A6B82"],
    coverSubtitle: "SUMMER ROADTRIP",
  },
  {
    id: "nature-adventure",
    name: "Nature & Adventure",
    category: "Travel",
    tag: "Travel · Outdoors",
    desc: "Misty tea hills, winding trails, and earth-toned spreads made for the great outdoors.",
    bg: "#2C4A3E",
    primary: "#F2EFEB",
    accent: "#8FA89B",
    swatches: ["#2C4A3E", "#8FA89B", "#F2EFEB"],
    coverSubtitle: "WAYPOINTS & PEAKS",
    isDark: true,
    coverImg:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAb-1vHsG9SjJyaIzNDlaYUpKbMNmO7L9iDZh6oWbfvju0d3qU_P8lsAz7nlawpxpl3APq_07jS0LHJW4Ees_WaPuTOXOP2cjF1tw71oRMEaV9nwmmABd46-jul3tQcHFLomrydK3MCUfi5aSARG6IvH4u3VxV1zcJ2bUrst5hBcfQ7k9-qxHlRFd2pLpPl7F5eAvEeR0jKV93rEeoW9FRPQXso_0x9F6Y-FlCcT6SESfDCbsy3E1pP",
  },
  {
    id: "romantic-storybook",
    name: "Romantic Storybook",
    category: "Couples",
    tag: "Couples · Romance",
    desc: "Intimate love letters, gentle blush tones, and poetry-first chapter dividers.",
    bg: "#F5EBE6",
    primary: "#5A3E36",
    accent: "#C58B88",
    swatches: ["#F5EBE6", "#C58B88", "#5A3E36"],
    coverSubtitle: "CHAPTERS OF US",
  },
  {
    id: "colour-pop",
    name: "Colour Pop",
    category: "Colorful",
    tag: "Colorful · Travel",
    desc: "Vivid sunny palettes and expressive color blocks that make everyday adventures sing.",
    bg: "#E76F51",
    primary: "#FFFFFF",
    accent: "#2A9D8F",
    swatches: ["#E76F51", "#F4A261", "#2A9D8F"],
    coverSubtitle: "SUNSHINE & SPICE",
    isDark: true,
  },
  {
    id: "classic-literature",
    name: "Classic Literature",
    category: "Minimal",
    tag: "Editorial · Archival",
    desc: "Hardbound clothbound classic with gold embossed titles and chapter ornaments.",
    bg: "#1F2937",
    primary: "#F8F9FA",
    accent: "#C4A482",
    swatches: ["#1F2937", "#C4A482", "#F8F9FA"],
    coverSubtitle: "OXFORD CLOTHBOUND",
    isDark: true,
  },
  {
    id: "dark-luxury",
    name: "Dark Luxury",
    category: "Dark",
    tag: "Dark · Minimal",
    desc: "Moody nocturnal palettes, velvet textures, and luminous metallic gold highlights.",
    bg: "#121212",
    primary: "#FFFFFF",
    accent: "#D4AF37",
    swatches: ["#121212", "#D4AF37", "#333333"],
    coverSubtitle: "LIMITED EDITION",
    isDark: true,
  },
];

const CATEGORIES = ["All", "Travel", "Couples", "Friends", "Minimal", "Dark", "Colorful"] as const;

export default function ThemesGalleryPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  const filteredThemes = React.useMemo(() => {
    if (selectedCategory === "All") return ALL_10_THEMES;
    return ALL_10_THEMES.filter((t) => t.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-secondary-container selection:text-primary overflow-x-hidden">
      <ScrollToTopProgress />

      <header className="sticky top-0 z-50 w-full border-b border-surface-variant bg-surface/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Brand Logo */}
          <StoryboundLogo size="md" />

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-on-surface-variant">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-primary font-semibold border-b border-primary pb-0.5">
              10 Themes
            </span>
            <Link href="/#how-it-works" className="hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="/#pricing" className="hover:text-primary transition-colors">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="bg-primary text-on-primary text-xs sm:text-sm font-medium py-2 px-4 rounded-[10px] hover:bg-neutral-800 transition-colors shadow-sm"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs sm:text-sm font-medium text-on-surface-variant hover:text-primary px-3 py-1.5"
                >
                  Log In
                </Link>
                <Link
                  href="/books/new"
                  className="bg-primary text-on-primary text-xs sm:text-sm font-medium py-2 px-4 rounded-[10px] hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  Start Your Book
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="w-full">
        {/* Page Header Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center pt-14 pb-10">
          <ScrollReveal delay={50}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/40 border border-secondary/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span className="text-xs font-mono text-secondary tracking-wide uppercase font-semibold">
                Curated Design Foundations
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <h1 className="display-hero text-primary tracking-tight mb-3 font-normal">
              10 themes, one simple studio
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={250}>
            <p className="body-base text-on-surface-variant max-w-xl mx-auto mb-8">
              Pick a foundation. Change palettes, typography, and page spreads anytime in the editor without losing your written stories.
            </p>
          </ScrollReveal>

          {/* Filter Chips Row */}
          <ScrollReveal delay={300}>
            <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container-lowest border border-surface-variant text-on-surface-variant hover:border-outline hover:text-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* SPOTLIGHT: INSIDE SPREAD INTERACTIVE SIMULATOR (From Stitch)             */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <ScrollReveal direction="up" delay={150}>
            <div className="bg-surface-container-lowest border-2 border-primary/20 rounded-2xl p-6 lg:p-8 shadow-sm">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Left: Spread Preview Display */}
                <div className="w-full lg:w-3/5 bg-[#F4F1DE]/40 rounded-xl border border-surface-variant p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono bg-primary text-on-primary px-3 py-1 rounded-full">
                      <SvgBook size={13} className="text-on-primary" />
                      <span>Previewing Inside Spreads</span>
                    </span>
                    <span className="text-xs font-mono text-on-surface-variant">
                      Open Spread View · A5 Hardbound
                    </span>
                  </div>

                  {/* Open Book Spread Simulator */}
                  <div className="relative bg-white rounded-lg shadow-sm border border-[#E8E6E1] flex flex-col md:flex-row overflow-hidden min-h-[260px] deckled-edge">
                    {/* Left Page: Full bleed image */}
                    <div className="w-full md:w-1/2 relative min-h-[200px] border-b md:border-b-0 md:border-r border-[#E8E6E1]">
                      <img
                        alt="Munnar Tea Hills"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAb-1vHsG9SjJyaIzNDlaYUpKbMNmO7L9iDZh6oWbfvju0d3qU_P8lsAz7nlawpxpl3APq_07jS0LHJW4Ees_WaPuTOXOP2cjF1tw71oRMEaV9nwmmABd46-jul3tQcHFLomrydK3MCUfi5aSARG6IvH4u3VxV1zcJ2bUrst5hBcfQ7k9-qxHlRFd2pLpPl7F5eAvEeR0jKV93rEeoW9FRPQXso_0x9F6Y-FlCcT6SESfDCbsy3E1pP"
                      />
                      <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded">
                        04 // Dawn Ascent
                      </div>
                    </div>

                    {/* Right Page: Editorial columns with handwriting */}
                    <div className="w-full md:w-1/2 p-6 flex flex-col justify-between bg-[#FAFAF8]">
                      <div>
                        <div className="text-[11px] uppercase tracking-widest text-[#2F3E46] font-semibold mb-2">
                          Kerala High Ranges
                        </div>
                        <p className="font-serif italic text-xl text-[#2F3E46] leading-snug mb-3">
                          “Munnar at dawn — misty tea hills rolling like velvet emerald waves into the sun.”
                        </p>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          The fragrance of moist leaves hung heavy in the valley air. We began walking before the estate awoke, boots damp from morning dew.
                        </p>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono pt-4 border-t border-neutral-200">
                        <span>STORYBOUND CHRONICLES</span>
                        <span>Pg. 05</span>
                      </div>
                    </div>

                    {/* Book Center Crease Shadow */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -ml-4 pointer-events-none gutter-spine-gradient" />
                  </div>
                </div>

                {/* Right: Content & Controls */}
                <div className="w-full lg:w-2/5 flex flex-col justify-between h-full space-y-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-secondary font-semibold">
                        Featured Master Theme
                      </span>
                      <div className="flex items-center gap-1.5 ml-auto">
                        <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: "#2F3E46" }} />
                        <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: "#84A98C" }} />
                        <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: "#F4F1DE" }} />
                      </div>
                    </div>

                    <h3 className="font-serif text-3xl text-primary font-medium mb-3">
                      Modern Editorial
                    </h3>

                    <p className="body-base text-on-surface-variant mb-6">
                      Magazine-style split layouts, bold typography pairings, and gallery-worthy spreads designed for expansive photo essays and intimate recollections.
                    </p>

                    <div className="space-y-2 mb-6 text-sm text-on-surface-variant">
                      <div className="flex items-center gap-2">
                        <SvgCheck size={14} className="text-secondary shrink-0" />
                        <span>Full-bleed atmospheric photography integration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <SvgCheck size={14} className="text-secondary shrink-0" />
                        <span>Dual typographic hierarchy with cursive margin accents</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <SvgCheck size={14} className="text-secondary shrink-0" />
                        <span>Calibrated for both travel memoirs and family albums</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-surface-variant">
                    <Link
                      href="/books/new?theme=modern-editorial"
                      className="flex-1 text-center bg-primary hover:bg-neutral-800 text-on-primary py-3 px-6 rounded-[10px] font-medium text-sm transition-all shadow-sm active:scale-95"
                    >
                      Use this theme
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* THEMES GALLERY GRID (All 10 Themes with Spine Shadows)                   */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredThemes.map((theme, idx) => (
              <ScrollReveal key={theme.id} delay={idx * 80} direction="up">
                <div className="group bg-surface-container-lowest border border-surface-variant rounded-2xl p-5 hover:border-outline-variant transition-all duration-300 flex flex-col justify-between h-full shadow-sm hover:shadow-md">
                  <div>
                    {/* Book Cover Mockup Card */}
                    <div className="relative w-full aspect-[4/5] bg-surface-container-low rounded-xl p-6 flex items-center justify-center overflow-hidden mb-5">
                      <div
                        className="relative w-44 sm:w-48 h-60 sm:h-64 rounded-r-md border border-black/10 book-spine-shadow flex flex-col justify-between p-5 transition-transform duration-300 group-hover:scale-[1.03]"
                        style={{ backgroundColor: theme.bg }}
                      >
                        {theme.coverImg ? (
                          <>
                            <img
                              src={theme.coverImg}
                              alt={theme.name}
                              className="absolute inset-0 w-full h-full object-cover rounded-r-md"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-r-md" />
                            <div className="relative z-10 flex justify-between items-start text-xs font-mono text-[#DDB976]">
                              <SvgSparkle size={12} className="text-[#DDB976]" />
                              <span>VOL. I</span>
                            </div>
                            <div className="relative z-10 text-center">
                              <h4 className="font-serif text-lg text-white font-medium gold-foil">
                                {theme.name}
                              </h4>
                              <p className="text-[10px] font-mono text-[#DDB976]/90 mt-0.5 uppercase tracking-widest">
                                {theme.coverSubtitle}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
                              <div className="h-1.5 w-6 bg-neutral-300 rounded" />
                              <SvgSparkle size={12} className="text-neutral-400" />
                            </div>

                            <div className="text-center py-2">
                              <div className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 mb-1">
                                {theme.coverSubtitle || "FOLIO"}
                              </div>
                              <h4
                                className="font-serif text-lg font-medium leading-tight"
                                style={{ color: theme.primary }}
                              >
                                {theme.name}
                              </h4>
                              <div
                                className="h-0.5 w-8 mx-auto mt-2 rounded"
                                style={{ backgroundColor: theme.accent }}
                              />
                            </div>

                            <div className="text-[9px] text-center font-mono text-neutral-400 tracking-wider">
                              STORYBOUND PRESS
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Metadata & Swatches */}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-serif text-xl font-medium text-primary">
                        {theme.name}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        {theme.swatches.map((color, i) => (
                          <span
                            key={i}
                            className="w-3.5 h-3.5 rounded-full border border-black/10"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-on-surface-variant mb-4 leading-relaxed">
                      {theme.desc}
                    </p>
                  </div>

                  {/* Footer Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-surface-variant">
                    <span className="text-xs font-mono text-on-surface-variant">
                      {theme.tag}
                    </span>
                    <Link
                      href={`/books/new?theme=${theme.id}`}
                      className="bg-primary hover:bg-neutral-800 text-on-primary text-xs font-medium py-2 px-4 rounded-[8px] transition-colors shadow-xs active:scale-95"
                    >
                      Use this theme
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BOTTOM GUARANTEE & HELP STRIP                                            */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <ScrollReveal direction="up" delay={100}>
            <div className="bg-surface-container-lowest border border-surface-variant rounded-2xl p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-secondary mb-2 font-serif text-xl font-medium">
                  <SvgSparkle size={16} className="text-secondary" />
                  <span className="text-primary">Can't decide on a style right now?</span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  You can switch themes anytime in the studio without losing your written stories or uploaded photos. Every page automatically refits to your chosen layout format.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <Link
                  href="/books/new"
                  className="w-full sm:w-auto px-5 py-3 border border-surface-variant hover:bg-surface-container text-primary rounded-[10px] text-xs font-medium text-center transition-colors"
                >
                  Start blank canvas
                </Link>
                <Link
                  href="/books/new?theme=royal-india"
                  className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-neutral-800 text-on-primary rounded-[10px] text-xs font-medium text-center transition-colors shadow-sm"
                >
                  Start with Royal India
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low border-t border-surface-variant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <StoryboundLogo size="sm" />
            <span>© 2026 Storybound Press</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-primary">Home</Link>
            <Link href="/#pricing" className="hover:text-primary">Pricing</Link>
            <Link href="/#handwriting" className="hover:text-primary">Handwriting</Link>
            <Link href="/#faqs" className="hover:text-primary">FAQs</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
