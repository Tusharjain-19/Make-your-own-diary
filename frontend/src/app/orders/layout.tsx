import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Print Orders",
  description:
    "Track your Storybound hardcover print orders, view delivery status, and manage your physical book shipments.",
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
