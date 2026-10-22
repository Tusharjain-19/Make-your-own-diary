"use client";

import * as React from "react";
import { BookOpen, Sparkles, SlidersHorizontal, CheckCircle2, ArrowRight, Palette, Layers, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { themes, layouts } from "@/lib/themes";

export default function StarterPage() {
  const [testInput, setTestInput] = React.useState("Jaipur Trip 2026");
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-accent text-white">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="font-serif text-lg font-semibold tracking-tight text-accent">
              Storybound
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-border bg-accent-soft px-3 py-1 text-xs font-medium text-text-muted">
              Day 1 Foundation Ready
            </span>
            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="mb-12 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-text-muted">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Personal Book Studio
          </div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-text sm:text-4xl md:text-5xl">
            Your memories. Your stories. Your handwriting. Your book.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-text-muted sm:text-lg">
            A calm, minimal design studio where people craft personal travel diaries and memory books,
            typeset with their own handwriting, export print-ready PDFs, and order hardcover keepsakes.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-text-muted">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 font-mono">
              <FolderTree className="h-3.5 w-3.5 text-accent" /> /frontend (Next.js 14)
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 font-mono">
              <Layers className="h-3.5 w-3.5 text-accent" /> /backend (Supabase & PDF)
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 font-mono">
              <Palette className="h-3.5 w-3.5 text-accent" /> /templates (10 Themes)
            </span>
          </div>
        </div>

        {/* Interactive Component Showcase */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left: Design Tokens & Layout Specs */}
          <div className="lg:col-span-7">
            <Tabs defaultValue="tokens" className="w-full">
              <TabsList className="mb-6 grid w-full max-w-lg grid-cols-4">
                <TabsTrigger value="tokens">Tokens</TabsTrigger>
                <TabsTrigger value="themes">10 Themes</TabsTrigger>
                <TabsTrigger value="sizes">Formats</TabsTrigger>
                <TabsTrigger value="specs">Layout</TabsTrigger>
              </TabsList>

              <TabsContent value="tokens" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">Color & Style Tokens</CardTitle>
                    <CardDescription>
                      Calm, high-contrast palette defined in designtemplete.md.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div className="rounded-[8px] border border-border bg-bg p-3">
                        <div className="h-6 w-full rounded border border-border bg-bg" />
                        <div className="mt-2 text-xs font-medium">Background</div>
                        <div className="text-[11px] text-text-muted">#FAFAF8</div>
                      </div>
                      <div className="rounded-[8px] border border-border bg-surface p-3">
                        <div className="h-6 w-full rounded border border-border bg-surface" />
                        <div className="mt-2 text-xs font-medium">Surface</div>
                        <div className="text-[11px] text-text-muted">#FFFFFF</div>
                      </div>
                      <div className="rounded-[8px] border border-border bg-surface p-3">
                        <div className="h-6 w-full rounded bg-accent" />
                        <div className="mt-2 text-xs font-medium">Accent / Black</div>
                        <div className="text-[11px] text-text-muted">#1A1A1A</div>
                      </div>
                      <div className="rounded-[8px] border border-border bg-surface p-3">
                        <div className="h-6 w-full rounded bg-accent-soft" />
                        <div className="mt-2 text-xs font-medium">Accent Soft</div>
                        <div className="text-[11px] text-text-muted">#F0EEE9</div>
                      </div>
                    </div>

                    <div className="rounded-[8px] bg-accent-soft/60 p-4 text-xs text-text-muted">
                      <div className="flex items-center gap-2 font-medium text-text">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        Typography & Radius
                      </div>
                      <p className="mt-1">
                        UI font: <strong className="font-medium text-text">Inter</strong> · Headings:{" "}
                        <strong className="font-serif font-medium text-text">Playfair Display</strong> · Radius:{" "}
                        <strong className="font-medium text-text">10px</strong>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="themes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">The 10 Curated Themes</CardTitle>
                    <CardDescription>
                      Loaded from /templates/themes.json with custom typography pairs and palettes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 max-h-[360px] overflow-y-auto pr-1">
                      {themes.map((theme) => (
                        <div
                          key={theme.id}
                          className="flex flex-col justify-between rounded-[8px] border border-border p-3 transition-colors hover:bg-accent-soft/40"
                          style={{ backgroundColor: theme.palette.bg }}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-xs text-text" style={{ color: theme.palette.primary }}>
                                {theme.name}
                              </span>
                              <span className="text-[10px] text-text-muted">
                                {theme.fonts.heading}
                              </span>
                            </div>
                            <p className="mt-1 text-[11px] text-text-muted">
                              Pair: {theme.fonts.heading} + {theme.fonts.body}
                            </p>
                          </div>
                          <div className="mt-3 flex items-center gap-1.5">
                            <span className="h-3.5 w-3.5 rounded-full border border-black/10" style={{ backgroundColor: theme.palette.bg }} />
                            <span className="h-3.5 w-3.5 rounded-full border border-black/10" style={{ backgroundColor: theme.palette.primary }} />
                            <span className="h-3.5 w-3.5 rounded-full border border-black/10" style={{ backgroundColor: theme.palette.accent }} />
                            <span className="ml-auto text-[10px] text-text-muted">{theme.layouts.length} layouts</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sizes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">Standard Page Sizes</CardTitle>
                    <CardDescription>
                      All coordinate systems and stored elements operate in millimeters (mm).
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y divide-border rounded-[8px] border border-border">
                      <div className="flex items-center justify-between p-3 text-sm">
                        <span className="font-medium">A5 Portrait (Default)</span>
                        <span className="font-mono text-xs text-text-muted">148 × 210 mm (3mm bleed)</span>
                      </div>
                      <div className="flex items-center justify-between p-3 text-sm">
                        <span className="font-medium">A4 Portrait</span>
                        <span className="font-mono text-xs text-text-muted">210 × 297 mm (3mm bleed)</span>
                      </div>
                      <div className="flex items-center justify-between p-3 text-sm">
                        <span className="font-medium">Square</span>
                        <span className="font-mono text-xs text-text-muted">203 × 203 mm (3mm bleed)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specs" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">Editor Layout Chrome & {layouts.length} Layouts</CardTitle>
                    <CardDescription>
                      Standardized geometry for the Canva-like book design workspace.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-text-muted">
                    <div className="flex justify-between py-1.5 border-b border-border">
                      <span>Top Bar</span>
                      <span className="font-mono text-xs text-text font-medium">56px</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-border">
                      <span>Left Tool Rail</span>
                      <span className="font-mono text-xs text-text font-medium">72px</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-border">
                      <span>Left Expanding Panel</span>
                      <span className="font-mono text-xs text-text font-medium">300px</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-border">
                      <span>Right Properties Panel</span>
                      <span className="font-mono text-xs text-text font-medium">280px</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span>Bottom Page Strip</span>
                      <span className="font-mono text-xs text-text font-medium">110px</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: UI Component Checklist & Interactive Controls */}
          <div className="lg:col-span-5 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">Component Showcase</CardTitle>
                <CardDescription>
                  Testing Button, Input, Card, Dialog, and Tabs integration.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Input test */}
                <div className="space-y-2">
                  <label htmlFor="book-title" className="text-xs font-medium uppercase tracking-wider text-text-muted">
                    Sample Input Field
                  </label>
                  <Input
                    id="book-title"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder="Enter book title..."
                  />
                  <p className="text-xs text-text-muted">Current value: &quot;{testInput}&quot;</p>
                </div>

                {/* Button variants */}
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-text-muted">
                    Button Variants
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="default">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                  </div>
                </div>

                {/* Dialog test */}
                <div className="space-y-2 pt-2">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        <span className="flex items-center gap-2">
                          <SlidersHorizontal className="h-4 w-4" />
                          Open Test Dialog Modal
                        </span>
                        <ArrowRight className="h-4 w-4 text-text-muted" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="font-serif text-xl">Design Modal Test</DialogTitle>
                        <DialogDescription>
                          This modal demonstrates the Dialog primitive styled with subtle backdrop blur and clean borders.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3 py-2 text-sm text-text-muted">
                        <p>
                          Storybound editor components operate with strict adherence to the minimal tokens defined in designtemplete.md.
                        </p>
                        <Input placeholder="Type inside dialog..." defaultValue={testInput} />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setDialogOpen(false)}>Done</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border pt-4">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <span className="flex h-2 w-2 rounded-full bg-success" />
                  All Day 1 primitives verified and functional
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
