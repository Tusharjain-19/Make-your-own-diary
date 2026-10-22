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

    const borderWidthPx = element.border?.w ? mmToPx(element.border.w) : 0;

    const displayText = element.uppercase ? element.text.toUpperCase() : element.text;

    const decorations = [
      element.underline ? "underline" : "",
      element.strikethrough ? "line-through" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const isHollow = element.isHollow || element.effect === "hollow";

    // Text Effects (Shadow, Lift, Neon)
    let shadowColor: string | undefined = undefined;
    let shadowBlur = 0;
    let shadowOffset = { x: 0, y: 0 };
    let shadowOpacity = 0;

    if (element.effect === "shadow") {
      shadowColor = element.effectColor || "rgba(0,0,0,0.45)";
      shadowBlur = 6;
      shadowOffset = { x: 3, y: 3 };
      shadowOpacity = element.effectIntensity ?? 0.8;
    } else if (element.effect === "lift") {
      shadowColor = element.effectColor || "rgba(0,0,0,0.3)";
      shadowBlur = 14;
      shadowOffset = { x: 0, y: 5 };
      shadowOpacity = element.effectIntensity ?? 0.6;
    } else if (element.effect === "neon") {
      shadowColor = element.effectColor || element.color || "#00E5FF";
      shadowBlur = 18;
      shadowOffset = { x: 0, y: 0 };
      shadowOpacity = 0.9;
    }

    return (
      <Text
        ref={setRef}
        id={element.id}
        x={xPx}
        y={yPx}
        width={wPx}
        height={hPx}
        text={displayText}
        fontSize={fontSizePx}
        fontFamily={element.font || "Playfair Display"}
        fontStyle={fontStyle}
        wrap="word"
        textDecoration={decorations}
        fill={isHollow ? "transparent" : element.color || "#1A1A1A"}
        align={element.align}
        lineHeight={element.lineHeight || 1.3}
        letterSpacing={element.letterSpacing || 0}
        stroke={isHollow ? element.color || "#1A1A1A" : element.border?.w ? element.border.color : undefined}
        strokeWidth={isHollow ? Math.max(1, borderWidthPx || 1.5) : borderWidthPx}
        dash={element.border?.style === "dashed" ? [4, 4] : undefined}
        padding={borderWidthPx > 0 ? 4 : 0}
        shadowColor={shadowColor}
        shadowBlur={shadowBlur}
        shadowOffset={shadowOffset}
        shadowOpacity={shadowOpacity}
        rotation={element.rot || 0}
        scaleX={element.flipX ? -1 : 1}
        offsetX={element.flipX ? wPx : 0}
        scaleY={element.flipY ? -1 : 1}
        offsetY={element.flipY ? hPx : 0}
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
        onTransform={() => {
          const node = textRef.current;
          if (!node) return;
          // Live word wrapping while dragging resize handles!
          const scaleX = node.scaleX();
          node.setAttrs({
            width: Math.max(20, node.width() * scaleX),
            scaleX: 1,
            scaleY: 1,
          });
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
