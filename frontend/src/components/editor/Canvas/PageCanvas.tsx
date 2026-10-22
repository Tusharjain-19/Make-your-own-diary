"use client";

import dynamic from "next/dynamic";
import * as React from "react";

// Dynamically import KonvaStage with SSR disabled
const KonvaStage = dynamic(() => import("./KonvaStage"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-accent-soft/20 text-xs font-mono text-text-muted">
      Loading canvas...
    </div>
  ),
});

export default function PageCanvas() {
  return <KonvaStage />;
}
