import { BookModel, PageData } from "@/lib/editor/types";

const DB_NAME = "storybound_db";
const DB_VERSION = 1;

export interface UploadedAsset {
  id: string;
  name: string;
  dataUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  size: number;
  mimeType: string;
  createdAt: string;
}

export interface OfflinePendingSave {
  id: string;
  bookId: string;
  pageId: string;
  data: any;
  timestamp: number;
  retries: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this environment"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains("books")) {
        db.createObjectStore("books", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("pages")) {
        const pageStore = db.createObjectStore("pages", { keyPath: "id" });
        pageStore.createIndex("bookId", "bookId", { unique: false });
      }

      if (!db.objectStoreNames.contains("assets")) {
        db.createObjectStore("assets", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("offlineQueue")) {
        db.createObjectStore("offlineQueue", { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Save a book model to IndexedDB
export async function saveBookToIndexedDB(book: BookModel): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(["books", "pages"], "readwrite");

    const bookStore = tx.objectStore("books");
    const bookSummary = {
      id: book.id,
      userId: book.userId,
      title: book.title,
      subtitle: book.subtitle,
      author: book.author,
      dates: book.dates,
      size: book.size,
      themeId: book.themeId,
      status: book.status,
      pageCount: book.pages.length,
      updatedAt: new Date().toISOString(),
    };
    bookStore.put(bookSummary);

    const pageStore = tx.objectStore("pages");
    for (const page of book.pages) {
      pageStore.put({
        id: page.id,
        bookId: book.id,
        position: page.position,
        data: {
          bg: page.bg,
          layoutId: page.layoutId,
          elements: page.elements,
        },
        updatedAt: new Date().toISOString(),
      });
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.warn("IndexedDB book save fallback error:", error);
  }
}

// Load book and its pages from IndexedDB
export async function loadBookFromIndexedDB(bookId: string): Promise<BookModel | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(["books", "pages"], "readonly");

    const bookStore = tx.objectStore("books");
    const bookRequest = bookStore.get(bookId);

    const rawBook = await new Promise<any>((resolve, reject) => {
      bookRequest.onsuccess = () => resolve(bookRequest.result);
      bookRequest.onerror = () => reject(bookRequest.error);
    });

    if (!rawBook) return null;

    const pageStore = tx.objectStore("pages");
    const pageIndex = pageStore.index("bookId");
    const pagesRequest = pageIndex.getAll(bookId);

    const rawPages = await new Promise<any[]>((resolve, reject) => {
      pagesRequest.onsuccess = () => resolve(pagesRequest.result || []);
      pagesRequest.onerror = () => reject(pagesRequest.error);
    });

    // Sort by position
    rawPages.sort((a, b) => (a.position || 0) - (b.position || 0));

    const pages: PageData[] = rawPages.map((p, idx) => ({
      id: p.id || `p-${bookId}-${idx + 1}`,
      position: p.position || idx + 1,
      bg: p.data?.bg || "#FAFAF8",
      layoutId: p.data?.layoutId || "L02",
      elements: p.data?.elements || [],
    }));

    return {
      id: rawBook.id,
      userId: rawBook.userId,
      title: rawBook.title,
      subtitle: rawBook.subtitle,
      author: rawBook.author,
      dates: rawBook.dates,
      size: rawBook.size,
      themeId: rawBook.themeId,
      status: rawBook.status,
      pages,
    };
  } catch (error) {
    console.warn("IndexedDB book load fallback error:", error);
    return null;
  }
}

// Save uploaded image asset into IndexedDB
export async function saveAssetToIndexedDB(asset: UploadedAsset): Promise<void> {
  const db = await openDB();
  const tx = db.transaction("assets", "readwrite");
  tx.objectStore("assets").put(asset);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Load all uploaded assets from IndexedDB
export async function loadAssetsFromIndexedDB(): Promise<UploadedAsset[]> {
  try {
    const db = await openDB();
    const tx = db.transaction("assets", "readonly");
    const request = tx.objectStore("assets").getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const assets = request.result || [];
        // sort by newest first
        assets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(assets);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn("IndexedDB loadAssets error:", error);
    return [];
  }
}

// Delete an asset from IndexedDB
export async function deleteAssetFromIndexedDB(id: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction("assets", "readwrite");
  tx.objectStore("assets").delete(id);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Offline queue: enqueue a pending page save
export async function enqueueOfflineSave(pending: OfflinePendingSave): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction("offlineQueue", "readwrite");
    tx.objectStore("offlineQueue").put(pending);
  } catch (e) {
    console.warn("Failed to enqueue offline save:", e);
  }
}

// Flush pending offline saves when connection is restored
export async function flushOfflineQueue(): Promise<number> {
  try {
    const db = await openDB();
    const tx = db.transaction("offlineQueue", "readonly");
    const request = tx.objectStore("offlineQueue").getAll();

    const queue: OfflinePendingSave[] = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });

    if (queue.length === 0) return 0;

    let successful = 0;
    for (const item of queue) {
      try {
        const res = await fetch(`/api/books/${item.bookId}/pages/${item.pageId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item.data),
        });

        if (res.ok) {
          const deleteTx = db.transaction("offlineQueue", "readwrite");
          deleteTx.objectStore("offlineQueue").delete(item.id);
          successful++;
        }
      } catch {
        // still offline or server unreachable, leave in queue
      }
    }

    return successful;
  } catch (e) {
    console.warn("Error flushing offline queue:", e);
    return 0;
  }
}
