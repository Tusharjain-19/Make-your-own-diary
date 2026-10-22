"use client";

import * as React from "react";
import Link from "next/link";
import { StoryboundLogo } from "@/components/ui/logo";
import { MobileMenu } from "@/components/ui/mobile-menu";
import { useAuth } from "@/lib/auth/auth-context";
import { ScrollReveal, ScrollToTopProgress } from "@/components/ui/scroll-reveal";
import {
  SvgBook,
  SvgCheck,
  SvgSparkle,
  SvgQuill,
  SvgPhotoFrame,
  SvgTag,
  SvgEcoLeaf,
  SvgArrowRight,
  SvgStarRating,
} from "@/components/ui/website-icons";

const NAV_LINKS = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#handwriting", label: "My Handwriting" },
  { href: "#themes", label: "Themes" },
  { href: "#studio-preview", label: "Studio" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faqs", label: "FAQs" },
];

const SAMPLE_SPREADS = [
  {
    chapter: "Chapter 03 · Vol. II",
    title: "The Wind Palace",
    quote: "“Sunset over the pink terracotta roofs, Johari Bazaar, Nov 12”",
    badge: "Jaipur, Day 2",
    photoUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCU7_otCOcndaNtKMVZPYCnHarRBPA3P2_4yl_9v43ECzelohwuaXqobsSbpUbbQmfurkjnPItELAFdz_vthn-aoRvJnONUUERjRVEv5Gk3RnVBKCcOs5PZIl-UQWMBQ_uOPLyeFSLUv0iY43HI30iYVu9rilDzFSWkzik5xG3bU-duj04rDawQVIw3FXFxzAPiAyyhcKzL2KYakE6Pw8AxS5bCUelzQSysLcIlPNoGmLI6Lc_NWOvG",
    photoAlt: "Warm golden hour photograph of Hawa Mahal facade in Jaipur",
    prose:
      "We wandered through the narrow bazaar smelling crushed cardamom, marigold garlands, and roasted cumin. The sun fell like melted brass behind the ancient terracotta battlements.",
    pageLeft: 42,
    pageRight: 43,
  },
  {
    chapter: "Chapter 06 · High Ranges",
    title: "Misty Sunrise in Munnar",
    quote: "“Tea leaves damp with morning dew rolling like emerald waves into the mist.”",
    badge: "Kerala, Day 5",
    photoUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAb-1vHsG9SjJyaIzNDlaYUpKbMNmO7L9iDZh6oWbfvju0d3qU_P8lsAz7nlawpxpl3APq_07jS0LHJW4Ees_WaPuTOXOP2cjF1tw71oRMEaV9nwmmABd46-jul3tQcHFLomrydK3MCUfi5aSARG6IvH4u3VxV1zcJ2bUrst5hBcfQ7k9-qxHlRFd2pLpPl7F5eAvEeR0jKV93rEeoW9FRPQXso_0x9F6Y-FlCcT6SESfDCbsy3E1pP",
    photoAlt: "Serene misty green hills and tea plantations in Munnar",
    prose:
      "The estate was quiet save for the distant call of mountain kingfishers. We walked the winding ridge before breakfast, our woolen scarves damp from mountain fog.",
    pageLeft: 78,
    pageRight: 79,
  },
  {
    chapter: "Chapter 01 · Foothills",
    title: "Shimla Pine Shadows",
    quote: "“Smell of cedar woodsmoke and vintage railway steam whistling in the valley.”",
    badge: "Himachal, Day 1",
    photoUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdfewTutMg8B7lYFFEbl-lZPhnfmogEsfK5thRiGvc86Yx2BNr7y_ZhqE8NIXfyzYY-I0l9a6spuUxEMVdEyuzUzuPdQ7rhZDUuQ0E_E6dj7vn9r66nwIO8EaQmmG3jf5Rn6M4Cku31lLr5t8NFAlO6cTELxzjKldP68KWmd_m0WYScf5BvPdkTqGP4DFQhWxi691h3QRV7KUI3lokhVDTxlXfa-w9KWlSYFSQPjbehGZizGTNR5gb",
    photoAlt: "Vintage railway trails and pine forests in Shimla",
    prose:
      "The mountain toy train crept along stone viaducts built a century ago. We drank hot ginger chai from earthen cups while pine needles blanketed the quiet slopes.",
    pageLeft: 14,
    pageRight: 15,
  },
];

const THEMES_LIST = [
  {
    id: "royal-india",
    name: "Royal India",
    category: "Heritage",
    tag: "Signature",
    desc: "Palace arches, gold accents & marigold motifs inspired by Rajasthan.",
    bg: "#FAF7F2",
    primary: "#3B2621",
    accent: "#DDB976",
    swatches: ["#FAF7F2", "#DDB976", "#3B2621"],
    coverImg:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCEbfcverIxgdvAjWuW2HeWC4nHD6brIKGTKsWHi475F_E53FjXpASQ79bdCyXe5C0dJ2gFC8_z7U7t-kMgkwMXN3GNncYlNrBc7r2ncmYVTGqSdN4-4nMYZzUBYxeJhd1GYNvG2B4bSaVi1xOHJlkM7cjlq6_hOAAUuvWmTBDHR72sxeaddjtgOIAy2AHdLZcQf15IssbfsQOYUZ5aKR_ltKwnqE6ridr05FGJGVqJYj5dLlTvtGFO",
  },
  {
    id: "minimal-memories",
    name: "Minimal Memories",
    category: "Minimal",
    tag: "Modern",
    desc: "Clean whitespace, gallery grids & quiet typography for quiet travel.",
    bg: "#FAFAF8",
    primary: "#1A1A1A",
    accent: "#D1CEBE",
    swatches: ["#FAFAF8", "#1A1A1A", "#D1CEBE"],
    coverImg:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAb-1vHsG9SjJyaIzNDlaYUpKbMNmO7L9iDZh6oWbfvju0d3qU_P8lsAz7nlawpxpl3APq_07jS0LHJW4Ees_WaPuTOXOP2cjF1tw71oRMEaV9nwmmABd46-jul3tQcHFLomrydK3MCUfi5aSARG6IvH4u3VxV1zcJ2bUrst5hBcfQ7k9-qxHlRFd2pLpPl7F5eAvEeR0jKV93rEeoW9FRPQXso_0x9F6Y-FlCcT6SESfDCbsy3E1pP",
  },
  {
    id: "vintage-journal",
    name: "Vintage Journal",
    category: "Travel",
    tag: "Nostalgic",
    desc: "Warm sepia tones, deckled borders & traveler's notebook stamps.",
    bg: "#EFE7DA",
    primary: "#2B2118",
    accent: "#7A5C3E",
    swatches: ["#EFE7DA", "#7A5C3E", "#2B2118"],
    coverImg:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdfewTutMg8B7lYFFEbl-lZPhnfmogEsfK5thRiGvc86Yx2BNr7y_ZhqE8NIXfyzYY-I0l9a6spuUxEMVdEyuzUzuPdQ7rhZDUuQ0E_E6dj7vn9r66nwIO8EaQmmG3jf5Rn6M4Cku31lLr5t8NFAlO6cTELxzjKldP68KWmd_m0WYScf5BvPdkTqGP4DFQhWxi691h3QRV7KUI3lokhVDTxlXfa-w9KWlSYFSQPjbehGZizGTNR5gb",
  },
  {
    id: "modern-editorial",
    name: "Modern Editorial",
    category: "Magazine",
    tag: "Magazine",
    desc: "Bold serif headings, split photo essays & generous fashion bleeds.",
    bg: "#F4F1DE",
    primary: "#2F3E46",
    accent: "#84A98C",
    swatches: ["#F4F1DE", "#2F3E46", "#84A98C"],
    coverImg:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAVXKls0Mrpy0OQTVofsiIxwYNggXLwJmQNMsDvNwa0DiLZ5Iu8T43pDrz-2dMpt0ZAZ9JqH6v0xuSZny-8QU_m2O-bEHiDsjUSsGAIyFBb2E5fxuKoO9G1CmhzYklXYjvWycX19Tz41wNZyGWgfi2qgLJm6mTllokLcjESX92yd_Kfc8cPaG1nJeJPIDa--qYNX0HeW9CDBdr3WS0eHcYfDfn11Bk6oHGzjvJz1sNG1eR3R37kpsJw",
  },
  {
    id: "polaroid-scrapbook",
    name: "Polaroid Scrapbook",
    category: "Playful",
    tag: "Casual",
    desc: "Taped polaroid frames, cafe receipts & spontaneous margin notes.",
    bg: "#F7F5EE",
    primary: "#262626",
    accent: "#FF8E72",
    swatches: ["#F7F5EE", "#FF8E72", "#4A6B82"],
    coverImg:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXBjHJPGy-_JWdIZWS7biFyN-vR3kvVJy2EigWOFp_ZziIWLHPgtzXTL1qEGW2pktVS7XiFbDgD5mtCMyUN7lTtBSOvXgtdD6dMxWIRhRmtK3Ho_704dJmdHy6F07ze2aq1KF6vV9wPc2pLuaph5YnJ_TFzzNotnZx9nE-ybjM5DswIWHoI9X5Sn5IZNl-sL2gI_no11PQhXC7mkCfRZms9HahUHgeCLUhctX4azT5-DI-4tiqLrQg",
  },
];

export default function MarketingLandingPage() {
  const { user } = useAuth();

  // Hero Spread Switcher State
  const [activeHeroSpread, setActiveHeroSpread] = React.useState(0);
  const spread = SAMPLE_SPREADS[activeHeroSpread];

  // Handwriting Studio Demo State
  const [fontMode, setFontMode] = React.useState<"handwriting" | "typewriter" | "serif">("handwriting");
  const [userQuote, setUserQuote] = React.useState("“Dear Jaipur, your terracotta sunsets were magical.”");
  const [inkColor, setInkColor] = React.useState("#1A1A1A");

  // Studio Interactive Preview Tab
  const [studioTab, setStudioTab] = React.useState<"pages" | "photos" | "type" | "hand" | "elements">("pages");

  // Pricing Page Count Calculator State
  const [pageCount, setPageCount] = React.useState(24);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const faqs = [
    {
      q: "Do I pay anything to design my book?",
      a: "No, designing your book is 100% free forever. You can upload unlimited travel photos, arrange pages, customize spreads, and experiment with your handwriting font without entering any payment details. You only pay ₹50 when you decide to download your pristine, watermark-free 300 DPI PDF.",
    },
    {
      q: "How does the 'My Handwriting' font synthesis work?",
      a: "You download our simple single-page A4 template, write out the characters with any normal dark pen, and snap a clear photo with your phone. Our engine cleans perspective distortion, isolates strokes, normalizes baseline heights, and vectorizes your personal script into an installable digital font assigned strictly to your account.",
    },
    {
      q: "Can I print the PDF myself at a local print press?",
      a: "Yes! Our ₹50 export is a professional 300 DPI vector PDF formatted with standard 3mm bleed margins, embedded fonts, and CMYK color compatibility. You can walk into any local digital press or print shop and produce a gorgeous physical copy immediately.",
    },
    {
      q: "Can I order a printed hardcover book through Storybound?",
      a: "Yes! We offer museum-grade, clothbound hardcovers crafted with archival inks, 170 GSM fine-art textured matte paper, and lay-flat Smyth-sewn binding. Delivery is available to every pincode across India with protective packaging.",
    },
    {
      q: "Are my personal photos and handwriting kept private?",
      a: "Completely private and secure. Your uploaded photos, scanned sheets, and compiled handwriting fonts are encrypted and tied strictly to your private user account. We never sell, share, or use your photos or penmanship for AI model training.",
    },
    {
      q: "Can I make changes to my book after downloading the PDF?",
      a: "Yes. Your project remains fully editable in your account forever. If you notice a typo or want to swap a photo later, you can make updates anytime and re-export without hassle.",
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-secondary-container selection:text-primary overflow-x-hidden">
      <ScrollToTopProgress />

      {/* ========================================================================= */}
      {/* 1. STICKY TOP NAVBAR (Warm Editorial Stationery)                         */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 w-full border-b border-surface-variant bg-surface/90 backdrop-blur-md transition-all duration-150">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo & Wordmark */}
          <StoryboundLogo size="md" className="group" />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-7 text-sm font-medium text-on-surface-variant">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-primary transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center bg-primary text-on-primary font-medium text-xs sm:text-sm px-4 py-2 rounded-[10px] hover:bg-neutral-800 transition-colors shadow-sm"
              >
                Dashboard ({user.name.split(" ")[0]})
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex text-on-surface-variant font-medium text-sm hover:text-primary transition-colors px-2.5 py-1.5"
                >
                  Sign In
                </Link>
                <Link
                  href="/books/new"
                  className="inline-flex items-center justify-center bg-primary text-on-primary font-medium text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-[10px] hover:bg-neutral-800 transition-colors shadow-sm active:scale-98"
                >
                  Create Your Book
                </Link>
              </>
            )}

            {/* Mobile Navigation Drawer */}
            <MobileMenu
              links={NAV_LINKS}
              ctaHref={user ? "/dashboard" : "/books/new"}
              ctaLabel={user ? "Dashboard" : "Create Book"}
              secondaryHref={user ? "/books/new" : "/login"}
              secondaryLabel={user ? "New Book" : "Sign In"}
            />
          </div>
        </div>
      </header>

      <main>
        {/* ========================================================================= */}
        {/* 2. HERO SECTION WITH INTERACTIVE SPREAD FLIPPER                          */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-20 md:pt-16 md:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              {/* Left Column: Headline & Value Proposition */}
              <div className="lg:col-span-7 space-y-6">
                <ScrollReveal delay={50}>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container border border-surface-variant rounded-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                    <span className="text-xs font-mono tracking-wider uppercase text-secondary font-medium">
                      Your memories · Your voice · Your handwriting
                    </span>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={150}>
                  <h1 className="display-hero text-primary tracking-tight font-normal">
                    Turn your trips into a book you’ll hold forever.
                  </h1>
                </ScrollReveal>

                <ScrollReveal delay={250}>
                  <p className="body-lg text-on-surface-variant max-w-xl">
                    Design it with Canva-like simplicity, write in your own personal handwriting font, download a pristine 300 DPI PDF for ₹50, or order a luxury clothbound hardcover delivered across India.
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={350}>
                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <Link
                      href="/books/new"
                      className="inline-flex items-center justify-center bg-primary text-on-primary font-medium text-sm px-7 py-3 rounded-[10px] hover:bg-neutral-800 transition-all duration-150 shadow-sm active:scale-95"
                    >
                      Start for free
                    </Link>

                    <a
                      href="#themes"
                      className="inline-flex items-center justify-center bg-surface-container-lowest text-primary border border-surface-variant font-medium text-sm px-6 py-3 rounded-[10px] hover:bg-surface-container hover:border-primary transition-all duration-150"
                    >
                      Explore 10 themes
                    </a>

                    <div className="flex items-center gap-1.5 ml-2 text-xs font-medium text-on-surface-variant">
                      <SvgCheck size={14} className="text-secondary shrink-0" />
                      <span>No credit card required</span>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Right Column: Interactive Open Spread Preview */}
              <div className="lg:col-span-5 relative">
                <ScrollReveal direction="left" delay={200}>
                  {/* Subtle Card Backing Tilt */}
                  <div className="absolute -inset-2 bg-surface-container rounded-2xl rotate-1 -z-10 border border-surface-variant" />

                  {/* Open Book Spread Card */}
                  <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-[12px] border border-surface-variant shadow-[0_8px_30px_rgba(26,26,26,0.06)] relative overflow-hidden deckled-edge">
                    {/* Spine Accent Line */}
                    <div className="absolute inset-y-0 left-1/2 w-px bg-surface-variant -translate-x-1/2 pointer-events-none z-20" />

                    <div className="grid grid-cols-2 gap-4">
                      {/* Left Page: Travel Photography */}
                      <div className="space-y-3">
                        <div className="relative overflow-hidden rounded-[8px] border border-surface-variant aspect-[3/4] bg-surface-container-low group">
                          <img
                            src={spread.photoUrl}
                            alt={spread.photoAlt}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-2 left-2 bg-surface-container-lowest/90 backdrop-blur-sm px-2 py-0.5 rounded-[4px] border border-surface-variant text-[11px] font-mono text-on-surface">
                            {spread.badge}
                          </div>
                        </div>

                        <p className="font-serif italic text-sm sm:text-base text-primary leading-tight text-center px-1">
                          {spread.quote}
                        </p>
                      </div>

                      {/* Right Page: Editorial Prose & Script */}
                      <div className="flex flex-col justify-between py-1 pl-2">
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center border-b border-surface-variant pb-2">
                            <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                              {spread.chapter}
                            </span>
                            <span className="text-[11px] font-mono text-secondary">
                              300 DPI
                            </span>
                          </div>

                          <h3 className="font-serif text-[16px] sm:text-[18px] leading-tight text-primary font-medium">
                            {spread.title}
                          </h3>

                          <p className="text-xs text-on-surface-variant leading-relaxed">
                            {spread.prose}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-surface-variant flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <SvgQuill size={13} className="text-secondary" />
                            <span className="text-[11px] font-serif italic text-on-surface-variant">
                              In your true hand
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-on-surface-variant">
                            Pg. {spread.pageRight}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Spread Switcher Pill */}
                    <div className="mt-4 pt-3 border-t border-surface-variant flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-secondary font-medium">
                        <SvgBook size={13} className="text-secondary" />
                        <span>Sample Spread {activeHeroSpread + 1} of {SAMPLE_SPREADS.length}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        {SAMPLE_SPREADS.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveHeroSpread(i)}
                            className={`h-2 rounded-full transition-all ${
                              activeHeroSpread === i
                                ? "w-6 bg-secondary"
                                : "w-2 bg-surface-variant hover:bg-neutral-400"
                            }`}
                            title={`Switch to spread ${i + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. TRUST STRIP                                                           */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
          <ScrollReveal direction="up" delay={100}>
            <div className="w-full py-4 px-6 bg-surface-container rounded-[12px] border border-surface-variant flex flex-col md:flex-row items-center justify-around gap-4 text-center">
              <div className="flex items-center gap-2.5">
                <SvgSparkle size={14} className="text-primary" />
                <span className="text-sm font-medium text-primary">No design skills needed</span>
              </div>
              <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-surface-variant" />
              <div className="flex items-center gap-2.5">
                <SvgSparkle size={14} className="text-primary" />
                <span className="text-sm font-medium text-primary">100% Free to design & preview</span>
              </div>
              <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-surface-variant" />
              <div className="flex items-center gap-2.5">
                <SvgSparkle size={14} className="text-primary" />
                <span className="text-sm font-medium text-primary">Print-ready 300 DPI PDF for just ₹50</span>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* 4. HOW IT WORKS (4 STEPS)                                                */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-surface-variant" id="how-it-works">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <ScrollReveal delay={50}>
              <span className="text-xs font-mono uppercase tracking-widest text-secondary font-semibold">
                Process
              </span>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <h2 className="headline-lg text-primary">
                How Storybound works
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={250}>
              <p className="body-base text-on-surface-variant">
                From unorganized smartphone photos to a museum-quality heirloom, crafted in four serene steps.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: "01",
                title: "Choose a theme",
                desc: "Select from 10 curated themes tailored for road trips, royal heritage, solo treks, or honeymoon journals.",
                sub: "10 bespoke styles",
              },
              {
                num: "02",
                title: "Add photos & stories",
                desc: "Drag-and-drop pictures from phone roll or camera. Smart auto-layout snaps your spreads into perfect balance.",
                sub: "Auto-layout assisted",
              },
              {
                num: "03",
                title: "Write in your handwriting",
                desc: "Snap a photo of our simple template. We convert your true penmanship into an organic, editable digital font.",
                sub: "Proprietary font engine",
              },
              {
                num: "04",
                title: "Download or print",
                desc: "Instant print-ready 300 DPI vector PDF for ₹50, or choose a tactile hardbound cloth cover delivered to your door.",
                sub: "PDF ₹50 • Books from ₹999",
              },
            ].map((step, idx) => (
              <ScrollReveal key={step.num} delay={idx * 120} direction="up">
                <div className="bg-surface-container-lowest p-6 rounded-[12px] border border-surface-variant relative flex flex-col justify-between h-full hover:-translate-y-1 transition-transform duration-200 shadow-sm">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-serif text-2xl text-secondary font-medium">
                        {step.num}
                      </span>
                      <div className="w-8 h-8 rounded-[8px] bg-surface-container flex items-center justify-center text-xs font-mono text-primary">
                        <SvgCheck size={14} className="text-primary" />
                      </div>
                    </div>
                    <h3 className="font-serif text-lg text-primary font-medium mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-surface-variant text-xs font-mono text-secondary">
                    {step.sub}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. INTERACTIVE HANDWRITING SYNTHESIS STUDIO DEMO                         */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="handwriting">
          <ScrollReveal direction="up" delay={100}>
            <div className="bg-surface-container p-6 sm:p-10 md:p-12 rounded-[14px] border border-surface-variant grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Interactive Lined Paper Studio Demo (Col 7) */}
              <div className="lg:col-span-7 bg-surface-container-lowest p-6 md:p-8 rounded-[12px] border border-surface-variant shadow-md space-y-6">
                <div className="flex flex-wrap justify-between items-center border-b border-surface-variant pb-4 gap-3">
                  <div className="flex items-center gap-2">
                    <SvgQuill size={16} className="text-secondary" />
                    <span className="font-medium text-sm text-primary">
                      Handwriting Synthesis Engine
                    </span>
                  </div>

                  {/* Mode Selector */}
                  <div className="inline-flex p-1 bg-surface-container rounded-[8px] border border-surface-variant text-xs">
                    <button
                      onClick={() => setFontMode("handwriting")}
                      className={`px-3 py-1 rounded-[6px] font-medium transition-all ${
                        fontMode === "handwriting"
                          ? "bg-surface-container-lowest text-primary shadow-sm"
                          : "text-on-surface-variant hover:text-primary"
                      }`}
                    >
                      Handwriting
                    </button>
                    <button
                      onClick={() => setFontMode("typewriter")}
                      className={`px-3 py-1 rounded-[6px] font-medium transition-all ${
                        fontMode === "typewriter"
                          ? "bg-surface-container-lowest text-primary shadow-sm"
                          : "text-on-surface-variant hover:text-primary"
                      }`}
                    >
                      Typewriter
                    </button>
                    <button
                      onClick={() => setFontMode("serif")}
                      className={`px-3 py-1 rounded-[6px] font-medium transition-all ${
                        fontMode === "serif"
                          ? "bg-surface-container-lowest text-primary shadow-sm"
                          : "text-on-surface-variant hover:text-primary"
                      }`}
                    >
                      Editorial Serif
                    </button>
                  </div>
                </div>

                {/* Lined Paper Canvas */}
                <div
                  className="bg-[#FCFBF8] border border-surface-variant rounded-[8px] p-6 relative overflow-hidden"
                  style={{
                    backgroundImage: "repeating-linear-gradient(transparent, transparent 29px, #E8E6E1 30px)",
                  }}
                >
                  <div className="flex items-center justify-between text-xs text-on-surface-variant mb-4 font-mono">
                    <span>Sample Parchment • Ananya_Script</span>
                    <span className="text-secondary font-semibold">Confidence: 99.4%</span>
                  </div>

                  <p
                    className={`min-h-[100px] leading-[60px] text-primary transition-all duration-300 ${
                      fontMode === "handwriting"
                        ? "font-serif italic text-2xl sm:text-3xl"
                        : fontMode === "typewriter"
                        ? "font-mono text-xl sm:text-2xl"
                        : "font-serif text-2xl sm:text-3xl"
                    }`}
                    style={{ color: inkColor }}
                  >
                    {userQuote}
                  </p>

                  <div className="mt-4 pt-3 border-t border-dashed border-surface-variant flex flex-wrap items-center justify-between text-xs text-on-surface-variant gap-2">
                    <span className="font-mono text-[11px]">Extracted glyph set: 52 characters</span>
                    <span className="flex items-center gap-1.5 text-secondary font-medium">
                      <SvgCheck size={12} className="text-secondary" />
                      <span>Vectorized Kerning Active</span>
                    </span>
                  </div>
                </div>

                {/* Interactive Quote Input & Ink Swatches */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-text-muted">Type custom memory:</span>
                    <input
                      type="text"
                      value={userQuote}
                      onChange={(e) => setUserQuote(e.target.value)}
                      placeholder="Type your own story caption..."
                      className="flex-1 h-9 rounded-[8px] border border-surface-variant bg-surface px-3 text-xs text-text focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-text-muted pt-1">
                    <span>Ink Choice:</span>
                    <div className="flex items-center gap-2">
                      {[
                        { name: "Cardamom Black", hex: "#1A1A1A" },
                        { name: "Indigo Blue", hex: "#1E3A8A" },
                        { name: "Terracotta Rust", hex: "#83262E" },
                        { name: "Palace Gold", hex: "#8A6D3B" },
                      ].map((ink) => (
                        <button
                          key={ink.hex}
                          onClick={() => setInkColor(ink.hex)}
                          className={`h-5 w-5 rounded-full border transition-transform ${
                            inkColor === ink.hex ? "scale-125 border-primary shadow-sm" : "border-black/20"
                          }`}
                          style={{ backgroundColor: ink.hex }}
                          title={ink.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Narrative Story (Col 5) */}
              <div className="lg:col-span-5 space-y-6">
                <span className="text-xs font-mono uppercase tracking-widest text-secondary font-semibold">
                  Intimate Keepsakes
                </span>
                <h2 className="headline-lg text-primary">
                  Your handwriting, as a font.
                </h2>
                <p className="body-base text-on-surface-variant leading-relaxed">
                  Ordinary photobooks feel cold because standard computer typefaces divorce your memories from your voice. Storybound digitizes your personal penmanship so every caption, secret road route, and journal note retains the warmth of your actual hand.
                </p>

                <ul className="space-y-3 text-sm text-on-surface-variant">
                  <li className="flex items-start gap-2.5">
                    <SvgCheck size={14} className="text-secondary font-bold shrink-0 mt-0.5" />
                    <span>Natural pressure variance and organic character rotations.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <SvgCheck size={14} className="text-secondary font-bold shrink-0 mt-0.5" />
                    <span>Fully editable: fix typos without restarting on paper.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <SvgCheck size={14} className="text-secondary font-bold shrink-0 mt-0.5" />
                    <span>100% private: your font file belongs strictly to your account.</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <Link
                    href="/handwriting"
                    className="inline-flex items-center gap-2 bg-primary text-on-primary font-medium text-sm px-6 py-3 rounded-[10px] hover:bg-neutral-800 transition-colors shadow-sm"
                  >
                    <span>Try My Handwriting</span>
                    <SvgArrowRight size={13} className="inline-block" />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* 6. CURATED BOOK THEMES SHOWCASE                                          */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-surface-variant" id="themes">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <ScrollReveal delay={50}>
                <span className="text-xs font-mono uppercase tracking-widest text-secondary font-semibold">
                  Layout Gallery
                </span>
              </ScrollReveal>
              <ScrollReveal delay={150}>
                <h2 className="headline-lg text-primary mt-1">
                  Curated book themes
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={250}>
                <p className="body-base text-on-surface-variant mt-2 max-w-xl">
                  Designed by editorial bookmakers with calibrated margins, font pairings, and color tokens for every journey spirit.
                </p>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={200}>
              <Link
                href="/themes"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-secondary pb-1 border-b border-primary transition-colors"
              >
                <span>See all 10 themes</span>
                <SvgArrowRight size={13} className="inline-block" />
              </Link>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {THEMES_LIST.map((th, idx) => (
              <ScrollReveal key={th.id} delay={idx * 100} direction="up">
                <div className="bg-surface-container-lowest rounded-[12px] border border-surface-variant overflow-hidden group hover:-translate-y-1.5 transition-all duration-200 shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <div className="aspect-[3/4] bg-surface-container-low relative overflow-hidden border-b border-surface-variant">
                      <img
                        src={th.coverImg}
                        alt={th.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-surface-container-lowest/90 backdrop-blur-sm px-2 py-0.5 rounded-[4px] text-[11px] font-mono text-primary border border-surface-variant">
                        {th.tag}
                      </div>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif text-base text-primary font-medium">
                          {th.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          {th.swatches.map((color, i) => (
                            <span
                              key={i}
                              className="h-2.5 w-2.5 rounded-full border border-black/10"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {th.desc}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <Link
                      href={`/books/new?theme=${th.id}`}
                      className="block text-center w-full py-2 bg-surface-container-low hover:bg-primary hover:text-white rounded-[8px] text-xs font-medium text-primary transition-colors border border-surface-variant"
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
        {/* 7. CANVA-STYLE BOOK STUDIO PREVIEW (Interactive)                         */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="studio-preview">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <ScrollReveal delay={50}>
              <span className="text-xs font-mono uppercase tracking-widest text-secondary font-semibold">
                Studio Experience
              </span>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <h2 className="headline-lg text-primary">
                Simple like Canva. Made for books.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={250}>
              <p className="body-base text-on-surface-variant">
                No complex software. An intuitive browser studio built with physical book proportions, bleed boundaries, and spine folds.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal direction="up" delay={200}>
            {/* Editor Window Mockup */}
            <div className="bg-surface-container-lowest rounded-[14px] border border-surface-variant overflow-hidden shadow-[0_10px_35px_rgba(26,26,26,0.08)]">
              {/* Browser Header Bar */}
              <div className="bg-surface-container-low px-4 py-3 border-b border-surface-variant flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#E4E2DC] border border-outline-variant" />
                  <span className="w-3 h-3 rounded-full bg-[#E4E2DC] border border-outline-variant" />
                  <span className="w-3 h-3 rounded-full bg-[#E4E2DC] border border-outline-variant" />
                  <span className="ml-3 font-mono text-xs text-on-surface-variant">
                    Storybound Studio — Jaipur_Memoir_Final_v2
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-secondary flex items-center gap-1.5">
                    <SvgCheck size={12} className="text-secondary" />
                    <span>Saved to cloud</span>
                  </span>
                  <Link
                    href="/books/book-jaipur-101/edit"
                    className="px-3 py-1 bg-primary text-on-primary rounded-[6px] text-xs font-medium hover:bg-neutral-800 transition-colors"
                  >
                    Open Live Studio
                  </Link>
                </div>
              </div>

              {/* Editor Workspace: Left Rail + Canvas Area */}
              <div className="flex flex-col md:flex-row min-h-[460px]">
                {/* Side Toolbar (Left) */}
                <div className="w-full md:w-52 bg-surface-container-lowest border-r border-surface-variant p-3 flex md:flex-col justify-around md:justify-start gap-1">
                  {[
                    { id: "pages", label: "Pages (24)", icon: <SvgBook size={15} /> },
                    { id: "photos", label: "Photos", icon: <SvgPhotoFrame size={15} /> },
                    { id: "type", label: "Typography", icon: <span className="font-serif font-bold text-xs tracking-wider">Tt</span> },
                    { id: "hand", label: "Handwriting", icon: <SvgQuill size={15} /> },
                    { id: "elements", label: "Stickers & Stamps", icon: <SvgTag size={15} /> },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setStudioTab(tab.id as any)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-xs font-medium text-left w-full transition-colors ${
                        studioTab === tab.id
                          ? "bg-surface-container text-primary font-semibold shadow-xs"
                          : "text-on-surface-variant hover:bg-surface-container/60 hover:text-primary"
                      }`}
                    >
                      <span className="text-sm shrink-0">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Central Canvas Area: Dual Page Spread */}
                <div className="flex-1 bg-surface-container-low p-6 md:p-10 flex flex-col items-center justify-center relative">
                  <div className="w-full max-w-3xl bg-surface-container-lowest rounded-[8px] border border-surface-variant shadow-sm p-6 grid grid-cols-2 gap-6 relative">
                    {/* Gutter Fold Shadow */}
                    <div className="absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 gutter-spine-gradient pointer-events-none" />

                    {/* Left Spread Page */}
                    <div className="space-y-4 pr-3">
                      <div className="aspect-[4/3] rounded-[6px] overflow-hidden border border-surface-variant bg-surface-container">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS57UZFHvDDHha7Jk78wMVpi0w3X6LtTYc4PPHFqbdLf_WjVdKyu4PZbwL2--VWUOkCnMcb7lZFPOcZZ02O0S3Ga6qv2A_4VyUbM_NBygEBZmtx3Q48c7kuiPAlGPrPOKlWqiZ1X1sCodyShnZZPgPHenAdD1NlrsM8jprHBuovVYmuYKF7hl3MGkI4PfXMqSTRdlVnlY4qrrbhKHKjdGUBuiEjMJ2pnbqsJ23bxdFdp0_skfnAjs6"
                          alt="Nahargarh Fort overlooking Jaipur"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-28 bg-surface-container-highest rounded" />
                        <div className="h-2 w-full bg-surface-container-highest rounded" />
                        <div className="h-2 w-3/4 bg-surface-container-highest rounded" />
                      </div>
                      <span className="block text-right font-mono text-[11px] text-on-surface-variant">
                        Pg. 24
                      </span>
                    </div>

                    {/* Right Spread Page */}
                    <div className="space-y-4 pl-3 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-lg text-primary font-medium mb-2">
                          Nahargarh at Twilight
                        </h4>
                        <p className="font-serif italic text-xl sm:text-2xl text-primary leading-snug">
                          “We ordered two ginger chai glasses and watched Jaipur turn into a sea of amber lamps.”
                        </p>
                      </div>

                      <div>
                        <div className="p-2.5 border border-dashed border-secondary rounded-[6px] bg-surface-container-low/50 flex items-center gap-2 text-xs text-secondary">
                          <SvgCheck size={12} className="text-secondary" />
                          <span className="font-mono text-[11px]">Font: Ananya_Script_Regular</span>
                        </div>
                        <span className="block text-left font-mono text-[11px] text-on-surface-variant mt-3">
                          Pg. 25
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Canvas bottom specs strip */}
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-on-surface-variant">
                    <span>Spread: Pages 24 – 25</span>
                    <span>•</span>
                    <span>Format: A5 Hardbound (148 × 210 mm)</span>
                    <span>•</span>
                    <span>Zoom: 100%</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* 8. HONEST PRICING WITH DYNAMIC PAGE CALCULATOR                           */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-surface-variant" id="pricing">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <ScrollReveal delay={50}>
              <span className="text-xs font-mono uppercase tracking-widest text-secondary font-semibold">
                Honest Pricing
              </span>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <h2 className="headline-lg text-primary">
                Designed free. Permanent forever.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={250}>
              <p className="body-base text-on-surface-variant">
                Create without payment boundaries. Pay only when you’re ready to hold your printed pages.
              </p>
            </ScrollReveal>
          </div>

          {/* Page Calculator Slider */}
          <ScrollReveal direction="up" delay={150}>
            <div className="max-w-xl mx-auto mb-12 p-4 bg-surface-container rounded-[12px] border border-surface-variant flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-on-surface-variant">
                <span className="font-medium text-primary">Book Size Calculator:</span> {pageCount} pages (~{(pageCount / 2).toFixed(0)} spreads)
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  type="range"
                  min="20"
                  max="96"
                  step="4"
                  value={pageCount}
                  onChange={(e) => setPageCount(Number(e.target.value))}
                  className="w-full sm:w-44 accent-primary cursor-pointer"
                />
                <span className="font-mono text-xs font-bold w-12 text-right text-primary">
                  {pageCount}p
                </span>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Tier 1: Free Design */}
            <ScrollReveal delay={100} direction="up">
              <div className="bg-surface-container-lowest p-8 rounded-[12px] border border-surface-variant flex flex-col justify-between h-full shadow-xs">
                <div>
                  <div className="mb-4">
                    <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">
                      Design Phase
                    </span>
                    <h3 className="font-serif text-2xl text-primary mt-1 font-medium">Free Design</h3>
                  </div>

                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-4xl font-serif font-bold text-primary">₹0</span>
                    <span className="text-xs text-on-surface-variant">Free forever</span>
                  </div>

                  <p className="text-sm text-on-surface-variant mb-6 pb-6 border-b border-surface-variant">
                    Everything you need to gather memories, build custom layouts, and preview your complete book.
                  </p>

                  <ul className="space-y-3 text-sm text-on-surface">
                    <li className="flex items-center gap-2.5">
                      <SvgCheck size={14} className="text-secondary shrink-0" />
                      <span>Unlimited pages & photo uploads</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <SvgCheck size={14} className="text-secondary shrink-0" />
                      <span>Access to all 10 curated themes</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <SvgCheck size={14} className="text-secondary shrink-0" />
                      <span>Low-res watermarked flipbook preview</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <SvgCheck size={14} className="text-secondary shrink-0" />
                      <span>Auto-layout suggestions</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-surface-variant">
                  <Link
                    href="/books/new"
                    className="block text-center w-full bg-surface-container-lowest text-primary border border-surface-variant font-medium text-sm py-3 rounded-[10px] hover:bg-surface-container hover:border-primary transition-all"
                  >
                    Start Designing
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Tier 2: PDF Download (Featured) */}
            <ScrollReveal delay={200} direction="up">
              <div className="bg-surface-container-lowest p-8 rounded-[12px] border-2 border-primary relative flex flex-col justify-between h-full shadow-[0_8px_30px_rgba(26,26,26,0.08)]">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#B8A88A] text-on-primary px-3 py-1 rounded-[6px] text-xs font-mono font-medium tracking-wide uppercase">
                  Most Popular
                </div>

                <div>
                  <div className="mb-4">
                    <span className="text-xs font-mono uppercase tracking-wider text-secondary">
                      Digital Heirloom
                    </span>
                    <h3 className="font-serif text-2xl text-primary mt-1 font-medium">PDF Download</h3>
                  </div>

                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-4xl font-serif font-bold text-primary">₹50</span>
                    <span className="text-xs text-on-surface-variant">flat fee / single export</span>
                  </div>

                  <p className="text-sm text-on-surface-variant mb-6 pb-6 border-b border-surface-variant">
                    Instant print-ready production file you can archive indefinitely or print at your local press.
                  </p>

                  <ul className="space-y-3 text-sm text-on-surface">
                    <li className="flex items-center gap-2.5">
                      <SvgCheck size={14} className="text-secondary shrink-0" />
                      <span className="font-medium">Ultra-crisp 300 DPI vector resolution</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <SvgCheck size={14} className="text-secondary shrink-0" />
                      <span>Custom handwriting font conversion</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <SvgCheck size={14} className="text-secondary shrink-0" />
                      <span>Zero watermarks or brand overlays</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <SvgCheck size={14} className="text-secondary shrink-0" />
                      <span>3mm bleed & crop marks included</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <SvgCheck size={14} className="text-secondary shrink-0" />
                      <span>Free re-downloads for 14 days</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-surface-variant">
                  <Link
                    href="/books/new"
                    className="block text-center w-full bg-primary text-on-primary font-medium text-sm py-3 rounded-[10px] hover:bg-neutral-800 transition-colors shadow-sm"
                  >
                    Claim for ₹50
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Tier 3: Printed Hardcover Keepsake */}
            <ScrollReveal delay={300} direction="up">
              <div className="bg-surface-container-lowest p-8 rounded-[12px] border border-surface-variant flex flex-col justify-between h-full shadow-xs">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">
                        Tactile Keepsake
                      </span>
                      <h3 className="font-serif text-2xl text-primary mt-1 font-medium">Printed Hardcover</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-[4px] bg-surface-container text-secondary text-[11px] font-mono">
                      Orders Open
                    </span>
                  </div>

                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-4xl font-serif font-bold text-primary">₹999</span>
                    <span className="text-xs text-on-surface-variant">starting price</span>
                  </div>

                  <p className="text-sm text-on-surface-variant mb-6 pb-6 border-b border-surface-variant">
                    Museum-grade clothbound hardcovers crafted with archival inks and Smyth-sewn lay-flat binding.
                  </p>

                  <ul className="space-y-3 text-sm text-on-surface">
                    <li className="flex items-center gap-2.5">
                      <SvgCheck size={14} className="text-secondary shrink-0" />
                      <span>170 GSM fine-art textured matte paper</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <SvgCheck size={14} className="text-secondary shrink-0" />
                      <span>Lay-flat Smyth-sewn binding</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <SvgCheck size={14} className="text-secondary shrink-0" />
                      <span>Embossed gold or blind deboss titles</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <SvgCheck size={14} className="text-secondary shrink-0" />
                      <span>Free doorstep delivery across India</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-surface-variant">
                  <button
                    onClick={() => alert("Hardcover order fulfillment available for all completed books! Start designing free.")}
                    className="w-full bg-surface-container text-primary font-medium text-sm py-3 rounded-[10px] hover:bg-surface-variant transition-colors"
                  >
                    Order Physical Book
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>



        {/* ========================================================================= */}
        {/* 10. FAQ ACCORDION                                                        */}
        {/* ========================================================================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-surface-variant" id="faqs">
          <div className="text-center mb-12 space-y-2">
            <ScrollReveal delay={50}>
              <span className="text-xs font-mono uppercase tracking-widest text-secondary font-semibold">
                Assistance
              </span>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <h2 className="headline-lg text-primary">
                Frequently asked questions
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={250}>
              <p className="body-base text-on-surface-variant">
                Everything about font synthesis, print preparation, and ownership.
              </p>
            </ScrollReveal>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <ScrollReveal key={index} delay={index * 80} direction="up">
                  <div className="bg-surface-container-lowest rounded-[12px] border border-surface-variant transition-all overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex justify-between items-center p-5 text-left font-serif text-base font-medium text-primary hover:bg-surface-container-low/50 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <span className="text-lg transition-transform duration-200 text-on-surface-variant ml-4">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-sm text-on-surface-variant leading-relaxed border-t border-surface-variant/40 bg-[#FAF9F5]/40 animate-in">
                        {faq.a}
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 11. FINAL CTA BAND                                                       */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <ScrollReveal direction="up" delay={100}>
            <div className="bg-surface-container p-10 md:p-16 rounded-[14px] border border-surface-variant text-center relative overflow-hidden">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-lowest border border-surface-variant rounded-[10px] text-xs font-mono text-secondary">
                  <SvgSparkle size={14} className="text-secondary" />
                  <span>Cherish the Journey</span>
                </div>

                <h2 className="headline-lg text-primary">
                  Your next trip deserves a book.
                </h2>

                <p className="body-lg text-on-surface-variant max-w-lg mx-auto">
                  Start designing in minutes. No credit card required. Free to create, download your first keepsake PDF for ₹50.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/books/new"
                    className="inline-flex items-center justify-center bg-primary text-on-primary font-medium text-sm px-8 py-3.5 rounded-[10px] hover:bg-neutral-800 transition-colors shadow-sm active:scale-95"
                  >
                    Create Your Book
                  </Link>
                  <Link
                    href="/themes"
                    className="inline-flex items-center justify-center bg-surface-container-lowest text-primary border border-surface-variant font-medium text-sm px-6 py-3.5 rounded-[10px] hover:bg-surface-container hover:border-primary transition-all"
                  >
                    Explore 10 Themes
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* 12. FOOTER (Warm Editorial Stationery)                                    */}
      {/* ========================================================================= */}
      <footer className="w-full bg-surface-container-low border-t border-surface-variant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6 w-full">
          {/* Left Brand & Copyright */}
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <StoryboundLogo size="sm" />
            </div>
            <p className="text-xs text-on-surface-variant">
              © 2026 Storybound Stationery & Press. Handcrafted for memories that endure.
            </p>
            <div className="text-[11px] font-mono text-secondary flex items-center justify-center md:justify-start gap-1.5">
              <SvgEcoLeaf size={14} className="text-secondary" />
              <span>Printed on recycled FSC-certified archival paper</span>
            </div>
          </div>

          {/* Links Cluster */}
          <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-xs text-on-surface-variant">
            <Link href="/themes" className="hover:text-primary transition-colors">
              Journal Formats
            </Link>
            <a href="#pricing" className="hover:text-primary transition-colors">
              Print Specifications
            </a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">
              Font Conversion
            </a>
            <a href="#pricing" className="hover:text-primary transition-colors">
              Shipping & Delivery
            </a>
            <a href="#faqs" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
