"use client";

import * as React from "react";
import { Plus, LayoutTemplate as LayoutIcon } from "lucide-react";
import { useEditorStore } from "@/lib/editor/store";
import { getPageDimensionsMm } from "@/lib/editor/units";
import { LAYOUT_TEMPLATES, LayoutTemplate, reflowContentToLayout } from "@/lib/editor/layouts";
import { themes } from "@/lib/themes";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export function LayoutsPanel() {
  const { book, activePageIndex, saveToStorage } = useEditorStore();
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const { showToast } = useToast();

  const currentTheme = themes.find((t) => t.id === book?.themeId) || themes[0];
  const dim = getPageDimensionsMm(book?.size || "A5");

  const categories = [
    { id: "all", label: "All" },
    { id: "cover", label: "Covers" },
    { id: "photo", label: "Photo" },
    { id: "split", label: "Split" },
    { id: "grid", label: "Grid" },
    { id: "collage", label: "Collage" },
    { id: "text", label: "Text" },
    { id: "diary", label: "Diary" },
    { id: "keepsake", label: "Keepsake" },
  ];

  const filteredLayouts = React.useMemo(() => {
    if (selectedCategory === "all") return LAYOUT_TEMPLATES;
    return LAYOUT_TEMPLATES.filter((l) => l.category === selectedCategory);
  }, [selectedCategory]);

  // Apply layout to CURRENT page (smart reflow preserving photos & text)
  const handleApplyLayout = (template: LayoutTemplate) => {
    if (!book) return;

    useEditorStore.setState((state) => {
      if (!state.book) return;
      const page = state.book.pages[state.activePageIndex];
      if (!page) return;

      page.layoutId = template.id;
      page.elements = reflowContentToLayout(
        page.elements,
        template,
        dim,
        currentTheme.palette
      );
    });

    saveToStorage();
    showToast("success", `Applied ${template.name} (${template.id}) to page`);
  };

  // Add a brand new page from this layout
  const handleAddPageFromLayout = (template: LayoutTemplate) => {
    if (!book) return;

    useEditorStore.setState((state) => {
      if (!state.book) return;

      const newElements = reflowContentToLayout([], template, dim, currentTheme.palette);
      const newPage = {
        id: `page-${Date.now()}`,
        position: state.book.pages.length + 1,
        bg: currentTheme.palette.bg || "#FAFAF8",
        layoutId: template.id,
        elements: newElements,
      };

      state.book.pages.push(newPage);
      state.activePageIndex = state.book.pages.length - 1;
    });

    saveToStorage();
    showToast("success", `Added new page from ${template.name}`);
  };

  // Wireframe Thumbnail Generator
  const renderWireframe = (template: LayoutTemplate) => {
    const slots = template.slots(dim);
    const scale = 50 / dim.heightMm;
    const svgW = dim.widthMm * scale;
    const svgH = dim.heightMm * scale;

    return (
      <svg
        width={svgW}
        height={svgH}
        className="rounded border border-border bg-surface shrink-0 shadow-xs"
      >
        {slots.map((s, idx) => {
          const sx = s.x * scale;
          const sy = s.y * scale;
          const sw = Math.max(2, s.w * scale);
          const sh = Math.max(2, s.h * scale);

          if (s.type === "image") {
            return (
              <rect
                key={idx}
                x={sx}
                y={sy}
                width={sw}
                height={sh}
                fill="#E8E8E6"
                stroke="#C4C7C7"
                strokeWidth={0.5}
                rx={1}
              />
            );
          } else {
            return (
              <rect
                key={idx}
                x={sx}
                y={sy}
                width={sw}
                height={Math.min(sh, 3)}
                fill="#747878"
                rx={0.5}
              />
            );
          }
        })}
      </svg>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-serif text-base font-medium text-text">Page Layouts</h3>
        <p className="text-xs text-text-muted mt-0.5">
          15 editorial templates (L01–L15). Applying reflows existing text and photos automatically.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
              selectedCategory === cat.id
                ? "bg-accent text-white"
                : "bg-accent-soft/60 text-text-muted hover:text-text"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Layout List */}
      <div className="space-y-3 max-h-[calc(100vh-270px)] overflow-y-auto pr-1">
        {filteredLayouts.map((template) => {
          const isCurrentLayout = book?.pages[activePageIndex]?.layoutId === template.id;

          return (
            <div
              key={template.id}
              className={`rounded-[8px] border p-3 transition-all ${
                isCurrentLayout
                  ? "border-accent bg-accent-soft/40 shadow-xs"
                  : "border-border bg-surface hover:border-accent/40 hover:bg-accent-soft/20"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Wireframe Thumbnail */}
                {renderWireframe(template)}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-semibold text-accent rounded bg-accent-soft px-1.5 py-0.5">
                      {template.id}
                    </span>
                    <span className="font-medium text-xs text-text truncate">
                      {template.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-1 leading-snug">
                    {template.desc}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex items-center gap-2 pt-2 border-t border-border/60">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleApplyLayout(template)}
                  className="flex-1 h-7 text-[11px]"
                >
                  Apply to Page
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAddPageFromLayout(template)}
                  className="h-7 text-[11px] text-text-muted hover:text-text gap-1"
                  title="Insert a new page with this layout"
                >
                  <Plus className="h-3 w-3" /> Add Page
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
