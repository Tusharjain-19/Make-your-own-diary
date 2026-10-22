import Link from "next/link";
import { BookOpen, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 py-12 text-center">
      {/* Brand */}
      <Link href="/" className="mb-10 inline-flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent text-white shadow-sm">
          <BookOpen className="h-5 w-5" />
        </div>
        <span className="font-serif text-2xl font-semibold tracking-tight text-accent">
          Storybound
        </span>
      </Link>

      {/* Error Badge */}
      <div className="mb-6 inline-flex items-center rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-mono text-text-muted shadow-sm">
        Error 404
      </div>

      {/* Message */}
      <h1 className="font-serif text-4xl font-medium tracking-tight text-text sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-base text-text-muted leading-relaxed">
        This page doesn&apos;t exist or has been moved.
        Let&apos;s get you back to your story.
      </p>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Link href="/">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go to Dashboard
          </Button>
        </Link>
      </div>

      {/* Decorative element */}
      <div className="mt-12 h-px w-32 bg-border" />
      <p className="mt-4 text-xs text-text-muted">
        © {new Date().getFullYear()} Storybound Studio
      </p>
    </div>
  );
}
