"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  PenTool,
  CheckCircle2,
  ChevronDown,
  FileText,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MobileMenu } from "@/components/ui/mobile-menu";
import { useAuth } from "@/lib/auth/auth-context";
import { themes } from "@/lib/themes";

const NAV_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "/themes", label: "10 Themes" },
  { href: "#handwriting", label: "My Handwriting" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function MarketingLandingPage() {
  const { user } = useAuth();
  const [selectedThemeIndex, setSelectedThemeIndex] = React.useState(0);
  const activeTheme = themes[selectedThemeIndex] || themes[0];

  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const faqs = [
    {
      q: "How does the 'My Handwriting' font feature work?",
      a: "You download and print our simple A4 glyph template sheet, write out the characters (A–Z, a–z, 0–9, and punctuation) with a dark pen, and take a photo with your phone. Our app corrects the perspective, cleans the ink strokes, vectorizes the glyphs, and compiles a real font file saved exclusively to your account.",
    },
    {
      q: "What page sizes are supported?",
      a: "Storybound supports A5 Portrait (148 × 210 mm — perfect for travel diaries), A4 Portrait (210 × 297 mm — great for family albums), and Square (203 × 203 mm / 8×8 in — ideal for Instagram-style collages). All units inside the editor are stored in exact millimeters.",
    },
    {
      q: "How much does the PDF export cost?",
      a: "Designing your book and previewing the full flipbook is completely free. When you're ready, you can download an unwatermarked, 300 DPI print-ready PDF for ₹50 (flat fee via UPI or Card). You also get 7 days of free re-exports for any subsequent edits.",
    },
    {
      q: "Can I order a printed physical book?",
      a: "Yes! We are currently preparing manual fulfillment for linen-bound hardcovers with archival photo paper. You can start designing today, download your PDF, and order hardcovers directly through your dashboard.",
    },
    {
      q: "Are my photos and handwriting private?",
      a: "Completely. Your photos, handwriting sheets, and compiled fonts are kept strictly in private user storage. They are never shared publicly or used for training without your consent.",
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent-soft selection:text-text overflow-x-hidden">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-accent text-white shadow-sm">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="font-serif text-lg font-semibold tracking-tight text-accent">
              Storybound
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-text-muted">
            <Link href="#how-it-works" className="hover:text-text transition-colors">
              How it works
            </Link>
            <Link href="/themes" className="hover:text-text transition-colors">
              10 Themes
            </Link>
            <Link href="#handwriting" className="hover:text-text transition-colors">
              My Handwriting
            </Link>
            <Link href="#pricing" className="hover:text-text transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="hover:text-text transition-colors">
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard">
                <Button size="sm">Dashboard ({user.name.split(" ")[0]})</Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:inline-flex">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup" className="hidden sm:inline-flex">
                  <Button size="sm" className="text-xs">
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu */}
            <MobileMenu
              links={NAV_LINKS}
              ctaHref={user ? "/dashboard" : "/signup"}
              ctaLabel={user ? "Dashboard" : "Get Started"}
              secondaryHref={user ? "/books/new" : "/login"}
              secondaryLabel={user ? "New Book" : "Sign In"}
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20 md:pt-24 md:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-muted shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            The Personal Book Studio
          </div>

          <h1 className="mx-auto max-w-4xl font-serif text-3xl font-normal tracking-tight text-text sm:text-5xl md:text-6xl lg:text-7xl leading-[1.12]">
            Your memories. Your stories. <br className="hidden sm:block" />
            <span className="italic font-light text-accent">Your handwriting.</span> Your book.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-text-muted sm:mt-6 sm:text-base lg:text-lg">
            Turn phone photos into a keepsake hardcover or print-ready PDF. Designed in minutes with a
            Canva-like editor, styled with 10 editorial themes, and typeset in your own personal handwriting font.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 sm:mt-8">
            <Link href={user ? "/books/new" : "/signup"}>
              <Button size="lg" className="w-full sm:w-auto h-12 px-7 text-sm font-medium gap-2">
                Start your story — Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/themes">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-6 text-sm">
                Explore 10 Themes
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Free to design
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" /> ₹50 PDF download
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Printed hardcovers
            </span>
          </div>

          {/* Hero Visual Mockup: Two-page spread */}
          <div className="mt-10 sm:mt-14 mx-auto max-w-4xl rounded-[14px] border border-border bg-surface p-3 sm:p-8 shadow-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-[10px] border border-border/80 bg-bg p-4 sm:p-6 text-left shadow-inner">
              {/* Left page: Photo Spread */}
              <div className="space-y-4 border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0 md:pr-6 flex flex-col justify-between">
                <div className="relative aspect-[4/3] rounded-[8px] bg-accent-soft/70 border border-border flex items-center justify-center overflow-hidden">
                  <div className="text-center p-4">
                    <span className="rounded-full bg-surface px-2.5 py-0.5 text-[10px] font-mono text-text-muted uppercase">
                      148 × 210 mm · A5
                    </span>
                    <p className="mt-2 font-serif text-base sm:text-lg text-accent">Hawa Mahal, Jaipur</p>
                    <p className="text-xs text-text-muted">Golden hour glow · 26.9239° N, 75.8267° E</p>
                  </div>
                </div>
                <div className="text-xs text-text-muted font-mono flex justify-between">
                  <span>Page 04</span>
                  <span>Royal India Theme</span>
                </div>
              </div>

              {/* Right page: Story & Handwriting */}
              <div className="space-y-4 md:pl-2 flex flex-col justify-between">
                <div>
                  <div className="font-serif text-lg sm:text-xl font-medium text-accent">
                    The Winds of Jaipur
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-text font-serif italic">
                    &ldquo;We climbed the narrow steps just before sunset. The pink sandstone walls seemed to catch fire in the evening amber, whispering tales from three centuries ago.&rdquo;
                  </p>
                  <div className="mt-4 rounded-[8px] border border-dashed border-border p-3 bg-surface">
                    <div className="flex items-center gap-2 text-xs font-medium text-accent">
                      <PenTool className="h-3.5 w-3.5 text-accent" />
                      <span>Typeset in Tushar&apos;s Handwriting</span>
                    </div>
                    <p className="mt-1 font-serif text-xs text-text-muted">
                      Every character mapped from the user&apos;s handwritten template.
                    </p>
                  </div>
                </div>
                <div className="text-xs text-text-muted font-mono flex justify-between">
                  <span>Chapter 01</span>
                  <span>Page 05</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step How It Works */}
      <section id="how-it-works" className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Simple 3-Step Workflow
            </h2>
            <p className="mt-2 font-serif text-2xl font-medium tracking-tight text-text sm:text-3xl md:text-4xl">
              From phone gallery to coffee table book
            </p>
            <p className="mt-3 text-sm text-text-muted">
              No design experience required. Our editor handles margins, bleeds, and typography automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="rounded-[10px] border border-border bg-bg p-5 sm:p-6 space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-accent text-white font-mono text-sm font-semibold">
                01
              </div>
              <h3 className="font-serif text-xl font-medium text-text">Choose size &amp; theme</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Select from A5, A4, or Square formats and pick one of our 10 minimal, calm themes. 20 pre-formatted pages are prepared instantly.
              </p>
              <div className="text-xs font-mono text-text-muted">
                15 standard layouts · 10 color palettes
              </div>
            </div>

            <div className="rounded-[10px] border border-border bg-bg p-5 sm:p-6 space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-accent text-white font-mono text-sm font-semibold">
                02
              </div>
              <h3 className="font-serif text-xl font-medium text-text">Add photos &amp; handwriting</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Drag-and-drop your travel memories. Write your story in your own authentic handwriting font, or pick from our curated typography collection.
              </p>
              <div className="text-xs font-mono text-text-muted">
                A4 glyph sheet · Auto perspective warp
              </div>
            </div>

            <div className="rounded-[10px] border border-border bg-bg p-5 sm:p-6 space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-accent text-white font-mono text-sm font-semibold">
                03
              </div>
              <h3 className="font-serif text-xl font-medium text-text">Export PDF or order print</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Download a clean, vector 300 DPI PDF for ₹50, or order a custom linen-bound hardcover book shipped directly to your doorstep.
              </p>
              <div className="text-xs font-mono text-text-muted">
                ₹50 PDF · 7-day free re-export
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Carousel / Showcase Section */}
      <section className="border-t border-border bg-bg py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 sm:mb-12">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Curated Aesthetics
              </h2>
              <p className="mt-2 font-serif text-2xl font-medium tracking-tight text-text sm:text-3xl md:text-4xl">
                10 minimal design themes
              </p>
              <p className="mt-1 text-sm text-text-muted">
                Each theme includes tailored color palettes, paired fonts, and cover templates.
              </p>
            </div>
            <Link href="/themes" className="mt-4 sm:mt-0">
              <Button variant="outline" size="sm">
                View all 10 in gallery <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {/* Theme Selector Strip */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {themes.map((theme, idx) => (
              <button
                key={theme.id}
                onClick={() => setSelectedThemeIndex(idx)}
                className={`flex shrink-0 items-center gap-2 rounded-[8px] border px-3 py-2 text-xs font-medium transition-all ${
                  selectedThemeIndex === idx
                    ? "border-accent bg-accent text-white shadow-sm"
                    : "border-border bg-surface text-text hover:bg-accent-soft"
                }`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full border border-black/20"
                  style={{ backgroundColor: theme.palette.accent }}
                />
                {theme.name}
              </button>
            ))}
          </div>

          {/* Selected Theme Preview Card */}
          <div className="mt-6 rounded-[12px] border border-border bg-surface p-4 sm:p-8 shadow-card">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="rounded-full border border-border bg-accent-soft px-2.5 py-0.5 text-xs font-mono text-text-muted">
                  Theme {selectedThemeIndex + 1} of 10
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-text">
                  {activeTheme.name}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Tailored for clean storytelling with {activeTheme.fonts.heading} for display titles and{" "}
                  {activeTheme.fonts.body} for readable story paragraphs.
                </p>

                <div className="space-y-2 pt-2">
                  <div className="text-xs font-medium uppercase tracking-wider text-text-muted">
                    Palette Swatches:
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-12 rounded border border-border" style={{ backgroundColor: activeTheme.palette.bg }} title="Background" />
                    <span className="h-6 w-12 rounded border border-border" style={{ backgroundColor: activeTheme.palette.primary }} title="Primary" />
                    <span className="h-6 w-12 rounded border border-border" style={{ backgroundColor: activeTheme.palette.accent }} title="Accent" />
                    <span className="h-6 w-12 rounded border border-border" style={{ backgroundColor: activeTheme.palette.text }} title="Text" />
                  </div>
                </div>

                <div className="pt-2">
                  <Link href={`/books/new?theme=${activeTheme.id}`}>
                    <Button size="sm">
                      Create a book with {activeTheme.name}
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 rounded-[10px] border border-border p-4 sm:p-6 shadow-inner" style={{ backgroundColor: activeTheme.palette.bg }}>
                <div className="rounded-[8px] bg-white p-4 sm:p-6 shadow-sm border border-border max-w-sm mx-auto text-center space-y-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-text-muted">
                    Sample Cover
                  </span>
                  <div className="font-serif text-xl sm:text-2xl font-semibold" style={{ color: activeTheme.palette.primary }}>
                    WANDERLUST
                  </div>
                  <div className="text-xs text-text-muted" style={{ color: activeTheme.palette.muted }}>
                    Memories from the Golden Triangle
                  </div>
                  <div className="h-0.5 w-12 mx-auto rounded" style={{ backgroundColor: activeTheme.palette.accent }} />
                  <div className="text-[11px] font-mono text-text-muted">2026 Edition</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Feature: My Handwriting Teaser */}
      <section id="handwriting" className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-[14px] border border-border bg-bg p-5 sm:p-8 md:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                  <PenTool className="h-4 w-4" />
                  Our Signature Feature
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-text">
                  Write the book in your own handwriting
                </h2>
                <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                  Generic computer fonts cannot capture the intimate feeling of a real personal diary.
                  With Storybound, print our simple 1-page template, jot down the alphabet, take a photo with your phone,
                  and write all your book stories in your personal font.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-start gap-2.5 text-xs text-text-muted">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span>Works with phone camera scans</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-text-muted">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span>Perspective correction &amp; auto-warp</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-text-muted">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span>Stored private to your account</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-text-muted">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span>Embedded seamlessly into high-res PDF</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-3">
                  <Link href={user ? "/handwriting" : "/signup"}>
                    <Button size="sm">Try Handwriting Studio</Button>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 rounded-[10px] border border-border bg-surface p-4 sm:p-6 shadow-card space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="font-serif text-sm font-medium">Font Preview</span>
                  <span className="rounded bg-accent-soft px-2 py-0.5 text-[10px] font-mono text-text-muted">
                    90 Glyphs Extracted
                  </span>
                </div>
                <div className="rounded-[8px] bg-accent-soft/40 p-4 border border-border/80">
                  <p className="font-serif italic text-lg leading-relaxed text-accent">
                    &ldquo;Some memories are too precious to be written in Helvetica.&rdquo;
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-text-muted">
                    <span>— Tushar&apos;s Hand</span>
                    <span>UnitsPerEm: 1000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="border-t border-border bg-bg py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Transparent Pricing
            </h2>
            <p className="mt-2 font-serif text-2xl font-medium tracking-tight text-text sm:text-3xl md:text-4xl">
              Free to design. Pay only when you love it.
            </p>
            <p className="mt-2 text-sm text-text-muted">
              No subscription traps. Pay once per book export or physical order.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
            {/* Free */}
            <Card className="flex flex-col justify-between border border-border bg-surface p-5 sm:p-6 shadow-sm">
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Design &amp; Preview
                </span>
                <div className="font-serif text-3xl font-medium text-text">₹0</div>
                <p className="text-xs text-text-muted">
                  Full access to create and design books without any commitments.
                </p>
                <div className="space-y-2 pt-2 border-t border-border text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Canva-like book canvas editor
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" /> All 10 themes &amp; 15 layouts
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" /> 3D flipbook spread preview
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Link href={user ? "/books/new" : "/signup"}>
                  <Button variant="outline" className="w-full">
                    Start Free
                  </Button>
                </Link>
              </div>
            </Card>

            {/* ₹50 PDF Download (Featured) */}
            <Card className="flex flex-col justify-between border-2 border-accent bg-surface p-5 sm:p-6 shadow-card relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                Most Popular
              </span>
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  High-Res PDF Export
                </span>
                <div className="font-serif text-3xl font-medium text-accent">₹50</div>
                <p className="text-xs text-text-muted">
                  Clean, vector 300 DPI book PDF ready for home printing or digital sharing.
                </p>
                <div className="space-y-2 pt-2 border-t border-border text-xs text-text-muted">
                  <div className="flex items-center gap-2 text-text font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Clean unwatermarked PDF
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Vector handwriting font embedded
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" /> 7-day unlimited re-exports
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Instant Razorpay UPI payment
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Link href={user ? "/books/new" : "/signup"}>
                  <Button className="w-full">Create &amp; Export for ₹50</Button>
                </Link>
              </div>
            </Card>

            {/* Print Hardcover */}
            <Card className="flex flex-col justify-between border border-border bg-surface p-5 sm:p-6 shadow-sm">
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Printed Hardcover
                </span>
                <div className="font-serif text-3xl font-medium text-text">
                  <span className="text-xs text-text-muted font-sans mr-1">from</span>₹999
                </div>
                <p className="text-xs text-text-muted">
                  Bespoke physical keepsake delivered to your door.
                </p>
                <div className="space-y-2 pt-2 border-t border-border text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Matte / Linen hardcover binding
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" /> 170 GSM archival photo paper
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Free PDF export included
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Free doorstep courier shipping
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button variant="secondary" className="w-full" disabled>
                  Print Orders Coming Soon
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 font-serif text-2xl font-medium tracking-tight text-text sm:text-3xl">
              Everything you need to know
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-[10px] border border-border bg-bg transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-sm font-medium text-text"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-text-muted transition-transform duration-200 ${
                      openFaq === index ? "rotate-180 text-accent" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs leading-relaxed text-text-muted border-t border-border/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-bg py-10 sm:py-12 text-xs text-text-muted">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-accent text-white">
                <BookOpen className="h-3.5 w-3.5" />
              </div>
              <span className="font-serif text-base font-semibold text-accent">Storybound</span>
              <span className="hidden sm:inline text-text-muted">· Your memories, your stories, your handwriting.</span>
            </Link>

            {/* Footer Links */}
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link href="/themes" className="hover:text-text transition-colors">
                Themes
              </Link>
              <Link href="#pricing" className="hover:text-text transition-colors">
                Pricing
              </Link>
              <Link href="/dashboard" className="hover:text-text transition-colors">
                Dashboard
              </Link>
              <Link href="/login" className="hover:text-text transition-colors">
                Sign In
              </Link>
              <Link href="#faq" className="hover:text-text transition-colors">
                FAQ
              </Link>
            </nav>

            {/* Contact & Copyright */}
            <div className="flex flex-col gap-2 sm:items-end">
              <a
                href="mailto:hello@storybound.app"
                className="inline-flex items-center gap-1.5 text-text-muted hover:text-text transition-colors"
              >
                <Mail className="h-3 w-3" />
                hello@storybound.app
              </a>
              <span>© {new Date().getFullYear()} Storybound Studio. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
