"use client";

import * as React from "react";
import { Image as KonvaImage, Group, Rect } from "react-konva";
import Konva from "konva";
import { ImageEl } from "@/lib/editor/types";
import { mmToPx, pxToMm } from "@/lib/editor/units";

interface ImageNodeProps {
  element: ImageEl;
  activeTool: "select" | "pan";
  onSelect: (multi: boolean) => void;
  onDragMove: (xPx: number, yPx: number, wPx: number, hPx: number) => void;
  onDragEnd: (xMm: number, yMm: number) => void;
  onTransformEnd: (xMm: number, yMm: number, wMm: number, hMm: number, rot: number) => void;
}

export const ImageNode = React.forwardRef<Konva.Group, ImageNodeProps>(
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
    const groupRef = React.useRef<Konva.Group | null>(null);
    const [imageObj, setImageObj] = React.useState<HTMLImageElement | null>(null);

    const xPx = mmToPx(element.x);
    const yPx = mmToPx(element.y);
    const wPx = mmToPx(element.w);
    const hPx = mmToPx(element.h);

    React.useEffect(() => {
      if (!element.src) return;
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = element.src;
      img.onload = () => {
        setImageObj(img);
      };
    }, [element.src]);

    const setRef = (node: Konva.Group | null) => {
      groupRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ref as any).current = node;
      }
    };

    const isPolaroid = element.frame === "polaroid";
    const polaroidPadding = isPolaroid ? 8 : 0;
    const polaroidBottom = isPolaroid ? 24 : 0;

    const imgWidth = Math.max(10, wPx - polaroidPadding * 2);
    const imgHeight = Math.max(10, hPx - polaroidPadding - polaroidBottom);

    return (
      <Group
        ref={setRef}
        id={element.id}
        x={xPx}
        y={yPx}
        width={wPx}
        height={hPx}
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
          const node = groupRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);

          const newWidthPx = Math.max(20, node.width() * scaleX);
          const newHeightPx = Math.max(20, node.height() * scaleY);

          onTransformEnd(
            pxToMm(node.x()),
            pxToMm(node.y()),
            pxToMm(newWidthPx),
            pxToMm(newHeightPx),
            Math.round(node.rotation())
          );
        }}
      >
        {/* Optional Polaroid Frame Background */}
        {isPolaroid && (
          <Rect
            x={0}
            y={0}
            width={wPx}
            height={hPx}
            fill="#FFFFFF"
            shadowColor="rgba(0,0,0,0.12)"
            shadowBlur={6}
            shadowOffset={{ x: 0, y: 2 }}
            cornerRadius={2}
          />
        )}

        {/* Image Content */}
        {imageObj ? (
          <KonvaImage
            image={imageObj}
            x={polaroidPadding}
            y={polaroidPadding}
            width={imgWidth}
            height={imgHeight}
            cornerRadius={element.radius || 0}
            stroke={element.border?.color}
            strokeWidth={element.border ? mmToPx(element.border.w) : 0}
          />
        ) : (
          <Rect
            x={polaroidPadding}
            y={polaroidPadding}
            width={imgWidth}
            height={imgHeight}
            fill="#EFECE6"
            cornerRadius={element.radius || 0}
          />
        )}
      </Group>
    );
  }
);

ImageNode.displayName = "ImageNode";
