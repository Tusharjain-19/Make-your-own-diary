"use client";

import * as React from "react";
import { Image as KonvaImage } from "react-konva";
import Konva from "konva";
import { IconEl } from "@/lib/editor/types";
import { mmToPx, pxToMm } from "@/lib/editor/units";
import { EDITOR_ICONS } from "@/lib/editor/icons";

interface IconNodeProps {
  element: IconEl;
  activeTool: "select" | "pan";
  onSelect: (multi: boolean) => void;
  onDragMove: (xPx: number, yPx: number, wPx: number, hPx: number) => void;
  onDragEnd: (xMm: number, yMm: number) => void;
  onTransformEnd: (xMm: number, yMm: number, wMm: number, hMm: number, rot: number) => void;
}

export const IconNode = React.forwardRef<Konva.Image, IconNodeProps>(
  (
    {
      element,
      activeTool,
      onSelect,
      onDragMove,
      onDragEnd,
      onTransformEnd,
    },
    ref
  ) => {
    const [imageObj, setImageObj] = React.useState<HTMLImageElement | null>(null);
    const nodeRef = React.useRef<Konva.Image | null>(null);

    const xPx = mmToPx(element.x);
    const yPx = mmToPx(element.y);
    const wPx = mmToPx(element.w);
    const hPx = mmToPx(element.h);

    const setRef = (node: Konva.Image | null) => {
      nodeRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ref as any).current = node;
      }
    };

    // Render SVG into data URL when iconId or color changes
    React.useEffect(() => {
      const iconDef = EDITOR_ICONS.find((i) => i.id === element.iconId) || EDITOR_ICONS[0];
      if (!iconDef) return;

      // We render SVG string with currentColor replaced by element.color
      const color = element.color || "#1A1A1A";
      let svgMarkup = "";

      if (iconDef.id === "plane") {
        svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/></svg>`;
      } else if (iconDef.id === "train") {
        svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></svg>`;
      } else if (iconDef.id === "car") {
        svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`;
      } else if (iconDef.id === "camera") {
        svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`;
      } else if (iconDef.id === "suitcase") {
        svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
      } else if (iconDef.id === "pin") {
        svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
      } else if (iconDef.id === "mountain") {
        svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>`;
      } else if (iconDef.id === "compass") {
        svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`;
      } else if (iconDef.id === "ticket") {
        svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>`;
      } else if (iconDef.id === "calendar") {
        svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/></svg>`;
      } else if (iconDef.id === "leaf") {
        svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`;
      } else if (iconDef.id === "flower") {
        svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5"/><path d="M12 7.5V3"/><path d="M7.5 12H3"/><path d="M16.5 12H21"/><path d="M12 16.5V21"/></svg>`;
      } else if (iconDef.id === "heart") {
        svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
      } else if (iconDef.id === "arch") {
        svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V9a8 8 0 0 1 16 0v12"/><path d="M2 21h20"/><path d="M8 21v-8a4 4 0 0 1 8 0v8"/></svg>`;
      } else if (iconDef.id === "quote") {
        svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M10 11H6a3 3 0 0 1 3-3V6a5 5 0 0 0-5 5v7h6v-7zm10 0h-4a3 3 0 0 1 3-3V6a5 5 0 0 0-5 5v7h6v-7z"/></svg>`;
      } else if (iconDef.id === "pen") {
        svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>`;
      } else {
        svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`;
      }

      const img = new Image();
      img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgMarkup)}`;
      img.onload = () => {
        setImageObj(img);
      };
    }, [element.iconId, element.color]);

    return (
      <KonvaImage
        ref={setRef}
        id={element.id}
        x={xPx}
        y={yPx}
        width={wPx}
        height={hPx}
        image={imageObj || undefined}
        rotation={element.rot || 0}
        opacity={element.opacity ?? 1}
        draggable={!element.locked && activeTool === "select"}
        onMouseDown={(e) => {
          e.cancelBubble = true;
          onSelect(e.evt.shiftKey);
        }}
        onClick={(e) => {
          e.cancelBubble = true;
          onSelect(e.evt.shiftKey);
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onSelect(false);
        }}
        onDragMove={(e) => {
          onDragMove(e.target.x(), e.target.y(), wPx, hPx);
        }}
        onDragEnd={(e) => {
          const finalX = pxToMm(e.target.x());
          const finalY = pxToMm(e.target.y());
          onDragEnd(finalX, finalY);
        }}
        onTransformEnd={() => {
          const node = nodeRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);

          const newWidthPx = Math.max(10, node.width() * scaleX);
          const newHeightPx = Math.max(10, node.height() * scaleY);

          onTransformEnd(
            pxToMm(node.x()),
            pxToMm(node.y()),
            pxToMm(newWidthPx),
            pxToMm(newHeightPx),
            Math.round(node.rotation())
          );
        }}
      />
    );
  }
);

IconNode.displayName = "IconNode";
