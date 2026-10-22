"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  name: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface BookSummary {
  id: string;
  userId: string;
  title: string;
  subtitle?: string;
  author?: string;
  dates?: string;
  bookType?: string;
  size: string;
  themeId: string;
  status: "draft" | "exported" | "ordered";
  pageCount: number;
  updatedAt: string;
  coverFront?: {
    title: string;
    subtitle?: string;
    author?: string;
    dates?: string;
    themeId: string;
  };
}

export interface CreateBookParams {
  title: string;
  subtitle?: string;
  author?: string;
  dates?: string;
  bookType?: string;
  size?: string;
  themeId?: string;
}

export interface BookPage {
  id: string;
  bookId: string;
  position: number;
  data: {
    bg: string;
    layoutId?: string;
    elements: unknown[];
  };
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getUserBooks: () => BookSummary[];
  getBookById: (bookId: string) => BookSummary | undefined;
  getBookPages: (bookId: string) => BookPage[];
  createBook: (params: CreateBookParams | string, size?: string, themeId?: string) => BookSummary;
  duplicateBook: (bookId: string) => BookSummary | undefined;
  deleteBook: (bookId: string) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const SEED_USERS: User[] = [
  {
    id: "user-tushar-01",
    email: "tushar@storybound.app",
    name: "Tushar Gupta",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-sarah-02",
    email: "sarah@storybound.app",
    name: "Sarah Jenkins",
    createdAt: new Date().toISOString(),
  },
];

const SEED_BOOKS: BookSummary[] = [
  {
    id: "book-jaipur-101",
    userId: "user-tushar-01",
    title: "Jaipur Diary 2026",
    subtitle: "A royal journey through the Pink City",
    author: "Tushar Gupta",
    dates: "Jan 12 - Jan 18, 2026",
    bookType: "Travel Diary",
    size: "A5",
    themeId: "royal-india",
    status: "draft",
    pageCount: 20,
    updatedAt: "Just now",
  },
  {
    id: "book-goa-202",
    userId: "user-sarah-02",
    title: "Goa Beach Memories",
    subtitle: "Sunsets and coastal trails",
    author: "Sarah Jenkins",
    dates: "Dec 2025",
    bookType: "Memory Book",
    size: "Square",
    themeId: "polaroid-scrapbook",
    status: "draft",
    pageCount: 16,
    updatedAt: "Yesterday",
  },
];

const USERS_KEY = "storybound_users";
const BOOKS_KEY = "storybound_books";
const PAGES_KEY = "storybound_pages";
const SESSION_COOKIE = "storybound_session";

function setSessionCookie(user: User | null) {
  if (typeof document === "undefined") return;
  if (!user) {
    document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  } else {
    const sessionData = JSON.stringify({ userId: user.id, email: user.email, name: user.name });
    document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(sessionData)}; path=/; max-age=604800; SameSite=Lax`;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Initialize storage & session
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize seed users if absent
    const storedUsersJson = localStorage.getItem(USERS_KEY);
    if (!storedUsersJson) {
      localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
    }

    // Initialize seed books if absent
    const storedBooksJson = localStorage.getItem(BOOKS_KEY);
    if (!storedBooksJson) {
      localStorage.setItem(BOOKS_KEY, JSON.stringify(SEED_BOOKS));
    }

    // Check existing session
    const currentSession = localStorage.getItem("storybound_current_user");
    if (currentSession) {
      try {
        const parsedUser: User = JSON.parse(currentSession);
        setUser(parsedUser);
        setProfile({
          id: parsedUser.id,
          name: parsedUser.name,
          isAdmin: false,
          createdAt: parsedUser.createdAt,
        });
        setSessionCookie(parsedUser);
      } catch {
        localStorage.removeItem("storybound_current_user");
        setSessionCookie(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!email.trim()) {
      return { success: false, error: "Please enter an email address." };
    }

    const storedUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    let existingUser = storedUsers.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());

    if (!existingUser) {
      const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      existingUser = {
        id: `user-${Date.now()}`,
        email: email.trim().toLowerCase(),
        name,
        createdAt: new Date().toISOString(),
      };
      storedUsers.push(existingUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(storedUsers));
    }

    setUser(existingUser);
    setProfile({
      id: existingUser.id,
      name: existingUser.name,
      isAdmin: false,
      createdAt: existingUser.createdAt,
    });
    localStorage.setItem("storybound_current_user", JSON.stringify(existingUser));
    setSessionCookie(existingUser);

    return { success: true };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    const googleUser: User = {
      id: "google-user-999",
      email: "google.user@example.com",
      name: "Google Explorer",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
      createdAt: new Date().toISOString(),
    };

    const storedUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    if (!storedUsers.some((u) => u.id === googleUser.id)) {
      storedUsers.push(googleUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(storedUsers));
    }

    setUser(googleUser);
    setProfile({
      id: googleUser.id,
      name: googleUser.name,
      isAdmin: false,
      createdAt: googleUser.createdAt,
    });
    localStorage.setItem("storybound_current_user", JSON.stringify(googleUser));
    setSessionCookie(googleUser);

    return { success: true };
  };

  const signup = async (
    name: string,
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!name.trim() || !email.trim()) {
      return { success: false, error: "Please provide both your name and email." };
    }

    const storedUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const existing = storedUsers.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (existing) {
      return { success: false, error: "An account with this email already exists. Please log in." };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
    };

    storedUsers.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(storedUsers));

    setUser(newUser);
    setProfile({
      id: newUser.id,
      name: newUser.name,
      isAdmin: false,
      createdAt: newUser.createdAt,
    });
    localStorage.setItem("storybound_current_user", JSON.stringify(newUser));
    setSessionCookie(newUser);

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem("storybound_current_user");
    setSessionCookie(null);
    router.push("/login");
  };

  // Row Level Security (RLS) Filter: Filter strictly by current user's id
  const getUserBooks = (): BookSummary[] => {
    if (!user) return [];
    const allBooks: BookSummary[] = JSON.parse(localStorage.getItem(BOOKS_KEY) || "[]");
    return allBooks.filter((book) => book.userId === user.id);
  };

  const getBookById = (bookId: string): BookSummary | undefined => {
    if (!user) return undefined;
    const allBooks: BookSummary[] = JSON.parse(localStorage.getItem(BOOKS_KEY) || "[]");
    return allBooks.find((book) => book.id === bookId && book.userId === user.id);
  };

  const getBookPages = (bookId: string): BookPage[] => {
    if (!user) return [];
    const allPages: BookPage[] = JSON.parse(localStorage.getItem(PAGES_KEY) || "[]");
    return allPages.filter((page) => page.bookId === bookId);
  };

  const createBook = (
    params: CreateBookParams | string,
    sizeParam = "A5",
    themeIdParam = "minimal-memories"
  ): BookSummary => {
    if (!user) throw new Error("Must be logged in to create a book");

    let title = "Untitled Book";
    let subtitle = "";
    let author = user.name;
    let dates = "";
    let bookType = "Travel Diary";
    let size = sizeParam;
    let themeId = themeIdParam;

    if (typeof params === "string") {
      title = params.trim() || title;
    } else {
      title = params.title?.trim() || title;
      subtitle = params.subtitle?.trim() || "";
      author = params.author?.trim() || user.name;
      dates = params.dates?.trim() || "";
      bookType = params.bookType || bookType;
      size = params.size || size;
      themeId = params.themeId || themeId;
    }

    const newBookId = `book-${Date.now()}`;
    const allBooks: BookSummary[] = JSON.parse(localStorage.getItem(BOOKS_KEY) || "[]");

    const newBook: BookSummary = {
      id: newBookId,
      userId: user.id,
      title,
      subtitle,
      author,
      dates,
      bookType,
      size,
      themeId,
      status: "draft",
      pageCount: 20,
      updatedAt: "Just now",
      coverFront: {
        title,
        subtitle,
        author,
        dates,
        themeId,
      },
    };

    allBooks.unshift(newBook);
    localStorage.setItem(BOOKS_KEY, JSON.stringify(allBooks));

    // Create 20 blank pages for the book
    const allPages: BookPage[] = JSON.parse(localStorage.getItem(PAGES_KEY) || "[]");
    const newPages: BookPage[] = Array.from({ length: 20 }, (_, i) => ({
      id: `page-${newBookId}-${i + 1}`,
      bookId: newBookId,
      position: i + 1,
      data: {
        bg: "var(--bg)",
        layoutId: i === 0 ? "L07" : i === 1 ? "L01" : i === 2 ? "L02" : "L03",
        elements: [],
      },
    }));

    localStorage.setItem(PAGES_KEY, JSON.stringify([...allPages, ...newPages]));

    return newBook;
  };

  const duplicateBook = (bookId: string): BookSummary | undefined => {
    if (!user) return undefined;
    const allBooks: BookSummary[] = JSON.parse(localStorage.getItem(BOOKS_KEY) || "[]");
    const original = allBooks.find((b) => b.id === bookId && b.userId === user.id);
    if (!original) return undefined;

    const newBookId = `book-${Date.now()}`;
    const duplicate: BookSummary = {
      ...original,
      id: newBookId,
      title: `${original.title} (Copy)`,
      updatedAt: "Just now",
    };

    allBooks.unshift(duplicate);
    localStorage.setItem(BOOKS_KEY, JSON.stringify(allBooks));

    // Duplicate pages
    const allPages: BookPage[] = JSON.parse(localStorage.getItem(PAGES_KEY) || "[]");
    const originalPages = allPages.filter((p) => p.bookId === bookId);
    const duplicatedPages: BookPage[] = originalPages.map((p, i) => ({
      id: `page-${newBookId}-${i + 1}`,
      bookId: newBookId,
      position: p.position,
      data: { ...p.data },
    }));

    localStorage.setItem(PAGES_KEY, JSON.stringify([...allPages, ...duplicatedPages]));

    return duplicate;
  };

  const deleteBook = (bookId: string) => {
    if (!user) return;
    const allBooks: BookSummary[] = JSON.parse(localStorage.getItem(BOOKS_KEY) || "[]");
    const filteredBooks = allBooks.filter((book) => !(book.id === bookId && book.userId === user.id));
    localStorage.setItem(BOOKS_KEY, JSON.stringify(filteredBooks));

    // Remove pages associated with book
    const allPages: BookPage[] = JSON.parse(localStorage.getItem(PAGES_KEY) || "[]");
    const filteredPages = allPages.filter((page) => page.bookId !== bookId);
    localStorage.setItem(PAGES_KEY, JSON.stringify(filteredPages));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        login,
        loginWithGoogle,
        signup,
        logout,
        getUserBooks,
        getBookById,
        getBookPages,
        createBook,
        duplicateBook,
        deleteBook,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
