"use client";

import * as React from "react";
import { Text } from "react-konva";
import Konva from "konva";
import { TextEl } from "@/lib/editor/types";
import { mmToPx, pxToMm } from "@/lib/editor/units";

interface TextNodeProps {
  element: TextEl;
  activeTool: "select" | "pan";
  isEditing?: boolean;
  onSelect: (multi: boolean) => void;
  onDoubleClick?: () => void;
  onDragMove: (xPx: number, yPx: number, wPx: number, hPx: number) => void;
  onDragEnd: (xMm: number, yMm: number) => void;
  onTransformEnd: (xMm: number, yMm: number, wMm: number, hMm: number, rot: number) => void;
}

export const TextNode = React.forwardRef<Konva.Text, TextNodeProps>(
  (
    {
      element,
      activeTool,
      isEditing = false,
      onSelect,
      onDoubleClick,
      onDragMove,
      onDragEnd,
      onTransformEnd,
    },
    ref
  ) => {
    const textRef = React.useRef<Konva.Text | null>(null);

    const xPx = mmToPx(element.x);
    const yPx = mmToPx(element.y);
    const wPx = mmToPx(element.w);
    const hPx = mmToPx(element.h);

    // Font size in pt converted to mm (1 pt = 0.352778 mm) then to px
    const fontSizePx = mmToPx(element.size * 0.352778);

    const fontStyle = element.italic
      ? element.weight >= 600
        ? "italic bold"
        : "italic"
      : element.weight >= 600
      ? "bold"
      : "normal";

    const setRef = (node: Konva.Text | null) => {
      textRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ref as any).current = node;
      }
    };

    return (
      <Text
        ref={setRef}
        id={element.id}
        x={xPx}
        y={yPx}
        width={wPx}
        height={hPx}
        text={element.text}
        fontSize={fontSizePx}
        fontFamily={element.font || "Playfair Display"}
        fontStyle={fontStyle}
        textDecoration={element.underline ? "underline" : ""}
        fill={element.color || "#1A1A1A"}
        align={element.align}
        lineHeight={element.lineHeight || 1.3}
        letterSpacing={element.letterSpacing || 0}
        rotation={element.rot || 0}
        opacity={isEditing ? 0 : element.opacity ?? 1}
        draggable={!element.locked && activeTool === "select" && !isEditing}
        onMouseDown={(e) => {
          e.cancelBubble = true;
          onSelect(e.evt.shiftKey);
        }}
        onClick={(e) => {
          e.cancelBubble = true;
          onSelect(e.evt.shiftKey);
        }}
        onDblClick={(e) => {
          e.cancelBubble = true;
          onDoubleClick?.();
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onSelect(false);
        }}
        onDblTap={(e) => {
          e.cancelBubble = true;
          onDoubleClick?.();
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
          const node = textRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);

          const newWidthPx = Math.max(20, node.width() * scaleX);
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

TextNode.displayName = "TextNode";
