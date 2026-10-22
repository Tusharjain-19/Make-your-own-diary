"use client";

import Link from "next/link";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoryboundLogo } from "@/components/ui/logo";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 py-12 text-center">
      {/* Brand */}
      <div className="mb-10">
        <StoryboundLogo size="lg" href="/" />
      </div>

      {/* Error Icon */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-danger/10 text-danger">
        <AlertTriangle className="h-7 w-7" />
      </div>

      {/* Message */}
      <h1 className="font-serif text-3xl font-medium tracking-tight text-text sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-sm text-text-muted leading-relaxed">
        An unexpected error occurred while loading this page. Please try again, or
        contact us if the issue persists.
      </p>

      {error.digest && (
        <p className="mt-2 text-xs font-mono text-text-muted/60">
          Error ID: {error.digest}
        </p>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Button onClick={reset} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Support */}
      <p className="mt-10 text-xs text-text-muted">
        Need help?{" "}
        <a
          href="mailto:hello@storybound.app"
          className="font-medium text-accent underline underline-offset-2 hover:text-text transition-colors"
        >
          hello@storybound.app
        </a>
      </p>
    </div>
  );
}
