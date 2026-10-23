"use client";

import * as React from "react";
import { UploadCloud, Image as ImageIcon, Trash2, Plus, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/editor/store";
import { ImageEl } from "@/lib/editor/types";
import { useToast } from "@/components/ui/toast";
import {
  saveAssetToIndexedDB,
  loadAssetsFromIndexedDB,
  deleteAssetFromIndexedDB,
  UploadedAsset,
} from "@/lib/storage/indexeddb";
import { processUploadedImage } from "@/lib/editor/images";

const SAMPLE_EDITORIAL_PHOTOS = [
  {
    id: "sample-jaipur",
    title: "Jaipur Palace Courtyard",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80",
    width: 1600,
    height: 1067,
  },
  {
    id: "sample-goa",
    title: "Goa Beach Palms",
    url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&auto=format&fit=crop&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&auto=format&fit=crop&q=80",
    width: 1600,
    height: 1067,
  },
  {
    id: "sample-himalayas",
    title: "Himalayan Ridge",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&auto=format&fit=crop&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&auto=format&fit=crop&q=80",
    width: 1600,
    height: 1067,
  },
  {
    id: "sample-desert",
    title: "Desert Dunes & Camel",
    url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1600&auto=format&fit=crop&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&auto=format&fit=crop&q=80",
    width: 1600,
    height: 1067,
  },
];

export function UploadsPanel() {
  const { addElement, book, activePageIndex, selectedIds, updateElement } = useEditorStore();
  const { showToast } = useToast();

  const activePage = book?.pages[activePageIndex];
  const selectedElements = activePage?.elements.filter((e) => selectedIds.includes(e.id)) || [];
  const selectedImage =
    selectedElements.length === 1 && selectedElements[0].type === "image"
      ? (selectedElements[0] as ImageEl)
      : null;

  const [userAssets, setUserAssets] = React.useState<UploadedAsset[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Load saved assets from IndexedDB on mount
  React.useEffect(() => {
    loadAssetsFromIndexedDB().then((assets) => {
      setUserAssets(assets);
    });
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setErrorMessage(null);

    const newAssets: UploadedAsset[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const asset = await processUploadedImage(file);
        await saveAssetToIndexedDB(asset);
        newAssets.push(asset);
      } catch (err) {
        console.error("Upload error:", err);
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Some photos could not be processed. Please upload JPG or PNG files."
        );
      }
    }

    if (newAssets.length > 0) {
      setUserAssets((prev) => [...newAssets, ...prev]);
      // If single file uploaded, automatically place or replace onto active page
      if (newAssets.length === 1) {
        handleInsertPhoto(newAssets[0].dataUrl, newAssets[0].width, newAssets[0].height, newAssets[0].id);
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleInsertPhoto = (
    url: string,
    width: number,
    height: number,
    assetId?: string,
    forceNew: boolean = false
  ) => {
    // If an image is selected on canvas and not forced new, replace it
    if (selectedImage && !forceNew) {
      updateElement(selectedImage.id, {
        src: url,
        originalWidth: width,
        originalHeight: height,
        assetId,
      });
      showToast("success", "Photo replaced on canvas!");
      return;
    }

    // Determine reasonable aspect-ratio dimensions in mm (default max width 110mm)
    const aspect = width && height ? width / height : 1.5;
    const wMm = 110;
    const hMm = Math.round(wMm / aspect);

    const newImage: ImageEl = {
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: "image",
      src: url,
      assetId,
      originalWidth: width,
      originalHeight: height,
      x: 18,
      y: 25,
      w: wMm,
      h: hMm,
      rot: 0,
      z: 1,
      frame: "none",
      radius: 4,
      opacity: 1,
    };

    addElement(newImage);
    showToast("success", "Photo added to page!");
  };

  const handleDeleteAsset = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteAssetFromIndexedDB(id);
    setUserAssets((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-serif text-base font-medium text-text">Photo Uploads</h3>
        <p className="text-xs text-text-muted mt-0.5">
          {selectedImage
            ? "Click any photo to replace the selected image on your canvas."
            : "Drop photos to upload. Click or drag any photo to insert onto page."}
        </p>
      </div>

      {/* Active Replacement Mode Indicator */}
      {selectedImage && (
        <div className="rounded-xl border border-accent/40 bg-accent-soft/50 p-3 text-xs space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold text-accent text-xs">
              <RefreshCw className="h-3.5 w-3.5" /> Replace Active Photo
            </span>
            <span className="text-[10px] font-mono bg-accent text-white px-2 py-0.5 rounded-full font-medium">
              Replace Target
            </span>
          </div>
          <p className="text-[11px] text-text-muted leading-relaxed">
            Click any photo below or upload a new one to immediately replace the selected image.
          </p>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center p-5 rounded-[8px] border-2 border-dashed transition-all cursor-pointer text-center ${
          isDragOver
            ? "border-accent bg-accent-soft/40 shadow-sm"
            : "border-border hover:border-accent/60 bg-surface-container-low"
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-1.5 py-2">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
            <span className="text-xs font-mono text-text">Processing photo...</span>
          </div>
        ) : (
          <>
            <UploadCloud className="h-7 w-7 text-text-muted mb-1.5" />
            <div className="text-xs font-medium text-text">
              Drop images or <span className="text-accent underline">browse</span>
            </div>
            <div className="text-[10px] text-text-muted mt-0.5">
              JPG, PNG, WebP (DPI verified for print)
            </div>
          </>
        )}
      </div>

      {/* Error alert if any */}
      {errorMessage && (
        <div className="flex items-start gap-1.5 rounded-[6px] border border-red-200 bg-red-50 p-2 text-[11px] text-red-700">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* User Uploads Section */}
      {userAssets.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-text-muted uppercase tracking-wider">
            <span>Your Photos ({userAssets.length})</span>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
            {userAssets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => handleInsertPhoto(asset.dataUrl, asset.width, asset.height, asset.id)}
                className="group relative aspect-[4/3] rounded-[6px] overflow-hidden border border-border bg-surface hover:shadow-card transition-all cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.thumbnailUrl || asset.dataUrl}
                  alt={asset.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5 text-white">
                  <div className="flex justify-between items-center">
                    {selectedImage ? (
                      <span className="text-[9px] font-mono bg-accent text-white px-1.5 py-0.5 rounded font-semibold">
                        Swap Photo
                      </span>
                    ) : (
                      <span />
                    )}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteAsset(e, asset.id)}
                      className="p-1 rounded bg-black/60 hover:bg-red-600 text-white"
                      title="Delete asset"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="text-[9px] font-mono truncate text-center bg-black/50 py-0.5 rounded">
                    {selectedImage ? "Click to Replace" : `${asset.width} × ${asset.height}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editorial Sample Photos */}
      <div className="space-y-2 pt-2 border-t border-border">
        <div className="text-[11px] font-mono text-text-muted uppercase tracking-wider">
          Editorial Travel Stock
        </div>

        <div className="grid grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
          {SAMPLE_EDITORIAL_PHOTOS.map((photo) => (
            <button
              key={photo.id}
              onClick={() => handleInsertPhoto(photo.url, photo.width, photo.height, photo.id)}
              className="group relative aspect-[4/3] rounded-[6px] overflow-hidden border border-border bg-accent-soft/30 hover:shadow-card transition-all text-left"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.thumbUrl}
                alt={photo.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5 text-white text-[10px]">
                <div className="flex justify-between items-center w-full">
                  <span className="truncate font-serif font-medium">{photo.title}</span>
                  {selectedImage && (
                    <span className="text-[8px] font-mono bg-accent text-white px-1 py-0.2 rounded shrink-0">
                      Swap
                    </span>
                  )}
                </div>
                <span className="font-mono text-[9px] text-accent-soft">
                  {selectedImage ? "Click to Replace on Page" : `${photo.width} × ${photo.height}`}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
