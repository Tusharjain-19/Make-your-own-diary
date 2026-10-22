"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";
import { getThemeById } from "@/lib/themes";
import { useEditorStore, createSamplePageElements } from "@/lib/editor/store";
import { PageSize, El } from "@/lib/editor/types";
import dynamic from "next/dynamic";
import { TopBar } from "@/components/editor/TopBar";
import { LeftRail } from "@/components/editor/LeftRail";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel/PropertiesPanel";
import { PageStrip } from "@/components/editor/PageStrip";

const PageCanvas = dynamic(
  () => import("@/components/editor/Canvas/PageCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-xs font-mono text-text-muted">
        Loading canvas...
      </div>
    ),
  }
);

export default function BookEditorPage() {
  const params = useParams();
  const bookId = params?.id as string;

  const { getBookById, getBookPages } = useAuth();
  const {
    book,
    setBook,
    deleteSelected,
    duplicateSelected,
    copySelected,
    paste,
    undo,
    redo,
    nudgeSelected,
    deselectAll,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    setActiveTool,
    saveToStorage,
  } = useEditorStore();

  const [isInitialized, setIsInitialized] = React.useState(false);

  // Initialize store from Auth / LocalStorage book data
  React.useEffect(() => {
    if (!bookId || isInitialized) return;

    const rawBook = getBookById(bookId);
    if (!rawBook) return;

    const rawPages = getBookPages(bookId);
    const theme = getThemeById(rawBook.themeId);

    // Format into BookModel
    const pages = rawPages.map((p, idx) => {
      let elements: El[] = (p.data?.elements || []) as El[];
      // For Day 5 proof of concept: if first content page (page 1, index 1) is empty, populate sample elements
      if (idx === 1 && elements.length === 0) {
        elements = createSamplePageElements(theme?.fonts.heading || "Playfair Display");
      }
      return {
        id: p.id || `p-${rawBook.id}-${p.position || idx + 1}`,
        position: p.position || idx + 1,
        bg:
          p.data?.bg && !p.data.bg.startsWith("var(")
            ? p.data.bg
            : theme?.palette.bg || "#FAFAF8",
        layoutId: p.data?.layoutId || (idx === 0 ? "L01" : "L02"),
        elements,
      };
    });

    setBook({
      id: rawBook.id,
      userId: rawBook.userId,
      title: rawBook.title,
      subtitle: rawBook.subtitle,
      author: rawBook.author,
      dates: rawBook.dates,
      size: rawBook.size as PageSize,
      themeId: rawBook.themeId,
      status: rawBook.status,
      pages,
    });

    setIsInitialized(true);
  }, [bookId, isInitialized, getBookById, getBookPages, setBook]);

  // Global Keyboard Shortcuts (from frontend.md and Day 6 prompt)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Undo: Ctrl/Cmd + Z
      if (cmdOrCtrl && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl/Cmd + Y OR Ctrl/Cmd + Shift + Z
      if (
        (cmdOrCtrl && e.key.toLowerCase() === "y") ||
        (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === "z")
      ) {
        e.preventDefault();
        redo();
        return;
      }

      // Duplicate: Ctrl/Cmd + D
      if (cmdOrCtrl && e.key.toLowerCase() === "d") {
        e.preventDefault();
        duplicateSelected();
        return;
      }

      // Copy: Ctrl/Cmd + C
      if (cmdOrCtrl && e.key.toLowerCase() === "c") {
        e.preventDefault();
        copySelected();
        return;
      }

      // Paste: Ctrl/Cmd + V
      if (cmdOrCtrl && e.key.toLowerCase() === "v") {
        e.preventDefault();
        paste();
        return;
      }

      // Delete: Delete or Backspace
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteSelected();
        return;
      }

      // Deselect: Escape
      if (e.key === "Escape") {
        e.preventDefault();
        deselectAll();
        return;
      }

      // Tool shortcuts: V = Select, H = Pan
      if (!cmdOrCtrl && !e.altKey && !e.shiftKey) {
        if (e.key.toLowerCase() === "v") {
          e.preventDefault();
          setActiveTool("select");
          return;
        }
        if (e.key.toLowerCase() === "h") {
          e.preventDefault();
          setActiveTool("pan");
          return;
        }
      }

      // Z-Order shortcuts: [ ]
      if (e.key === "[") {
        e.preventDefault();
        if (e.shiftKey) sendToBack();
        else sendBackward();
        return;
      }
      if (e.key === "]") {
        e.preventDefault();
        if (e.shiftKey) bringToFront();
        else bringForward();
        return;
      }

      // Arrow Key Nudges: 1mm normal, 10mm with Shift
      const step = e.shiftKey ? 10 : 1;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        nudgeSelected(-step, 0);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        nudgeSelected(step, 0);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        nudgeSelected(0, -step);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        nudgeSelected(0, step);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    undo,
    redo,
    duplicateSelected,
    copySelected,
    paste,
    deleteSelected,
    deselectAll,
    setActiveTool,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    nudgeSelected,
  ]);

  // Periodic autosave (every 10 seconds if unsaved)
  React.useEffect(() => {
    const timer = setInterval(() => {
      saveToStorage();
    }, 10000);
    return () => clearInterval(timer);
  }, [saveToStorage]);

  const rawBook = getBookById(bookId);
  if (!rawBook && !book) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg p-6 text-center">
        <h2 className="font-serif text-2xl font-medium text-text">Book Not Found</h2>
        <p className="mt-2 text-sm text-text-muted">
          The requested book either does not exist or belongs to another user account (RLS protected).
        </p>
        <Link href="/dashboard" className="mt-6">
          <Button variant="outline">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Return to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg text-text selection:bg-accent-soft selection:text-text">
      {/* Top Bar (56px) */}
      <TopBar />

      {/* Main Workspace (Left Rail + Canvas + Properties Panel) */}
      <div className="flex flex-1 overflow-hidden relative">
        <LeftRail />
        <main className="flex-1 h-full overflow-hidden relative bg-[#f4f4f2]">
          <PageCanvas />
        </main>
        <PropertiesPanel />
      </div>

      {/* Bottom Page Strip (110px) */}
      <PageStrip />
    </div>
  );
}
