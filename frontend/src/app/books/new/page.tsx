"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Check,
  Compass,
  Heart,
  BookText,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StoryboundLogo } from "@/components/ui/logo";
import { useAuth } from "@/lib/auth/auth-context";
import { themes } from "@/lib/themes";

const BOOK_TYPES = [
  {
    id: "Travel Diary",
    name: "Travel Diary",
    desc: "For roadtrips, mountain treks, city escapes, and international voyages.",
    icon: Compass,
  },
  {
    id: "Memory Book",
    name: "Memory Book",
    desc: "For anniversaries, college gangs, year reviews, and celebrations.",
    icon: Heart,
  },
  {
    id: "Journal",
    name: "Personal Journal",
    desc: "For daily reflections, essays, poems, and handwritten letters.",
    icon: BookText,
  },
  {
    id: "Gift Storybook",
    name: "Gift Storybook",
    desc: "A custom personal keepsake designed for a loved one's birthday or milestone.",
    icon: Gift,
  },
];

const SIZES = [
  {
    id: "A5",
    name: "A5 Portrait",
    dimensions: "148 × 210 mm",
    desc: "The classic handheld travel diary. Fits effortlessly in backpacks.",
    aspect: "aspect-[148/210]",
    recommended: true,
  },
  {
    id: "A4",
    name: "A4 Portrait",
    dimensions: "210 × 297 mm",
    desc: "Large coffee-table format with spacious margins for large hero photos.",
    aspect: "aspect-[210/297]",
    recommended: false,
  },
  {
    id: "Square",
    name: "Square",
    dimensions: "203 × 203 mm",
    desc: "8 × 8 inches modern square layout. Ideal for Instagram photo collages.",
    aspect: "aspect-square",
    recommended: false,
  },
];

function WizardForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialThemeId = searchParams.get("theme") || "warm-editorial";

  const { user, createBook } = useAuth();

  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [bookType, setBookType] = React.useState("Travel Diary");
  const [size, setSize] = React.useState("A5");
  const [themeId, setThemeId] = React.useState(initialThemeId);
  const [title, setTitle] = React.useState("Jaipur Trip 2026");
  const [subtitle, setSubtitle] = React.useState("Palaces, desert winds, and sweet chai");
  const [author, setAuthor] = React.useState(user?.name || "Tushar Gupta");
  const [dates, setDates] = React.useState("October 2026");

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const selectedTheme = themes.find((t) => t.id === themeId) || themes[0];

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide a book title.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Post to API route /api/books
      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        author: author.trim() || user?.name || "Author",
        dates: dates.trim(),
        bookType,
        size,
        themeId,
        userId: user?.id || "user-default",
      };

      const apiRes = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const apiData = await apiRes.json();

      // 2. Persist in client store
      const newBook = createBook(payload);

      // 3. Redirect to editor route
      const destinationId = newBook.id || apiData.book?.id;
      router.push(`/books/${destinationId}/edit`);
    } catch (err) {
      console.error(err);
      setError("Failed to create book. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text overflow-x-hidden">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <StoryboundLogo size="sm" href="/dashboard" />
            <span className="text-xs text-text-muted">/ Book Setup Wizard</span>
          </div>

          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-xs text-text-muted">
              Cancel
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-10">
        {/* Step Indicator Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted mb-2">
            <span>STEP 0{step} OF 04</span>
            <span>
              {step === 1 && "Book Purpose"}
              {step === 2 && "Page Format"}
              {step === 3 && "Curated Theme"}
              {step === 4 && "Title & Details"}
            </span>
          </div>

          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300 ease-out"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-[8px] border border-danger/20 bg-danger/5 p-3 text-xs text-danger">
            {error}
          </div>
        )}

        {/* STEP 1: CHOOSE BOOK TYPE */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="font-serif text-3xl font-medium tracking-tight text-text">
                What kind of book are you creating?
              </h1>
              <p className="mt-2 text-sm text-text-muted">
                This helps us recommend the best layouts and cover presets for your story.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BOOK_TYPES.map((type) => {
                const IconComponent = type.icon;
                const isSelected = bookType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setBookType(type.id)}
                    className={`flex flex-col text-left p-5 rounded-[10px] border transition-all duration-150 ${
                      isSelected
                        ? "border-accent bg-surface shadow-card ring-1 ring-accent"
                        : "border-border bg-surface hover:bg-accent-soft/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-accent-soft text-accent">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      {isSelected && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    <div className="font-serif text-lg font-medium text-text">{type.name}</div>
                    <p className="mt-1 text-xs text-text-muted leading-relaxed">{type.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setStep(2)}>
                Continue to Size <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: CHOOSE SIZE */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="font-serif text-3xl font-medium tracking-tight text-text">
                Select your page format
              </h1>
              <p className="mt-2 text-sm text-text-muted">
                All pages operate on millimeter coordinates with standard 3 mm bleed margins.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SIZES.map((sizeOpt) => {
                const isSelected = size === sizeOpt.id;
                return (
                  <button
                    key={sizeOpt.id}
                    type="button"
                    onClick={() => setSize(sizeOpt.id)}
                    className={`flex flex-col justify-between text-left p-5 rounded-[10px] border transition-all duration-150 ${
                      isSelected
                        ? "border-accent bg-surface shadow-card ring-1 ring-accent"
                        : "border-border bg-surface hover:bg-accent-soft/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs text-text-muted">
                          {sizeOpt.dimensions}
                        </span>
                        {isSelected && (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>

                      {/* Visual Aspect Ratio Box */}
                      <div className="my-4 flex items-center justify-center p-3 bg-accent-soft/40 rounded-[8px] border border-border/60">
                        <div
                          className={`w-16 border-2 border-accent bg-surface shadow-sm rounded-sm ${sizeOpt.aspect}`}
                        />
                      </div>

                      <div className="font-serif text-lg font-medium text-text flex items-center gap-2">
                        {sizeOpt.name}
                        {sizeOpt.recommended && (
                          <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-mono text-text">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-text-muted leading-relaxed">{sizeOpt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
              </Button>
              <Button onClick={() => setStep(3)}>
                Continue to Theme <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: CHOOSE THEME */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="font-serif text-3xl font-medium tracking-tight text-text">
                Pick an editorial theme
              </h1>
              <p className="mt-2 text-sm text-text-muted">
                You can restyle colors, fonts, and elements at any point later inside the editor.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[460px] overflow-y-auto pr-1">
              {themes.map((theme) => {
                const isSelected = themeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setThemeId(theme.id)}
                    className={`flex flex-col text-left p-4 rounded-[10px] border transition-all duration-150 ${
                      isSelected
                        ? "border-accent bg-surface shadow-card ring-2 ring-accent"
                        : "border-border bg-surface hover:bg-accent-soft/30"
                    }`}
                  >
                    <div
                      className="aspect-[5/3] w-full rounded-[6px] p-3 flex flex-col justify-between border border-border/80 mb-3"
                      style={{ backgroundColor: theme.palette.bg }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-text-muted uppercase">
                          {theme.fonts.heading}
                        </span>
                        {isSelected && (
                          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-white">
                            <Check className="h-2.5 w-2.5" />
                          </div>
                        )}
                      </div>
                      <div
                        className="font-serif text-base font-semibold truncate"
                        style={{ color: theme.palette.primary }}
                      >
                        {theme.name}
                      </div>
                    </div>

                    <div className="font-medium text-sm text-text">{theme.name}</div>
                    <p className="text-[11px] text-text-muted">
                      {theme.fonts.heading} + {theme.fonts.body}
                    </p>

                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: theme.palette.bg }} />
                      <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: theme.palette.primary }} />
                      <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: theme.palette.accent }} />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
              </Button>
              <Button onClick={() => setStep(4)}>
                Continue to Details <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: TITLE, SUBTITLE, AUTHOR & DATES */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h1 className="font-serif text-3xl font-medium tracking-tight text-text">
                Book title & details
              </h1>
              <p className="mt-2 text-sm text-text-muted">
                These will be typeset on your front cover and title page.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Inputs */}
              <form onSubmit={handleFinish} className="lg:col-span-7 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text">
                    Book Title <span className="text-danger">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Jaipur Diary 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text">Subtitle / Hook</label>
                  <Input
                    placeholder="e.g. Palaces, desert winds, and sweet chai"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text">Author / Creator</label>
                    <Input
                      placeholder="e.g. Maya Sharma"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text">Trip / Event Dates</label>
                    <Input
                      placeholder="e.g. October 2026"
                      value={dates}
                      onChange={(e) => setDates(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-border">
                  <Button type="button" variant="outline" onClick={() => setStep(3)}>
                    <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating book & 20 pages..." : "Create Book & Open Editor"}
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </div>
              </form>

              {/* Live Cover Preview */}
              <div className="lg:col-span-5 rounded-[12px] border border-border p-6 shadow-sm" style={{ backgroundColor: selectedTheme.palette.bg }}>
                <div className="text-[10px] uppercase font-mono tracking-wider text-text-muted mb-3 flex items-center justify-between">
                  <span>Front Cover Preview</span>
                  <span>{size} format</span>
                </div>

                <div className="aspect-[3/4] bg-surface rounded-[8px] p-6 shadow-sm border border-border/80 flex flex-col justify-between text-center">
                  <div className="text-[10px] font-mono text-text-muted uppercase">
                    {dates || "2026"}
                  </div>

                  <div className="space-y-2 py-4">
                    <h3
                      className="font-serif text-2xl font-semibold tracking-tight"
                      style={{ color: selectedTheme.palette.primary }}
                    >
                      {title || "Untitled Book"}
                    </h3>
                    {subtitle && (
                      <p className="text-xs italic text-text-muted" style={{ color: selectedTheme.palette.muted }}>
                        {subtitle}
                      </p>
                    )}
                    <div
                      className="h-0.5 w-8 mx-auto rounded"
                      style={{ backgroundColor: selectedTheme.palette.accent }}
                    />
                  </div>

                  <div className="text-xs font-medium text-text">
                    By {author || user?.name || "Author"}
                  </div>
                </div>

                <div className="mt-4 text-[11px] text-text-muted flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-accent" />
                  <span>Theme: {selectedTheme.name} · Automatically creates cover + 20 blank pages</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function NewBookWizardPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-bg" />}>
      <WizardForm />
    </React.Suspense>
  );
}
