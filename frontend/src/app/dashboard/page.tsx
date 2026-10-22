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
  Calendar,
  Layers,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth, BookSummary } from "@/lib/auth/auth-context";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, getUserBooks, createBook, deleteBook, login } = useAuth();

  const [books, setBooks] = React.useState<BookSummary[]>([]);
  const [newBookTitle, setNewBookTitle] = React.useState("");
  const [newBookSize, setNewBookSize] = React.useState("A5");
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // Load books for currently logged-in user
  const reloadBooks = React.useCallback(() => {
    if (user) {
      setBooks(getUserBooks());
    }
  }, [user, getUserBooks]);

  React.useEffect(() => {
    reloadBooks();
  }, [reloadBooks]);

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle.trim()) return;
    createBook(newBookTitle.trim(), newBookSize);
    setNewBookTitle("");
    setDialogOpen(false);
    reloadBooks();
  };

  const handleDeleteBook = (bookId: string) => {
    deleteBook(bookId);
    reloadBooks();
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
    <div className="min-h-screen bg-bg text-text">
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
                Storage query: <code className="rounded bg-accent-soft px-1.5 py-0.5 text-text font-mono text-[11px]">SELECT * FROM books WHERE user_id = auth.uid()</code> — Other users cannot read or modify these records.
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

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-1.5 h-4 w-4" />
                Create New Book
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-serif text-xl">Create a New Book</DialogTitle>
                <DialogDescription>
                  Start a new personal book project. You will be able to customize pages and themes in the editor.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateBook} className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text">Book Title</label>
                  <Input
                    placeholder="e.g. Ladakh Odyssey 2026"
                    value={newBookTitle}
                    onChange={(e) => setNewBookTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text">Book Size</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["A5", "A4", "Square"].map((sizeOption) => (
                      <button
                        key={sizeOption}
                        type="button"
                        onClick={() => setNewBookSize(sizeOption)}
                        className={`rounded-[8px] border p-2.5 text-center text-xs font-medium transition-colors ${
                          newBookSize === sizeOption
                            ? "border-accent bg-accent text-white"
                            : "border-border bg-surface text-text hover:bg-accent-soft"
                        }`}
                      >
                        {sizeOption}
                      </button>
                    ))}
                  </div>
                </div>

                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Book</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Books Grid */}
        {books.length === 0 ? (
          <Card className="border-dashed border-2 border-border bg-surface/50 p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-text-muted">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-medium text-text">No books yet</h3>
            <p className="mt-1 text-sm text-text-muted max-w-sm mx-auto">
              You haven&apos;t started any books under this account. Create your first travel diary or memory album.
            </p>
            <div className="mt-6">
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-1.5 h-4 w-4" />
                Start your first book
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <Card key={book.id} className="group overflow-hidden transition-all duration-200 hover:shadow-card">
                {/* Book Cover Placeholder */}
                <div className="relative aspect-[3/4] bg-accent-soft/70 p-6 flex flex-col justify-between border-b border-border">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-surface px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-text-muted shadow-sm">
                      {book.size} · {book.status}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-text-muted hover:text-danger hover:bg-surface/80"
                      onClick={() => handleDeleteBook(book.id)}
                      title="Delete book"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-1">
                    <div className="h-1 w-8 rounded-full bg-accent" />
                    <h3 className="font-serif text-xl font-medium tracking-tight text-accent line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-text-muted font-sans">
                      Theme: {book.themeId}
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

                <div className="p-4 bg-surface flex items-center justify-between">
                  <span className="text-xs text-text-muted">Ready to edit</span>
                  <Link href={`/books/${book.id}/edit`}>
                    <Button size="sm" variant="outline" className="h-8 text-xs">
                      Open Editor
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
