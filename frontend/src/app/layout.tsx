import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Storybound — Your memories. Your stories. Your handwriting. Your book.",
  description:
    "Design personal books and travel diaries in a minimal editor, write in your own handwriting font, download PDF for ₹50, and order printed hardcovers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-bg font-sans text-text antialiased selection:bg-accent-soft selection:text-text">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
