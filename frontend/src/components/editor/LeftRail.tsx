"use client";

import * as React from "react";
import {
  Palette,
  Layers,
  UploadCloud,
  Type,
  Square,
  PenTool,
  X,
} from "lucide-react";
import { useEditorStore, PanelType } from "@/lib/editor/store";
import { ThemesPanel } from "./panels/ThemesPanel";
import { LayoutsPanel } from "./panels/LayoutsPanel";
import { UploadsPanel } from "./panels/UploadsPanel";
import { TextPanel } from "./panels/TextPanel";
import { ElementsPanel } from "./panels/ElementsPanel";
import { HandwritingPanel } from "./panels/HandwritingPanel";

const RAIL_ITEMS: { id: NonNullable<PanelType>; label: string; icon: React.ElementType }[] = [
  { id: "themes", label: "Themes", icon: Palette },
  { id: "layouts", label: "Layouts", icon: Layers },
  { id: "uploads", label: "Uploads", icon: UploadCloud },
  { id: "text", label: "Text", icon: Type },
  { id: "elements", label: "Elements", icon: Square },
  { id: "handwriting", label: "Handwriting", icon: PenTool },
];

export function LeftRail() {
  const { activePanel, setActivePanel } = useEditorStore();

  return (
    <div className="relative flex z-30 select-none">
      {/* 72px Icon Rail */}
      <aside className="w-[72px] shrink-0 border-r border-border bg-surface flex flex-col items-center py-3 gap-2">
        {RAIL_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePanel === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePanel(item.id)}
              className={`flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-[8px] transition-all text-[10px] font-medium ${
                isActive
                  ? "bg-accent text-white shadow-sm"
                  : "text-text-muted hover:text-text hover:bg-accent-soft"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </aside>

      {/* 300px Expanding Flyout Panel */}
      {activePanel && (
        <div className="w-[300px] shrink-0 border-r border-border bg-surface h-full flex flex-col shadow-card animate-in slide-in-from-left-2 duration-150">
          <div className="flex h-12 items-center justify-between border-b border-border px-4">
            <span className="font-serif text-sm font-semibold capitalize text-accent">
              {activePanel}
            </span>
            <button
              onClick={() => setActivePanel(null)}
              className="rounded p-1 text-text-muted hover:bg-accent-soft hover:text-text"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activePanel === "themes" && <ThemesPanel />}
            {activePanel === "layouts" && <LayoutsPanel />}
            {activePanel === "uploads" && <UploadsPanel />}
            {activePanel === "text" && <TextPanel />}
            {activePanel === "elements" && <ElementsPanel />}
            {activePanel === "handwriting" && <HandwritingPanel />}
          </div>
        </div>
      )}
    </div>
  );
}
