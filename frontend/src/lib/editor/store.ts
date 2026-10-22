import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { BookModel, El, PageData, TextEl, ImageEl, ShapeEl } from "./types";
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

  // Actions
  setBook: (book: BookModel) => void;
  setActivePage: (index: number) => void;
  selectElement: (id: string, multi?: boolean) => void;
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
          (e) => !state.selectedIds.includes(e.id) || e.locked
        );
        state.selectedIds = [];
        state.guides = { vertical: [], horizontal: [] };
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
        state.clipboard = page.elements
          .filter((e) => state.selectedIds.includes(e.id))
          .map((e) => JSON.parse(JSON.stringify(e)));
      }),

    paste: () =>
      set((state) => {
        if (!state.book || !state.clipboard || state.clipboard.length === 0) return;
        pushHistory(state);
        const page = state.book.pages[state.activePageIndex];
        if (!page) return;
        const maxZ = page.elements.reduce((max, e) => Math.max(max, e.z || 0), 0);
        const newIds: string[] = [];

        for (let i = 0; i < state.clipboard.length; i++) {
          const item = state.clipboard[i];
          const newId = `el-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
          const pasted: El = {
            ...JSON.parse(JSON.stringify(item)),
            id: newId,
            x: item.x + 8,
            y: item.y + 8,
            z: maxZ + i + 1,
          };
          page.elements.push(pasted);
          newIds.push(newId);
        }
        state.selectedIds = newIds;
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

// Pre-designed cover elements for Page 1 / Cover (Day 6+ / User request #2)
export function createSampleCoverElements(options?: {
  title?: string;
  subtitle?: string;
  author?: string;
  dates?: string;
  font?: string;
  accent?: string;
}): El[] {
  const headingFont = options?.font || "Playfair Display";
  const accentColor = options?.accent || "#B8A88A";
  const bookTitle = options?.title || "Jaipur Trip 2026";
  const bookSubtitle = options?.subtitle || "Memories & Architecture of the Pink City";
  const authorName = options?.author ? `By ${options.author}` : "By Tushar Jain";
  const editionYear = options?.dates || "Winter 2026 · Limited Edition";

  // 1. Cover Title
  const coverTitle: TextEl = {
    id: "cover-title-1",
    type: "text",
    text: bookTitle,
    font: headingFont,
    size: 28,
    weight: 700,
    color: "#1A1A1A",
    align: "center",
    lineHeight: 1.15,
    letterSpacing: 0.5,
    x: 14,
    y: 24,
    w: 120,
    h: 22,
    rot: 0,
    z: 2,
    themeToken: "primary",
  };

  // 2. Gold Flourish Divider
  const goldDivider: ShapeEl = {
    id: "cover-divider-1",
    type: "shape",
    shape: "divider-rule",
    x: 34,
    y: 48,
    w: 80,
    h: 4,
    rot: 0,
    z: 3,
    stroke: accentColor,
    strokeW: 0.75,
    themeToken: "accent",
  };

  // 3. Hero Cover Keepsake Photo
  const coverHero: ImageEl = {
    id: "cover-hero-1",
    type: "image",
    src: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&auto=format&fit=crop&q=80",
    x: 18,
    y: 56,
    w: 112,
    h: 96,
    rot: 0,
    z: 1,
    frame: "none",
    radius: 3,
    border: { w: 0.8, color: "#D4D0C8", style: "solid" },
    opacity: 1,
  };

  // 4. Subtitle
  const coverSubtitle: TextEl = {
    id: "cover-subtitle-1",
    type: "text",
    text: bookSubtitle,
    font: headingFont,
    size: 13,
    weight: 400,
    italic: true,
    color: "#6A5D43",
    align: "center",
    lineHeight: 1.3,
    letterSpacing: 0,
    x: 16,
    y: 158,
    w: 116,
    h: 16,
    rot: 0,
    z: 4,
    themeToken: "accent",
  };

  // 5. Cute Storybound Book Emblem
  const coverEmblem: ShapeEl = {
    id: "cover-emblem-1",
    type: "shape",
    shape: "cute-book",
    x: 64,
    y: 176,
    w: 20,
    h: 16,
    rot: 0,
    z: 5,
    fill: accentColor,
    themeToken: "accent",
  };

  // 6. Author & Edition Line
  const coverAuthor: TextEl = {
    id: "cover-author-1",
    type: "text",
    text: `${authorName} · ${editionYear}`,
    font: "Inter",
    size: 9.5,
    weight: 500,
    color: "#858383",
    align: "center",
    lineHeight: 1.4,
    letterSpacing: 1.2,
    x: 16,
    y: 194,
    w: 116,
    h: 10,
    rot: 0,
    z: 6,
    themeToken: "muted",
  };

  return [coverTitle, goldDivider, coverHero, coverSubtitle, coverEmblem, coverAuthor];
}
