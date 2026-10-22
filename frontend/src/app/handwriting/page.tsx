"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoryboundLogo } from "@/components/ui/logo";
import { HandwritingPanel } from "@/components/editor/panels/HandwritingPanel";

export default function HandwritingPage() {
  return (
    <div className="min-h-screen bg-bg text-text overflow-x-hidden">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <StoryboundLogo size="sm" href="/dashboard" />
            <span className="text-xs text-text-muted">/ Handwriting Studio</span>
          </div>

          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="text-xs">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
          <HandwritingPanel />
        </div>
      </main>
    </div>
  );
}
