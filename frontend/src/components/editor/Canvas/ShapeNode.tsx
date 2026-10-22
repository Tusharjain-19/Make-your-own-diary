"use client";

import * as React from "react";
import { Rect, Circle, Line, Arrow, Group, Path } from "react-konva";
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

        {/* CUTE WAVY DOODLE LINE */}
        {element.shape === "cute-wavy" && (
          <Line
            points={[
              0,
              hPx / 2,
              wPx * 0.125,
              hPx * 0.15,
              wPx * 0.25,
              hPx / 2,
              wPx * 0.375,
              hPx * 0.85,
              wPx * 0.5,
              hPx / 2,
              wPx * 0.625,
              hPx * 0.15,
              wPx * 0.75,
              hPx / 2,
              wPx * 0.875,
              hPx * 0.85,
              wPx,
              hPx / 2,
            ]}
            tension={0.4}
            stroke={element.stroke || element.fill || "#C29B38"}
            strokeWidth={Math.max(1.5, strokeWidthPx)}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* CUTE STATIONERY HEART */}
        {element.shape === "cute-heart" && (
          <Group>
            <Path
              data="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              scaleX={wPx / 24}
              scaleY={hPx / 24}
              fill={element.fill || "#F5D0D5"}
              stroke={element.stroke || "#C96D7C"}
              strokeWidth={Math.max(0.5, strokeWidthPx * (24 / Math.max(wPx, hPx, 1)))}
            />
          </Group>
        )}

        {/* CUTE STORYBOUND BOOK LOGO EMBLEM */}
        {element.shape === "cute-book" && (
          <Group>
            <Path
              data="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm-1 14c-1.2-.45-2.55-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5V7c1.45-1.1 3.55-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v13z"
              scaleX={wPx / 24}
              scaleY={hPx / 24}
              fill={element.fill || "#C29B38"}
              stroke={element.stroke}
              strokeWidth={element.stroke ? strokeWidthPx : 0}
            />
          </Group>
        )}

        {/* CUTE VINTAGE WAX SEAL / EMBOSSED BADGE */}
        {element.shape === "cute-seal" && (
          <Group>
            <Circle
              x={wPx / 2}
              y={hPx / 2}
              radius={Math.min(wPx, hPx) / 2}
              fill={element.fill || "#8B2635"}
              stroke={element.stroke || "#631722"}
              strokeWidth={Math.max(1.5, strokeWidthPx)}
              shadowColor="rgba(0,0,0,0.18)"
              shadowBlur={6}
              shadowOffset={{ x: 0, y: 2 }}
            />
            {/* Inner dashed ring */}
            <Circle
              x={wPx / 2}
              y={hPx / 2}
              radius={Math.min(wPx, hPx) * 0.4}
              stroke="#E8A87C"
              strokeWidth={1}
              dash={[3, 3]}
            />
            {/* Center crown / fleur motif */}
            <Path
              data="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              x={wPx / 2 - (wPx * 0.3) / 2}
              y={hPx / 2 - (hPx * 0.3) / 2}
              scaleX={(wPx * 0.3) / 24}
              scaleY={(hPx * 0.3) / 24}
              fill="#E8A87C"
            />
          </Group>
        )}

        {/* CUTE DOTTED TRAIL WITH HEART */}
        {element.shape === "cute-dots" && (
          <Group>
            <Line
              points={[0, hPx / 2, wPx * 0.42, hPx / 2]}
              stroke={element.stroke || "#C96D7C"}
              strokeWidth={1.5}
              dash={[3, 4]}
              lineCap="round"
            />
            <Path
              data="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              x={wPx * 0.45}
              y={hPx / 2 - (Math.min(wPx, hPx) * 0.4) / 2}
              scaleX={(Math.min(wPx, hPx) * 0.4) / 24}
              scaleY={(Math.min(wPx, hPx) * 0.4) / 24}
              fill={element.fill || "#C96D7C"}
            />
            <Line
              points={[wPx * 0.58, hPx / 2, wPx, hPx / 2]}
              stroke={element.stroke || "#C96D7C"}
              strokeWidth={1.5}
              dash={[3, 4]}
              lineCap="round"
            />
          </Group>
        )}
      </Group>
    );
  }
);

ShapeNode.displayName = "ShapeNode";
