"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Plus,
  LogOut,
  Shield,
  Trash2,
  Copy,
  Calendar,
  Layers,
  UserCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth, BookSummary } from "@/lib/auth/auth-context";
import { getThemeById } from "@/lib/themes";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, getUserBooks, duplicateBook, deleteBook, login } = useAuth();

  const [books, setBooks] = React.useState<BookSummary[]>([]);
  const [deleteCandidate, setDeleteCandidate] = React.useState<BookSummary | null>(null);
  const [actionNotice, setActionNotice] = React.useState<string | null>(null);

  // Load books for currently logged-in user
  const reloadBooks = React.useCallback(() => {
    if (user) {
      setBooks(getUserBooks());
    }
  }, [user, getUserBooks]);

  React.useEffect(() => {
    reloadBooks();
  }, [reloadBooks]);

  const handleDuplicate = (bookId: string) => {
    const copy = duplicateBook(bookId);
    if (copy) {
      setActionNotice(`Created duplicate: "${copy.title}"`);
      setTimeout(() => setActionNotice(null), 3000);
      reloadBooks();
    }
  };

  const confirmDelete = () => {
    if (deleteCandidate) {
      deleteBook(deleteCandidate.id);
      setActionNotice(`Deleted "${deleteCandidate.title}"`);
      setTimeout(() => setActionNotice(null), 3000);
      setDeleteCandidate(null);
      reloadBooks();
    }
  };

  const handleSwitchUser = async (demoEmail: string) => {
    await login(demoEmail);
    router.refresh();
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <p className="text-sm text-text-muted">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent-soft selection:text-text">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-accent text-white">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="font-serif text-lg font-semibold tracking-tight text-accent">
                Storybound
              </span>
            </Link>
            <span className="text-xs text-text-muted">/ Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="font-medium text-text">{user.name}</span>
              <span className="text-text-muted font-mono">({user.email})</span>
            </div>

            <Button variant="ghost" size="sm" onClick={logout} className="text-xs text-text-muted hover:text-danger">
              <LogOut className="mr-1.5 h-3.5 w-3.5" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Action notification toast */}
        {actionNotice && (
          <div className="mb-6 rounded-[8px] border border-accent/20 bg-accent text-white px-4 py-2.5 text-xs shadow-md animate-in fade-in duration-200">
            {actionNotice}
          </div>
        )}

        {/* RLS Multi-User Security Demonstration Card */}
        <div className="mb-8 rounded-[10px] border border-border bg-surface p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-success">
                <Shield className="h-3.5 w-3.5" />
                Row Level Security (RLS) Active
              </div>
              <h2 className="text-sm text-text">
                Authenticated User: <strong className="font-medium text-text">{user.name}</strong>{" "}
                <span className="font-mono text-xs text-text-muted">[{user.id}]</span>
              </h2>
              <p className="text-xs text-text-muted">
                Storage query: <code className="rounded bg-accent-soft px-1.5 py-0.5 text-text font-mono text-[11px]">WHERE user_id = &apos;{user.id}&apos;</code> — Strict data boundary enforced.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-text-muted">Switch User:</span>
              <Button
                variant={user.email === "tushar@storybound.app" ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs"
                onClick={() => handleSwitchUser("tushar@storybound.app")}
              >
                <UserCheck className="mr-1 h-3 w-3" />
                Tushar
              </Button>
              <Button
                variant={user.email === "sarah@storybound.app" ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs"
                onClick={() => handleSwitchUser("sarah@storybound.app")}
              >
                <UserCheck className="mr-1 h-3 w-3" />
                Sarah
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Title & Actions */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-medium tracking-tight text-text">
              My Books
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              {books.length} {books.length === 1 ? "book" : "books"} private to your account
            </p>
          </div>

          <Link href="/books/new">
            <Button className="h-10 px-5 text-sm">
              <Plus className="mr-1.5 h-4 w-4" />
              New Book
            </Button>
          </Link>
        </div>

        {/* Books Grid */}
        {books.length === 0 ? (
          <Card className="border-dashed border-2 border-border bg-surface/50 p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-text-muted">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-medium text-text">No books yet</h3>
            <p className="mt-1 text-sm text-text-muted max-w-sm mx-auto">
              You haven&apos;t started any books under this account. Launch the creation wizard to design your first book.
            </p>
            <div className="mt-6">
              <Link href="/books/new">
                <Button>
                  <Plus className="mr-1.5 h-4 w-4" />
                  Launch Book Wizard
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => {
              const theme = getThemeById(book.themeId);
              return (
                <Card key={book.id} className="group overflow-hidden border border-border bg-surface transition-all duration-200 hover:shadow-card flex flex-col justify-between">
                  {/* Book Cover Thumbnail Placeholder */}
                  <div
                    className="relative aspect-[3/4] p-6 flex flex-col justify-between border-b border-border transition-colors"
                    style={{ backgroundColor: theme?.palette.bg || "var(--accent-soft)" }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-surface/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-text-muted border border-border/60">
                        {book.size} · {book.status}
                      </span>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-text-muted hover:text-text hover:bg-surface/80"
                          onClick={() => handleDuplicate(book.id)}
                          title="Duplicate book"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-text-muted hover:text-danger hover:bg-surface/80"
                          onClick={() => setDeleteCandidate(book)}
                          title="Delete book"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-center py-4">
                      <div className="h-0.5 w-8 mx-auto rounded" style={{ backgroundColor: theme?.palette.accent || "var(--accent)" }} />
                      <h3
                        className="font-serif text-xl font-medium tracking-tight line-clamp-2"
                        style={{ color: theme?.palette.primary || "var(--text)" }}
                      >
                        {book.title}
                      </h3>
                      {book.subtitle && (
                        <p className="text-xs italic text-text-muted line-clamp-1">
                          {book.subtitle}
                        </p>
                      )}
                      <p className="text-[11px] font-mono text-text-muted">
                        Theme: {theme?.name || book.themeId}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-text-muted border-t border-border/60 pt-3">
                      <span className="flex items-center gap-1">
                        <Layers className="h-3 w-3" /> {book.pageCount} pages
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {book.updatedAt}
                      </span>
                    </div>
                  </div>

                  {/* Actions Strip */}
                  <div className="p-4 bg-surface flex items-center justify-between border-t border-border/60">
                    <span className="text-xs text-text-muted">
                      {book.bookType || "Book"}
                    </span>
                    <Link href={`/books/${book.id}/edit`}>
                      <Button size="sm" className="h-8 text-xs gap-1.5">
                        <span>Open Editor</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteCandidate} onOpenChange={(open) => !open && setDeleteCandidate(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">Delete Book?</DialogTitle>
              <DialogDescription>
                Are you sure you want to permanently delete &ldquo;{deleteCandidate?.title}&rdquo; and all of its 20 pages?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4 gap-2">
              <Button variant="outline" onClick={() => setDeleteCandidate(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete Book Permanently
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
