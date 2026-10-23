"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";
import { getThemeById } from "@/lib/themes";
import { useEditorStore, createSamplePageElements, createSampleCoverElements } from "@/lib/editor/store";
import { PageSize, El, TextEl } from "@/lib/editor/types";
import { loadBookFromIndexedDB, flushOfflineQueue } from "@/lib/storage/indexeddb";
import dynamic from "next/dynamic";
import { TopBar } from "@/components/editor/TopBar";
import { LeftRail } from "@/components/editor/LeftRail";
import { ContextToolbar } from "@/components/editor/ContextToolbar";
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
    selectAll,
    deselectAll,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    setActiveTool,
    saveToStorage,
    saveStatus,
    activePageIndex,
    setActivePage,
    selectedIds,
  } = useEditorStore();

  const [isInitialized, setIsInitialized] = React.useState(false);

  // Initialize store from Auth / LocalStorage / IndexedDB book data
  React.useEffect(() => {
    if (!bookId || isInitialized) return;

    const initializeBook = async () => {
      let rawBook = getBookById(bookId);
      let rawPages = getBookPages(bookId);

      // If not in localStorage, attempt loading from IndexedDB
      if (!rawBook) {
        const idbBook = await loadBookFromIndexedDB(bookId);
        if (idbBook) {
          setBook(idbBook);
          setIsInitialized(true);
          return;
        }
      }

      if (!rawBook) return;

      const theme = getThemeById(rawBook.themeId);

      // Ensure at least 5 starter pages are populated if rawPages is empty
      let pageSources = rawPages;
      if (!pageSources || pageSources.length === 0) {
        pageSources = [
          { id: `p-${rawBook.id}-1`, bookId: rawBook.id, position: 1, data: { bg: theme?.palette.bg || "#FAFAF8", layoutId: "L01", elements: [] } },
          { id: `p-${rawBook.id}-2`, bookId: rawBook.id, position: 2, data: { bg: theme?.palette.bg || "#FAFAF8", layoutId: "L02", elements: [] } },
          { id: `p-${rawBook.id}-3`, bookId: rawBook.id, position: 3, data: { bg: theme?.palette.bg || "#FAFAF8", layoutId: "L03", elements: [] } },
          { id: `p-${rawBook.id}-4`, bookId: rawBook.id, position: 4, data: { bg: theme?.palette.bg || "#FAFAF8", layoutId: "L04", elements: [] } },
          { id: `p-${rawBook.id}-5`, bookId: rawBook.id, position: 5, data: { bg: theme?.palette.bg || "#FAFAF8", layoutId: "L05", elements: [] } },
        ];
      }

      // Format into BookModel
      const pages = pageSources.map((p, idx) => {
        let elements: El[] = (p.data?.elements || []) as El[];
        // Pre-designed fun travel cover for Page 1 / Cover
        if (
          idx === 0 &&
          (elements.length === 0 ||
            (elements.length === 1 && (elements[0] as TextEl).text?.includes("JAIPUR")) ||
            elements.some((e) => e.id === "cover-title-1" && !elements.some((x) => x.id === "cover-badge-1")))
        ) {
          elements = createSampleCoverElements({
            title: rawBook.title,
            subtitle: rawBook.subtitle,
            author: rawBook.author,
            dates: rawBook.dates,
            font: theme?.fonts.heading,
            accent: theme?.palette.accent,
          });
        }
        // First content page (page 2, index 1) sample elements
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
    };

    initializeBook();

    // Flush any pending offline queue when online
    const handleOnline = () => {
      flushOfflineQueue();
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [bookId, isInitialized, getBookById, getBookPages, setBook]);

  // Dynamic document title based on current book
  React.useEffect(() => {
    const currentTitle = book?.title?.trim() || "Book Editor";
    document.title = `${currentTitle} | Storybound`;
  }, [book?.title]);

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

      // Select All: Ctrl/Cmd + A
      if (cmdOrCtrl && e.key.toLowerCase() === "a") {
        e.preventDefault();
        selectAll();
        return;
      }

      // Delete: Delete or Backspace
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteSelected();
        saveToStorage();
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

      // Page Navigation with Left/Right Arrow keys (when no elements selected, or Alt+Arrow) or PageUp/PageDown
      if (
        (e.key === "ArrowLeft" && (selectedIds.length === 0 || e.altKey)) ||
        e.key === "PageUp"
      ) {
        e.preventDefault();
        setActivePage(Math.max(0, activePageIndex - 1));
        return;
      }

      if (
        (e.key === "ArrowRight" && (selectedIds.length === 0 || e.altKey)) ||
        e.key === "PageDown"
      ) {
        e.preventDefault();
        const maxPage = (book?.pages.length || 1) - 1;
        setActivePage(Math.min(maxPage, activePageIndex + 1));
        return;
      }

      // Arrow Key Nudges: 1mm normal, 10mm with Shift (when elements are selected)
      if (selectedIds.length > 0) {
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
    activePageIndex,
    setActivePage,
    selectedIds,
    book,
  ]);

  // Debounced autosave (2 seconds after changes) as specified in Day 7 prompt
  React.useEffect(() => {
    if (saveStatus !== "unsaved") return;
    const timer = setTimeout(() => {
      saveToStorage();
    }, 2000);
    return () => clearTimeout(timer);
  }, [saveStatus, saveToStorage]);

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

      {/* Dynamic Contextual Toolbar (Canva-style) */}
      <ContextToolbar />

      {/* Main Workspace (Left Rail + Full Spacious Canvas) */}
      <div className="flex flex-1 overflow-hidden relative">
        <LeftRail />
        <main className="flex-1 h-full overflow-hidden relative bg-[#f4f4f2]">
          {/* Floating Canvas Left Arrow Button */}
          <button
            type="button"
            onClick={() => setActivePage(Math.max(0, activePageIndex - 1))}
            disabled={activePageIndex === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-surface/90 hover:bg-surface text-text border border-border shadow-md backdrop-blur transition-all hover:scale-110 active:scale-95 disabled:opacity-0 disabled:pointer-events-none"
            title="Previous Page (ArrowLeft)"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Floating Canvas Right Arrow Button */}
          <button
            type="button"
            onClick={() => {
              const maxPage = (book?.pages.length || 1) - 1;
              setActivePage(Math.min(maxPage, activePageIndex + 1));
            }}
            disabled={activePageIndex >= (book?.pages.length || 1) - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-surface/90 hover:bg-surface text-text border border-border shadow-md backdrop-blur transition-all hover:scale-110 active:scale-95 disabled:opacity-0 disabled:pointer-events-none"
            title="Next Page (ArrowRight)"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <PageCanvas />
        </main>
      </div>

      {/* Bottom Page Strip */}
      <PageStrip />
    </div>
  );
}
