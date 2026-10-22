import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { BookModel, El, PageData, TextEl, ImageEl, ShapeEl, IconEl } from "./types";
import { saveBookToIndexedDB, enqueueOfflineSave } from "@/lib/storage/indexeddb";

export type PanelType = "themes" | "layouts" | "uploads" | "text" | "elements" | "handwriting" | null;
export type ToolType = "select" | "pan";

interface EditorState {
  book: BookModel | null;
  activePageIndex: number;
  selectedIds: string[];
  zoom: number;
  pan: { x: number; y: number };
  activeTool: ToolType;
  activePanel: PanelType;
  guides: { vertical: number[]; horizontal: number[] };
  clipboard: El[] | null;
  undoStack: PageData[][];
  redoStack: PageData[][];
  saveStatus: "saved" | "saving" | "unsaved" | "error";
  lastSavedAt: string | null;

  showMargins: boolean;
  showBleed: boolean;
  showRulers: boolean;
  copiedStyle: Record<string, any> | null;

  // Actions
  setBook: (book: BookModel) => void;
  setActivePage: (index: number) => void;
  selectElement: (id: string, multi?: boolean) => void;
  selectAll: () => void;
  clearPageContent: () => void;
  removeLayout: () => void;
  deselectAll: () => void;
  selectMarquee: (ids: string[]) => void;
  addElement: (el: El) => void;
  updateElement: (id: string, updates: Partial<El>) => void;
  updateElements: (items: { id: string; updates: Partial<El> }[]) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  nudgeSelected: (dxMm: number, dyMm: number) => void;
  copySelected: () => void;
  paste: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  toggleLockSelected: () => void;
  flipHorizontalSelected: () => void;
  flipVerticalSelected: () => void;
  copyStyle: () => void;
  applyCopiedStyle: (targetId: string) => void;
  toggleMargins: () => void;
  toggleBleed: () => void;
  toggleRulers: () => void;
  undo: () => void;
  redo: () => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  setActiveTool: (tool: ToolType) => void;
  setActivePanel: (panel: PanelType) => void;
  setGuides: (guides: { vertical: number[]; horizontal: number[] }) => void;
  addPage: () => void;
  duplicatePage: (index: number) => void;
  deletePage: (index: number) => void;
  reorderPages: (fromIndex: number, toIndex: number) => void;
  setPageBackground: (color: string, applyToAll?: boolean) => void;
  saveToStorage: () => Promise<void>;
  retrySave: () => Promise<void>;
}

// Helper to push history with 100 steps limit (from Day 7 prompt)
function pushHistory(state: EditorState) {
  if (!state.book) return;
  const snapshot = JSON.parse(JSON.stringify(state.book.pages));
  state.undoStack.push(snapshot);
  if (state.undoStack.length > 100) state.undoStack.shift();
  state.redoStack = [];
  state.saveStatus = "unsaved";
}

export const useEditorStore = create<EditorState>()(
  immer((set, get) => ({
    book: null,
    activePageIndex: 0,
    selectedIds: [],
    zoom: 1.0,
    pan: { x: 0, y: 0 },
    activeTool: "select",
    activePanel: "themes",
    guides: { vertical: [], horizontal: [] },
    clipboard: null,
    undoStack: [],
    redoStack: [],
    saveStatus: "saved",
    lastSavedAt: null,
    showMargins: true,
    showBleed: true,
    showRulers: false,
    copiedStyle: null,

    setBook: (book) =>
      set((state) => {
        state.book = book;
        state.activePageIndex = 0;
        state.selectedIds = [];
        state.undoStack = [];
        state.redoStack = [];
        state.saveStatus = "saved";
        state.lastSavedAt = "Just now";
      }),

    setActivePage: (index) =>
      set((state) => {
        if (!state.book) return;
        if (index >= 0 && index < state.book.pages.length) {
          state.activePageIndex = index;
          state.selectedIds = [];
          state.guides = { vertical: [], horizontal: [] };
        }
      }),

    selectElement: (id, multi = false) =>
      set((state) => {
        if (multi) {
          if (state.selectedIds.includes(id)) {
            state.selectedIds = state.selectedIds.filter((item) => item !== id);
          } else {
            state.selectedIds.push(id);
          }
        } else {
          state.selectedIds = [id];
        }
      }),

    selectAll: () =>
      set((state) => {
        if (!state.book) return;
        const page = state.book.pages[state.activePageIndex];
        if (!page) return;
        state.selectedIds = page.elements.map((el) => el.id);
      }),

    clearPageContent: () =>
      set((state) => {
        if (!state.book) return;
        const page = state.book.pages[state.activePageIndex];
        if (!page) return;
        pushHistory(state);
        page.elements = [];
        page.layoutId = undefined;
        state.selectedIds = [];
        state.saveStatus = "unsaved";
      }),

    removeLayout: () =>
      set((state) => {
        if (!state.book) return;
        const page = state.book.pages[state.activePageIndex];
        if (!page) return;
        pushHistory(state);
        page.elements = [];
        page.layoutId = undefined;
        state.selectedIds = [];
        state.saveStatus = "unsaved";
      }),

    deselectAll: () =>
      set((state) => {
        state.selectedIds = [];
        state.guides = { vertical: [], horizontal: [] };
      }),

    selectMarquee: (ids) =>
      set((state) => {
        state.selectedIds = ids;
      }),

    addElement: (el) =>
      set((state) => {
        if (!state.book) return;
        pushHistory(state);
        const page = state.book.pages[state.activePageIndex];
        if (!page) return;
        const maxZ = page.elements.reduce((max, e) => Math.max(max, e.z || 0), 0);
        const newEl = { ...el, z: maxZ + 1 };
        page.elements.push(newEl);
        state.selectedIds = [newEl.id];
      }),

    updateElement: (id, updates) =>
      set((state) => {
        if (!state.book) return;
        pushHistory(state);
        const page = state.book.pages[state.activePageIndex];
        if (!page) return;
        const el = page.elements.find((e) => e.id === id);
        if (el && !el.locked) {
          Object.assign(el, updates);
        }
      }),

    updateElements: (items) =>
      set((state) => {
        if (!state.book) return;
        pushHistory(state);
        const page = state.book.pages[state.activePageIndex];
        if (!page) return;
        for (const item of items) {
          const el = page.elements.find((e) => e.id === item.id);
          if (el && !el.locked) {
            Object.assign(el, item.updates);
          }
        }
      }),

    deleteSelected: () =>
      set((state) => {
        if (!state.book || state.selectedIds.length === 0) return;
        pushHistory(state);
        const page = state.book.pages[state.activePageIndex];
        if (!page) return;
        page.elements = page.elements.filter(
          (e) => !state.selectedIds.includes(e.id)
        );
        if (page.elements.length === 0) {
          page.layoutId = undefined;
        }
        state.selectedIds = [];
        state.guides = { vertical: [], horizontal: [] };
        state.saveStatus = "unsaved";
      }),

    duplicateSelected: () =>
      set((state) => {
        if (!state.book || state.selectedIds.length === 0) return;
        pushHistory(state);
        const page = state.book.pages[state.activePageIndex];
        if (!page) return;
        const newIds: string[] = [];
        const maxZ = page.elements.reduce((max, e) => Math.max(max, e.z || 0), 0);

        for (let i = 0; i < page.elements.length; i++) {
          const el = page.elements[i];
          if (state.selectedIds.includes(el.id)) {
            const copyId = `el-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
            const duplicated: El = {
              ...JSON.parse(JSON.stringify(el)),
              id: copyId,
              x: el.x + 5, // offset 5mm
              y: el.y + 5,
              z: maxZ + i + 1,
            };
            page.elements.push(duplicated);
            newIds.push(copyId);
          }
        }
        state.selectedIds = newIds;
      }),

    nudgeSelected: (dxMm, dyMm) =>
      set((state) => {
        if (!state.book || state.selectedIds.length === 0) return;
        pushHistory(state);
        const page = state.book.pages[state.activePageIndex];
        if (!page) return;
        for (const el of page.elements) {
          if (state.selectedIds.includes(el.id) && !el.locked) {
            el.x = Math.round((el.x + dxMm) * 10) / 10;
            el.y = Math.round((el.y + dyMm) * 10) / 10;
          }
        }
      }),

    copySelected: () =>
      set((state) => {
        if (!state.book || state.selectedIds.length === 0) return;
        const page = state.book.pages[state.activePageIndex];
        if (!page) return;
        const copied = page.elements
          .filter((e) => state.selectedIds.includes(e.id))
          .map((e) => JSON.parse(JSON.stringify(e)));
        state.clipboard = copied;
        if (typeof window !== "undefined") {
          try {
            window.sessionStorage.setItem(
              "storybound_clipboard",
              JSON.stringify({ sourcePageIndex: state.activePageIndex, elements: copied })
            );
          } catch {
            // ignore
          }
        }
      }),

    paste: () =>
      set((state) => {
        if (!state.book) return;
        let clipboardElements = state.clipboard;
        let sourcePage = state.activePageIndex;

        if ((!clipboardElements || clipboardElements.length === 0) && typeof window !== "undefined") {
          try {
            const raw = window.sessionStorage.getItem("storybound_clipboard");
            if (raw) {
              const parsed = JSON.parse(raw);
              clipboardElements = parsed.elements || [];
              sourcePage = parsed.sourcePageIndex ?? state.activePageIndex;
            }
          } catch {
            // ignore
          }
        }

        if (!clipboardElements || clipboardElements.length === 0) return;

        pushHistory(state);
        const page = state.book.pages[state.activePageIndex];
        if (!page) return;

        const maxZ = page.elements.reduce((max, e) => Math.max(max, e.z || 0), 0);
        const newIds: string[] = [];
        const isSamePage = sourcePage === state.activePageIndex;
        const offsetMm = isSamePage ? 6 : 0; // On different page: exact same coordinates! On same page: 6mm offset

        for (let i = 0; i < clipboardElements.length; i++) {
          const item = clipboardElements[i];
          const newId = `el-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
          const pasted: El = {
            ...JSON.parse(JSON.stringify(item)),
            id: newId,
            x: Math.max(0, item.x + offsetMm),
            y: Math.max(0, item.y + offsetMm),
            z: maxZ + i + 1,
          };
          page.elements.push(pasted);
          newIds.push(newId);
        }
        state.selectedIds = newIds;
        state.saveStatus = "unsaved";
      }),

    setPageBackground: (color: string, applyToAll = false) =>
      set((state) => {
        if (!state.book) return;
        pushHistory(state);
        if (applyToAll) {
          state.book.pages.forEach((p) => {
            p.bg = color;
          });
        } else {
          const page = state.book.pages[state.activePageIndex];
          if (page) {
            page.bg = color;
          }
        }
        state.saveStatus = "unsaved";
      }),

    bringForward: () =>
      set((state) => {
        if (!state.book || state.selectedIds.length === 0) return;
        pushHistory(state);
        const page = state.book.pages[state.activePageIndex];
        if (!page) return;
        for (const el of page.elements) {
          if (state.selectedIds.includes(el.id)) {
            el.z += 1;
          }
        }
      }),

    sendBackward: () =>
      set((state) => {
        if (!state.book || state.selectedIds.length === 0) return;
        pushHistory(state);
        const page = state.book.pages[state.activePageIndex];
        if (!page) return;
        for (const el of page.elements) {
          if (state.selectedIds.includes(el.id)) {
            el.z = Math.max(0, el.z - 1);
          }
        }
      }),

    bringToFront: () =>
      set((state) => {
        if (!state.book || state.selectedIds.length === 0) return;
        pushHistory(state);
        const page = state.book.pages[state.activePageIndex];
        if (!page) return;
        const maxZ = page.elements.reduce((max, e) => Math.max(max, e.z || 0), 0);
        for (let i = 0; i < page.elements.length; i++) {
          const el = page.elements[i];
          if (state.selectedIds.includes(el.id)) {
            el.z = maxZ + 1 + i;
          }
        }
      }),

    sendToBack: () =>
      set((state) => {
        if (!state.book || state.selectedIds.length === 0) return;
        pushHistory(state);
        const page = state.book.pages[state.activePageIndex];
        if (!page) return;
        for (const el of page.elements) {
          if (state.selectedIds.includes(el.id)) {
            el.z = 0;
          } else {
            el.z += 1;
          }
        }
      }),

    toggleLockSelected: () =>
      set((state) => {
        if (!state.book || state.selectedIds.length === 0) return;
        pushHistory(state);
        const page = state.book.pages[state.activePageIndex];
        if (!page) return;
        const anyLocked = page.elements.some(
          (e) => state.selectedIds.includes(e.id) && e.locked
        );
        for (const el of page.elements) {
          if (state.selectedIds.includes(el.id)) {
            el.locked = !anyLocked;
          }
        }
      }),

    flipHorizontalSelected: () =>
      set((state) => {
        if (!state.book || state.selectedIds.length === 0) return;
        pushHistory(state);
        const page = state.book.pages[state.activePageIndex];
        if (!page) return;
        for (const el of page.elements) {
          if (state.selectedIds.includes(el.id)) {
            el.flipX = !el.flipX;
          }
        }
      }),

    flipVerticalSelected: () =>
      set((state) => {
        if (!state.book || state.selectedIds.length === 0) return;
        pushHistory(state);
        const page = state.book.pages[state.activePageIndex];
        if (!page) return;
        for (const el of page.elements) {
          if (state.selectedIds.includes(el.id)) {
            el.flipY = !el.flipY;
          }
        }
      }),

    copyStyle: () =>
      set((state) => {
        if (!state.book || state.selectedIds.length === 0) return;
        const page = state.book.pages[state.activePageIndex];
        if (!page) return;
        const selected = page.elements.find((e) => state.selectedIds.includes(e.id));
        if (!selected) return;

        if (selected.type === "text") {
          const t = selected as TextEl;
          state.copiedStyle = {
            font: t.font,
            size: t.size,
            weight: t.weight,
            italic: t.italic,
            underline: t.underline,
            strikethrough: t.strikethrough,
            uppercase: t.uppercase,
            color: t.color,
            align: t.align,
            lineHeight: t.lineHeight,
            letterSpacing: t.letterSpacing,
            border: t.border ? { ...t.border } : undefined,
            opacity: t.opacity,
            isHollow: t.isHollow,
            effect: t.effect,
            effectColor: t.effectColor,
            effectIntensity: t.effectIntensity,
            bgPill: t.bgPill ? { ...t.bgPill } : undefined,
          };
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const anyEl = selected as any;
          state.copiedStyle = {
            border: anyEl.border ? { ...anyEl.border } : undefined,
            opacity: selected.opacity,
            fill: anyEl.fill,
            stroke: anyEl.stroke,
          } as Partial<El>;
        }
      }),

    applyCopiedStyle: (targetId: string) =>
      set((state) => {
        if (!state.book || !state.copiedStyle) return;
        pushHistory(state);
        const page = state.book.pages[state.activePageIndex];
        if (!page) return;
        const target = page.elements.find((e) => e.id === targetId);
        if (!target) return;
        Object.assign(target, JSON.parse(JSON.stringify(state.copiedStyle)));
      }),

    toggleMargins: () =>
      set((state) => {
        state.showMargins = !state.showMargins;
      }),

    toggleBleed: () =>
      set((state) => {
        state.showBleed = !state.showBleed;
      }),

    toggleRulers: () =>
      set((state) => {
        state.showRulers = !state.showRulers;
      }),

    undo: () =>
      set((state) => {
        if (!state.book || state.undoStack.length === 0) return;
        const currentPages = JSON.parse(JSON.stringify(state.book.pages));
        state.redoStack.push(currentPages);
        const previous = state.undoStack.pop();
        if (previous) {
          state.book.pages = previous;
          state.selectedIds = [];
        }
      }),

    redo: () =>
      set((state) => {
        if (!state.book || state.redoStack.length === 0) return;
        const currentPages = JSON.parse(JSON.stringify(state.book.pages));
        state.undoStack.push(currentPages);
        const next = state.redoStack.pop();
        if (next) {
          state.book.pages = next;
          state.selectedIds = [];
        }
      }),

    setZoom: (zoom) =>
      set((state) => {
        state.zoom = Math.min(3.0, Math.max(0.25, Math.round(zoom * 100) / 100));
      }),

    setPan: (pan) =>
      set((state) => {
        state.pan = pan;
      }),

    setActiveTool: (tool) =>
      set((state) => {
        state.activeTool = tool;
        if (tool === "pan") state.selectedIds = [];
      }),

    setActivePanel: (panel) =>
      set((state) => {
        state.activePanel = state.activePanel === panel ? null : panel;
      }),

    setGuides: (guides) =>
      set((state) => {
        state.guides = guides;
      }),

    addPage: () =>
      set((state) => {
        if (!state.book) return;
        pushHistory(state);
        const nextPosition = state.book.pages.length + 1;
        const newPage: PageData = {
          id: `page-${state.book.id}-${nextPosition}`,
          position: nextPosition,
          bg: "var(--bg)",
          layoutId: "L02",
          elements: [],
        };
        state.book.pages.push(newPage);
        state.activePageIndex = state.book.pages.length - 1;
      }),

    duplicatePage: (index) =>
      set((state) => {
        if (!state.book || index < 0 || index >= state.book.pages.length) return;
        pushHistory(state);
        const original = state.book.pages[index];
        const copy: PageData = {
          ...JSON.parse(JSON.stringify(original)),
          id: `page-${state.book.id}-${Date.now()}`,
          position: index + 2,
        };
        state.book.pages.splice(index + 1, 0, copy);
        // re-index positions
        state.book.pages.forEach((p, idx) => {
          p.position = idx + 1;
        });
        state.activePageIndex = index + 1;
      }),

    deletePage: (index) =>
      set((state) => {
        if (!state.book || state.book.pages.length <= 1) return;
        pushHistory(state);
        state.book.pages.splice(index, 1);
        state.book.pages.forEach((p, idx) => {
          p.position = idx + 1;
        });
        state.activePageIndex = Math.max(0, index - 1);
        state.selectedIds = [];
      }),

    reorderPages: (fromIndex, toIndex) =>
      set((state) => {
        if (!state.book) return;
        if (fromIndex < 0 || fromIndex >= state.book.pages.length) return;
        if (toIndex < 0 || toIndex >= state.book.pages.length) return;
        if (fromIndex === toIndex) return;

        pushHistory(state);
        const [movedPage] = state.book.pages.splice(fromIndex, 1);
        state.book.pages.splice(toIndex, 0, movedPage);

        // Re-index all positions (1-based)
        state.book.pages.forEach((p, idx) => {
          p.position = idx + 1;
        });

        // Track the moved page as active
        state.activePageIndex = toIndex;
      }),

    saveToStorage: async () => {
      const { book, activePageIndex } = get();
      if (!book || typeof window === "undefined") return;

      set((state) => {
        state.saveStatus = "saving";
      });

      try {
        // 1. Save summary & pages to localStorage
        const storedBooks = JSON.parse(localStorage.getItem("storybound_books") || "[]");
        const index = storedBooks.findIndex((b: { id: string }) => b.id === book.id);
        const summary = {
          id: book.id,
          title: book.title,
          subtitle: book.subtitle,
          author: book.author,
          dates: book.dates,
          size: book.size,
          themeId: book.themeId,
          status: book.status,
          pageCount: book.pages.length,
          updatedAt: "Just now",
        };
        if (index >= 0) {
          storedBooks[index] = { ...storedBooks[index], ...summary };
        } else {
          storedBooks.unshift(summary);
        }
        localStorage.setItem("storybound_books", JSON.stringify(storedBooks));

        // Save pages
        const allPages = JSON.parse(localStorage.getItem("storybound_pages") || "[]");
        const otherPages = allPages.filter((p: { bookId: string }) => p.bookId !== book.id);
        const currentPages = book.pages.map((p) => ({
          id: p.id,
          bookId: book.id,
          position: p.position,
          data: {
            bg: p.bg,
            layoutId: p.layoutId,
            elements: p.elements,
          },
        }));
        localStorage.setItem("storybound_pages", JSON.stringify([...otherPages, ...currentPages]));

        // 2. Persist to IndexedDB offline storage
        await saveBookToIndexedDB(book);

        // 3. Debounced autosave API call to PUT /api/books/:id/pages/:pageId
        const activePage = book.pages[activePageIndex];
        if (activePage) {
          try {
            const res = await fetch(`/api/books/${book.id}/pages/${activePage.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bg: activePage.bg,
                layoutId: activePage.layoutId,
                elements: activePage.elements,
              }),
            });

            if (!res.ok) {
              await enqueueOfflineSave({
                id: `sync-${Date.now()}`,
                bookId: book.id,
                pageId: activePage.id,
                data: activePage,
                timestamp: Date.now(),
                retries: 0,
              });
            }
          } catch {
            await enqueueOfflineSave({
              id: `sync-${Date.now()}`,
              bookId: book.id,
              pageId: activePage.id,
              data: activePage,
              timestamp: Date.now(),
              retries: 0,
            });
          }
        }

        const nowFormatted = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        set((state) => {
          state.saveStatus = "saved";
          state.lastSavedAt = nowFormatted;
        });
      } catch (e) {
        console.error("Autosave failed", e);
        set((state) => {
          state.saveStatus = "error";
        });
      }
    },

    retrySave: async () => {
      await get().saveToStorage();
    },
  }))
);

// Sample initial elements for Day 5 PoC (1 text, 1 image)
export function createSamplePageElements(themeHeadingFont = "Playfair Display"): El[] {
  const sampleImage: ImageEl = {
    id: "sample-image-1",
    type: "image",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
    x: 18,
    y: 20,
    w: 112,
    h: 80,
    rot: 0,
    z: 1,
    frame: "none",
    radius: 4,
    opacity: 1,
  };

  const sampleHeading: TextEl = {
    id: "sample-heading-1",
    type: "text",
    text: "Jaipur Memories",
    font: themeHeadingFont,
    size: 26,
    weight: 600,
    color: "#1A1A1A",
    align: "center",
    lineHeight: 1.2,
    letterSpacing: 0,
    x: 18,
    y: 110,
    w: 112,
    h: 18,
    rot: 0,
    z: 2,
  };

  const sampleBody: TextEl = {
    id: "sample-body-1",
    type: "text",
    text: "The morning light filtered through the ornate jali screens of the City Palace, painting amber mosaics across the courtyard floor.",
    font: "Inter",
    size: 11,
    weight: 400,
    color: "#6B6B66",
    align: "center",
    lineHeight: 1.6,
    letterSpacing: 0,
    x: 22,
    y: 132,
    w: 104,
    h: 24,
    rot: 0,
    z: 3,
  };

  return [sampleImage, sampleHeading, sampleBody];
}

// Pre-designed fun travel cover elements for Page 1 / Cover (User Request: Fun Travel Design)
export function createSampleCoverElements(options?: {
  title?: string;
  subtitle?: string;
  author?: string;
  dates?: string;
  font?: string;
  accent?: string;
}): El[] {
  const headingFont = options?.font || "Playfair Display";
  const bookTitle = options?.title ? options.title.toUpperCase() : "JAIPUR";
  const bookSubtitle = options?.subtitle || "The Royal Travel Diary & Wanderlust Chronicles";
  const authorName = options?.author ? `EXPLORER: ${options.author.toUpperCase()}` : "EXPLORER: TUSHAR JAIN";
  const expeditionDates = options?.dates ? `WINTER EXPEDITION · ${options.dates}` : "WINTER EXPEDITION · 2026";

  // 1. Travel Expedition Pill Badge
  const coverBadge: TextEl = {
    id: "cover-badge-1",
    type: "text",
    text: "★ EXPEDITION LOG · 26.9124° N, 75.7873° E · VOL. 01 ★",
    font: "Space Grotesk",
    size: 7.5,
    weight: 600,
    color: "#7A1F2B",
    align: "center",
    lineHeight: 1.2,
    letterSpacing: 1.5,
    x: 14,
    y: 12,
    w: 120,
    h: 8,
    rot: 0,
    z: 1,
    themeToken: "accent",
  };

  // 2. Bold Cover Title
  const coverTitle: TextEl = {
    id: "cover-title-1",
    type: "text",
    text: bookTitle,
    font: headingFont,
    size: 32,
    weight: 800,
    color: "#1A1A1A",
    align: "center",
    lineHeight: 1.1,
    letterSpacing: 3,
    x: 14,
    y: 22,
    w: 120,
    h: 20,
    rot: 0,
    z: 2,
    themeToken: "primary",
  };

  // 3. Subtitle / Tagline
  const coverSubtitle: TextEl = {
    id: "cover-subtitle-1",
    type: "text",
    text: bookSubtitle,
    font: "Caveat",
    size: 13,
    weight: 500,
    color: "#6A5D43",
    align: "center",
    lineHeight: 1.25,
    letterSpacing: 0.2,
    x: 14,
    y: 44,
    w: 120,
    h: 9,
    rot: 0,
    z: 3,
    themeToken: "accent",
  };

  // 4. Polaroid Travel Photo (with slight fun tilt)
  const coverHero: ImageEl = {
    id: "cover-hero-1",
    type: "image",
    src: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&auto=format&fit=crop&q=80",
    x: 28,
    y: 55,
    w: 92,
    h: 98,
    rot: 1.5,
    z: 4,
    frame: "polaroid",
    radius: 2,
    opacity: 1,
  };

  // 5. Washi Tape sticker on top of polaroid
  const coverTape: ShapeEl = {
    id: "cover-tape-1",
    type: "shape",
    shape: "tape",
    x: 56,
    y: 51,
    w: 36,
    h: 7,
    rot: -2,
    z: 5,
    fill: "rgba(220, 185, 120, 0.78)",
    themeToken: "accent",
  };

  // 6. Vintage Air Mail / Wanderlust Stamp in the corner
  const coverStamp: ShapeEl = {
    id: "cover-stamp-1",
    type: "shape",
    shape: "stamp-wanderlust",
    x: 110,
    y: 136,
    w: 25,
    h: 25,
    rot: 12,
    z: 6,
    stroke: "#7A1F2B",
    strokeW: 0.8,
    themeToken: "accent",
  };

  // 7. Compass travel icon
  const coverCompass: IconEl = {
    id: "cover-compass-1",
    type: "icon",
    iconId: "compass",
    color: "#7A1F2B",
    x: 14,
    y: 142,
    w: 16,
    h: 16,
    rot: -8,
    z: 7,
  };

  // 8. Explorer Credits
  const coverAuthor: TextEl = {
    id: "cover-author-1",
    type: "text",
    text: `${authorName} · ${expeditionDates}`,
    font: "Inter",
    size: 8.5,
    weight: 600,
    color: "#1A1A1A",
    align: "center",
    lineHeight: 1.4,
    letterSpacing: 1.2,
    x: 14,
    y: 172,
    w: 120,
    h: 10,
    rot: 0,
    z: 8,
  };

  // 9. Edition Line
  const coverEdition: TextEl = {
    id: "cover-edition-1",
    type: "text",
    text: "Handcrafted Keepsake Edition · Storybound Press",
    font: "Lora",
    size: 8.5,
    weight: 400,
    italic: true,
    color: "#858383",
    align: "center",
    lineHeight: 1.3,
    letterSpacing: 0.5,
    x: 14,
    y: 184,
    w: 120,
    h: 9,
    rot: 0,
    z: 9,
  };

  return [
    coverBadge,
    coverTitle,
    coverSubtitle,
    coverHero,
    coverTape,
    coverStamp,
    coverCompass,
    coverAuthor,
    coverEdition,
  ];
}
