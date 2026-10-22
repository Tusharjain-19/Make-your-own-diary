import { UploadedAsset } from "@/lib/storage/indexeddb";

/**
 * Calculates print DPI given the pixel width of the image and its placed width in mm.
 * 1 inch = 25.4 mm
 * DPI = pixelWidth / (widthMm / 25.4)
 */
export function calculateDpi(pixelWidth: number | undefined, widthMm: number): number {
  if (!pixelWidth || pixelWidth <= 0 || !widthMm || widthMm <= 0) {
    return 300; // default assumption if unknown
  }
  const inches = widthMm / 25.4;
  return Math.round(pixelWidth / inches);
}

/**
 * Returns true if DPI is lower than 150 (print minimum recommendation).
 */
export function isLowResolution(pixelWidth: number | undefined, widthMm: number): boolean {
  if (!pixelWidth || pixelWidth <= 0) return false;
  const dpi = calculateDpi(pixelWidth, widthMm);
  return dpi < 150;
}

/**
 * Client-side image processor:
 * - Reads EXIF / natural width and height
 * - Generates compressed thumbnail for sidebar (max 320px)
 * - Returns structured UploadedAsset
 */
export async function processUploadedImage(file: File): Promise<UploadedAsset> {
  return new Promise((resolve, reject) => {
    // Check if HEIC
    const isHeic =
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif") ||
      file.type === "image/heic" ||
      file.type === "image/heif";

    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;

      const img = new Image();
      img.onload = () => {
        const naturalWidth = img.naturalWidth || img.width;
        const naturalHeight = img.naturalHeight || img.height;

        // Create thumbnail via canvas
        const canvas = document.createElement("canvas");
        const maxThumbDim = 320;
        let thumbW = naturalWidth;
        let thumbH = naturalHeight;

        if (thumbW > maxThumbDim || thumbH > maxThumbDim) {
          if (thumbW > thumbH) {
            thumbH = Math.round((thumbH * maxThumbDim) / thumbW);
            thumbW = maxThumbDim;
          } else {
            thumbW = Math.round((thumbW * maxThumbDim) / thumbH);
            thumbH = maxThumbDim;
          }
        }

        canvas.width = thumbW;
        canvas.height = thumbH;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, thumbW, thumbH);
        }

        const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.85);

        const asset: UploadedAsset = {
          id: `asset-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          dataUrl,
          thumbnailUrl,
          width: naturalWidth,
          height: naturalHeight,
          size: file.size,
          mimeType: file.type || "image/jpeg",
          createdAt: new Date().toISOString(),
        };

        resolve(asset);
      };

      img.onerror = () => {
        if (isHeic) {
          // Graceful fallback for HEIC if browser doesn't decode it natively
          reject(
            new Error(
              "HEIC file format detected. Please export as JPG or PNG for high-fidelity canvas rendering."
            )
          );
        } else {
          reject(new Error("Failed to load image for processing."));
        }
      };

      img.src = dataUrl;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
