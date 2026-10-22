"use client";

import * as React from "react";
import { Rect, Circle, Group } from "react-konva";
import Konva from "konva";
import { ShapeEl } from "@/lib/editor/types";
import { mmToPx, pxToMm } from "@/lib/editor/units";

interface ShapeNodeProps {
  element: ShapeEl;
  activeTool: "select" | "pan";
  onSelect: (multi: boolean) => void;
  onDragMove: (xPx: number, yPx: number, wPx: number, hPx: number) => void;
  onDragEnd: (xMm: number, yMm: number) => void;
  onTransformEnd: (xMm: number, yMm: number, wMm: number, hMm: number, rot: number) => void;
}

export const ShapeNode = React.forwardRef<Konva.Group, ShapeNodeProps>(
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

    const xPx = mmToPx(element.x);
    const yPx = mmToPx(element.y);
    const wPx = mmToPx(element.w);
    const hPx = mmToPx(element.h);

    const setRef = (node: Konva.Group | null) => {
      groupRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ref as any).current = node;
      }
    };

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
      >
        {element.shape === "circle" ? (
          <Circle
            x={wPx / 2}
            y={hPx / 2}
            radius={Math.min(wPx, hPx) / 2}
            fill={element.fill || "#E8E6E1"}
            stroke={element.stroke}
            strokeWidth={element.strokeW ? mmToPx(element.strokeW) : 0}
          />
        ) : (
          <Rect
            x={0}
            y={0}
            width={wPx}
            height={hPx}
            fill={element.fill || "#E8E6E1"}
            stroke={element.stroke}
            strokeWidth={element.strokeW ? mmToPx(element.strokeW) : 0}
            cornerRadius={4}
          />
        )}
      </Group>
    );
  }
);

ShapeNode.displayName = "ShapeNode";
