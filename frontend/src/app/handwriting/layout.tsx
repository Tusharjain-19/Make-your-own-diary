import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Handwriting Studio",
  description:
    "Turn your real-world handwriting into an in-app font for your Storybound books. Private, secure, and embedded into your PDF exports.",
};

export default function HandwritingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
