import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Theme Gallery",
  description:
    "Explore 10 curated editorial themes for your Storybound book — each with tailored color palettes, paired fonts, and cover templates.",
};

export default function ThemesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
