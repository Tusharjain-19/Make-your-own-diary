"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, ArrowLeft, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/lib/auth/auth-context";
import { themes } from "@/lib/themes";

export default function ThemesGalleryPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent-soft selection:text-text overflow-x-hidden">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-accent text-white shadow-sm">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="font-serif text-lg font-semibold tracking-tight text-accent">
                Storybound
              </span>
            </Link>
            <span className="text-xs text-text-muted">/ Theme Gallery</span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-xs">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Home
              </Button>
            </Link>
            {user ? (
              <Link href="/dashboard">
                <Button size="sm" className="text-xs">Dashboard</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="sm" className="text-xs">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Header Banner */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-2xl mb-12">
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
            <Palette className="h-3.5 w-3.5 text-accent" />
            Curated Design Foundations
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-text">
            The 10 Editorial Themes
          </h1>
          <p className="mt-3 text-base text-text-muted leading-relaxed">
            Every theme is designed with strict whitespace, calibrated font pairings, and tailored color tokens.
            Choose a foundation to launch your book creation wizard.
          </p>
        </div>

        {/* 10 Theme Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme, index) => (
            <Card
              key={theme.id}
              className="flex flex-col justify-between overflow-hidden border border-border bg-surface transition-all duration-200 hover:shadow-card group"
            >
              <div>
                {/* Visual Cover Preview Header */}
                <div
                  className="relative aspect-[4/3] p-6 flex flex-col justify-between border-b border-border transition-transform group-hover:scale-[1.01]"
                  style={{ backgroundColor: theme.palette.bg }}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-surface/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-text-muted border border-border/60">
                      0{index + 1} · {theme.id}
                    </span>
                    <span className="rounded-full bg-surface/90 px-2 py-0.5 text-[10px] font-mono text-text-muted border border-border/60">
                      {theme.layouts.length} layouts
                    </span>
                  </div>

                  <div className="space-y-1 text-center py-2">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-text-muted">
                      Sample Cover
                    </span>
                    <h3
                      className="font-serif text-xl font-medium tracking-tight"
                      style={{ color: theme.palette.primary }}
                    >
                      {theme.name}
                    </h3>
                    <div
                      className="h-0.5 w-10 mx-auto rounded"
                      style={{ backgroundColor: theme.palette.accent }}
                    />
                  </div>

                  <div className="flex items-center justify-center gap-1.5">
                    <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: theme.palette.bg }} title="Background" />
                    <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: theme.palette.primary }} title="Primary" />
                    <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: theme.palette.accent }} title="Accent" />
                    <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: theme.palette.text }} title="Text" />
                  </div>
                </div>

                {/* Theme Specs */}
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="font-serif text-lg font-medium">{theme.name}</CardTitle>
                  <CardDescription className="text-xs">
                    Pairing: <strong className="text-text font-medium">{theme.fonts.heading}</strong> +{" "}
                    <strong className="text-text font-medium">{theme.fonts.body}</strong>
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-5 pb-4 space-y-2 text-xs text-text-muted">
                  <div className="flex items-center justify-between border-b border-border/60 py-1">
                    <span>Default Margin:</span>
                    <span className="font-mono text-text">{theme.defaults.marginMm} mm</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/60 py-1">
                    <span>Heading / Body Size:</span>
                    <span className="font-mono text-text">{theme.defaults.headingSize}pt / {theme.defaults.bodySize}pt</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>Decor Elements:</span>
                    <span className="text-text capitalize">{theme.decor.join(", ")}</span>
                  </div>
                </CardContent>
              </div>

              <CardFooter className="p-5 pt-0 border-t border-border mt-2">
                <Link href={`/books/new?theme=${theme.id}`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full text-xs justify-between group-hover:border-accent group-hover:bg-accent group-hover:text-white transition-all">
                    <span>Use this theme</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
