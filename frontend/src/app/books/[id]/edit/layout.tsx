import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Editor",
  description:
    "Edit your book in the Storybound Canva-like editor. Drag and drop elements, apply themes, and design your personal book page by page.",
};

export default function EditBookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
