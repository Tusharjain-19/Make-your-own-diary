import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Book",
  description:
    "Create a new book with the Storybound wizard. Choose book type, page format, editorial theme, and enter your title details.",
};

export default function NewBookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
