"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BooksIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg text-sm text-text-muted">
      Redirecting to your books dashboard...
    </div>
  );
}
