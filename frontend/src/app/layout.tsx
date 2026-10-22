import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";
import { ToastProvider } from "@/components/ui/toast";

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
  title: {
    default: "Storybound | Personal Books and Travel Diaries",
    template: "%s | Storybound",
  },
  description:
    "Design personal books and travel diaries in a minimal editor, write in your own handwriting font, download PDF for ₹50, and order printed hardcovers.",
  icons: {
    icon: "/icon.svg",
  },
  metadataBase: new URL("https://storybound.app"),
  openGraph: {
    title: "Storybound | Personal Books and Travel Diaries",
    description:
      "Turn phone photos into a keepsake hardcover or print-ready PDF, styled with 10 editorial themes, and typeset in your own personal handwriting font.",
    type: "website",
    siteName: "Storybound",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen overflow-x-hidden bg-bg font-sans text-text antialiased selection:bg-accent-soft selection:text-text">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
