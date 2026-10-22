"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/editor/store";
import { ImageEl } from "@/lib/editor/types";

const SAMPLE_PHOTOS = [
  {
    title: "Jaipur Palace",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Goa Beach Palms",
    url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Himalayan Ridge",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Desert Caravans",
    url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Old City Alley",
    url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80",
  },
];

export function UploadsPanel() {
  const { addElement } = useEditorStore();
  const [customUrl, setCustomUrl] = React.useState("");

  const handleAddPhoto = (url: string) => {
    const newImage: ImageEl = {
      id: `img-${Date.now()}`,
      type: "image",
      src: url,
      x: 20,
      y: 30,
      w: 108,
      h: 75,
      rot: 0,
      z: 1,
      frame: "none",
      radius: 4,
    };
    addElement(newImage);
  };

  const handleAddCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    handleAddPhoto(customUrl.trim());
    setCustomUrl("");
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-serif text-base font-medium text-text">Photo Uploads</h3>
        <p className="text-xs text-text-muted mt-0.5">
          Click any photo to insert it onto the active page.
        </p>
      </div>

      <form onSubmit={handleAddCustomUrl} className="flex gap-2">
        <input
          type="url"
          placeholder="Paste image URL..."
          className="flex-1 rounded-[6px] border border-border bg-surface px-2.5 py-1.5 text-xs text-text focus:outline-none focus:ring-1 focus:ring-accent"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
        />
        <Button type="submit" size="sm" className="h-8 text-xs shrink-0">
          <Plus className="h-3.5 w-3.5 mr-1" /> Add
        </Button>
      </form>

      <div className="text-xs font-medium uppercase tracking-wider text-text-muted pt-2">
        Sample Travel Photos:
      </div>

      <div className="grid grid-cols-2 gap-2.5 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
        {SAMPLE_PHOTOS.map((photo, idx) => (
          <button
            key={idx}
            onClick={() => handleAddPhoto(photo.url)}
            className="group relative aspect-[4/3] rounded-[8px] overflow-hidden border border-border bg-accent-soft/40 hover:shadow-card transition-all"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={photo.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-medium p-1 text-center">
              Click to Add
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
