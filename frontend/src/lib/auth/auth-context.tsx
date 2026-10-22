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
  size: string;
  themeId: string;
  status: "draft" | "exported" | "ordered";
  pageCount: number;
  updatedAt: string;
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
  createBook: (title: string, size?: string, themeId?: string) => BookSummary;
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
    size: "Square",
    themeId: "polaroid-scrapbook",
    status: "draft",
    pageCount: 16,
    updatedAt: "Yesterday",
  },
];

const USERS_KEY = "storybound_users";
const BOOKS_KEY = "storybound_books";
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
      // Auto-register on login if not found to provide smooth prototype experience
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

    // Auto-create profile trigger simulation
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

  // Row Level Security (RLS) Simulation: Filter strictly by current user's id
  const getUserBooks = (): BookSummary[] => {
    if (!user) return [];
    const allBooks: BookSummary[] = JSON.parse(localStorage.getItem(BOOKS_KEY) || "[]");
    // RLS: user_id = auth.uid()
    return allBooks.filter((book) => book.userId === user.id);
  };

  const createBook = (title: string, size = "A5", themeId = "minimal-memories"): BookSummary => {
    if (!user) throw new Error("Must be logged in to create a book");
    const allBooks: BookSummary[] = JSON.parse(localStorage.getItem(BOOKS_KEY) || "[]");
    const newBook: BookSummary = {
      id: `book-${Date.now()}`,
      userId: user.id,
      title: title.trim() || "Untitled Book",
      size,
      themeId,
      status: "draft",
      pageCount: 20,
      updatedAt: "Just now",
    };
    allBooks.unshift(newBook);
    localStorage.setItem(BOOKS_KEY, JSON.stringify(allBooks));
    return newBook;
  };

  const deleteBook = (bookId: string) => {
    if (!user) return;
    const allBooks: BookSummary[] = JSON.parse(localStorage.getItem(BOOKS_KEY) || "[]");
    // RLS check: verify user owns this book before deleting
    const filtered = allBooks.filter((book) => !(book.id === bookId && book.userId === user.id));
    localStorage.setItem(BOOKS_KEY, JSON.stringify(filtered));
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
        createBook,
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
