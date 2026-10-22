"use client";

import * as React from "react";
import { Rect, Circle, Line, Arrow, Group } from "react-konva";
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

    const strokeWidthPx = element.strokeW ? mmToPx(element.strokeW) : 1;

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
        {/* CIRCLE */}
        {element.shape === "circle" && (
          <Circle
            x={wPx / 2}
            y={hPx / 2}
            radius={Math.min(wPx, hPx) / 2}
            fill={element.fill || "#F0EEE9"}
            stroke={element.stroke || "#1A1A1A"}
            strokeWidth={element.stroke ? strokeWidthPx : 0}
          />
        )}

        {/* RECTANGLE */}
        {element.shape === "rect" && (
          <Rect
            x={0}
            y={0}
            width={wPx}
            height={hPx}
            fill={element.fill || "#F0EEE9"}
            stroke={element.stroke || "#E8E6E1"}
            strokeWidth={element.stroke ? strokeWidthPx : 0}
            cornerRadius={element.cornerRadius || 2}
          />
        )}

        {/* HORIZONTAL LINE */}
        {element.shape === "line" && (
          <Line
            points={[0, hPx / 2, wPx, hPx / 2]}
            stroke={element.stroke || element.fill || "#1A1A1A"}
            strokeWidth={Math.max(1, hPx)}
            lineCap="round"
          />
        )}

        {/* ARROW */}
        {element.shape === "arrow" && (
          <Arrow
            points={[0, hPx / 2, wPx, hPx / 2]}
            stroke={element.stroke || element.fill || "#1A1A1A"}
            fill={element.stroke || element.fill || "#1A1A1A"}
            strokeWidth={Math.max(1.5, strokeWidthPx)}
            pointerLength={10}
            pointerWidth={8}
            lineCap="round"
          />
        )}

        {/* POLAROID FRAME */}
        {element.shape === "frame-polaroid" && (
          <Group>
            {/* Outer white card */}
            <Rect
              x={0}
              y={0}
              width={wPx}
              height={hPx}
              fill="#FFFFFF"
              stroke="#E8E6E1"
              strokeWidth={1}
              cornerRadius={2}
              shadowColor="rgba(0,0,0,0.06)"
              shadowBlur={6}
              shadowOffset={{ x: 0, y: 2 }}
            />
            {/* Inner photo cutout */}
            <Rect
              x={wPx * 0.08}
              y={hPx * 0.08}
              width={wPx * 0.84}
              height={hPx * 0.7}
              fill={element.fill || "#F4F1EA"}
              stroke="#D4D0C8"
              strokeWidth={0.5}
            />
          </Group>
        )}

        {/* ARCHED FRAME */}
        {element.shape === "frame-arch" && (
          <Rect
            x={0}
            y={0}
            width={wPx}
            height={hPx}
            fill={element.fill || "#F8F1E4"}
            stroke={element.stroke || "#7A1F2B"}
            strokeWidth={strokeWidthPx}
            cornerRadius={[wPx / 2, wPx / 2, 0, 0]}
          />
        )}

        {/* THIN RULE DIVIDER */}
        {element.shape === "divider-rule" && (
          <Group>
            <Line
              points={[0, hPx / 2, wPx * 0.45, hPx / 2]}
              stroke={element.stroke || "#B8A88A"}
              strokeWidth={1}
            />
            {/* Center diamond glyph */}
            <Rect
              x={wPx / 2}
              y={hPx / 2}
              width={6}
              height={6}
              offsetX={3}
              offsetY={3}
              rotation={45}
              fill={element.stroke || "#B8A88A"}
            />
            <Line
              points={[wPx * 0.55, hPx / 2, wPx, hPx / 2]}
              stroke={element.stroke || "#B8A88A"}
              strokeWidth={1}
            />
          </Group>
        )}

        {/* DOTTED DIVIDER */}
        {element.shape === "divider-dotted" && (
          <Line
            points={[0, hPx / 2, wPx, hPx / 2]}
            stroke={element.stroke || "#6B6B66"}
            strokeWidth={1.5}
            dash={[4, 6]}
            lineCap="round"
          />
        )}

        {/* WASHI TAPE STRIP */}
        {element.shape === "tape" && (
          <Rect
            x={0}
            y={0}
            width={wPx}
            height={hPx}
            fill={element.fill || "#F0DEBD"}
            stroke="#D6C5A5"
            strokeWidth={0.5}
            opacity={0.88}
          />
        )}

        {/* POSTAGE STAMP */}
        {element.shape === "stamp" && (
          <Group>
            <Rect
              x={0}
              y={0}
              width={wPx}
              height={hPx}
              fill={element.fill || "#FFF9F0"}
              stroke={element.stroke || "#B8A88A"}
              strokeWidth={1.5}
              dash={[3, 3]}
            />
            <Rect
              x={wPx * 0.12}
              y={hPx * 0.12}
              width={wPx * 0.76}
              height={hPx * 0.76}
              stroke={element.stroke || "#B8A88A"}
              strokeWidth={0.5}
            />
          </Group>
        )}
      </Group>
    );
  }
);

ShapeNode.displayName = "ShapeNode";
