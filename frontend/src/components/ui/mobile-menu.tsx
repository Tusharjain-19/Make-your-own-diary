"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  links: MobileMenuLink[];
  ctaHref?: string;
  ctaLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export function MobileMenu({
  links,
  ctaHref = "/signup",
  ctaLabel = "Get Started",
  secondaryHref = "/login",
  secondaryLabel = "Sign In",
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Close menu on escape key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-border bg-surface text-text-muted hover:text-text hover:bg-accent-soft transition-colors"
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Drawer */}
      <div
        className={`fixed top-0 right-0 z-[101] h-full w-[280px] bg-surface border-l border-border shadow-xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-accent text-white">
              <BookOpen className="h-3.5 w-3.5" />
            </div>
            <span className="font-serif text-base font-semibold tracking-tight text-accent">
              Storybound
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-[8px] text-text-muted hover:text-text hover:bg-accent-soft transition-colors"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col px-5 py-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-[8px] px-3 py-2.5 text-sm text-text hover:bg-accent-soft transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-surface p-5 space-y-2">
          <Link href={ctaHref} onClick={() => setIsOpen(false)}>
            <Button className="w-full text-sm gap-2">
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={secondaryHref} onClick={() => setIsOpen(false)}>
            <Button variant="outline" className="w-full text-sm">
              {secondaryLabel}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
