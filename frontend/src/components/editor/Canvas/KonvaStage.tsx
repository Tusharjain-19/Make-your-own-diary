"use client";

import * as React from "react";
import { Stage, Layer, Rect, Line, Transformer, Image as KonvaImage } from "react-konva";
import Konva from "konva";
import { useEditorStore } from "@/lib/editor/store";
import { mmToPx, pxToMm, getPageDimensionsMm, resolveCanvasColor } from "@/lib/editor/units";
import { calculateSnap } from "@/lib/editor/snap";
import { TextEl } from "@/lib/editor/types";
import { TextNode } from "./TextNode";
import { ImageNode } from "./ImageNode";
import { ShapeNode } from "./ShapeNode";
import { IconNode } from "./IconNode";

export default function KonvaStage() {
  const {
    book,
    activePageIndex,
    selectedIds,
    zoom,
    pan,
    activeTool,
    guides,
    selectElement,
    deselectAll,
    selectMarquee,
    updateElement,
    setGuides,
    setPan,
    saveToStorage,
  } = useEditorStore();

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const stageRef = React.useRef<Konva.Stage | null>(null);
  const transformerRef = React.useRef<Konva.Transformer | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodeRefs = React.useRef<Map<string, any>>(new Map());

  // Inline text editing state
  const [editingTextId, setEditingTextId] = React.useState<string | null>(null);
  const editingInputRef = React.useRef<HTMLTextAreaElement | null>(null);

  // Dynamic container dimensions
  const [stageSize, setStageSize] = React.useState({ width: 900, height: 700 });

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      if (container.clientWidth > 0 && container.clientHeight > 0) {
        setStageSize({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Focus textarea when editing starts
  React.useEffect(() => {
    if (editingTextId && editingInputRef.current) {
      editingInputRef.current.focus();
      const len = editingInputRef.current.value.length;
      editingInputRef.current.setSelectionRange(len, len);
    }
  }, [editingTextId]);

  // Marquee selection state
  const [marquee, setMarquee] = React.useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    active: boolean;
  }>({ x1: 0, y1: 0, x2: 0, y2: 0, active: false });

  // Space-key panning state
  const [isSpacePressed, setIsSpacePressed] = React.useState(false);
  const [isPanning, setIsPanning] = React.useState(false);
  const lastPanPos = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const activePage = book?.pages[activePageIndex] || {
    id: "default-page",
    position: 1,
    bg: "#FAFAF8",
    elements: [],
  };

  // Optional Page Background Image
  const [bgImageObj, setBgImageObj] = React.useState<HTMLImageElement | null>(null);
  React.useEffect(() => {
    if (!activePage.bgImage) {
      setBgImageObj(null);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = activePage.bgImage;
    img.onload = () => setBgImageObj(img);
  }, [activePage.bgImage]);

  const dim = getPageDimensionsMm(book?.size || "A5");
  const pageWidthPx = mmToPx(dim.widthMm);
  const pageHeightPx = mmToPx(dim.heightMm);
  const marginPx = mmToPx(dim.safeMarginMm);

  // Auto-center layer in available canvas stage
  const originX = Math.round((stageSize.width - pageWidthPx * zoom) / 2);
  const originY = Math.round(Math.max(30, (stageSize.height - pageHeightPx * zoom) / 2));
  const layerX = originX + pan.x;
  const layerY = originY + pan.y;

  // Sync Transformer with selected nodes
  React.useEffect(() => {
    const tr = transformerRef.current;
    if (!tr) return;

    const selectedNodes: Konva.Node[] = [];
    selectedIds.forEach((id) => {
      const node = nodeRefs.current.get(id);
      if (node) selectedNodes.push(node);
    });

    tr.nodes(selectedNodes);
    tr.getLayer()?.batchDraw();
  }, [selectedIds, activePage.elements]);

  // Space-pan keyboard listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === "Space" &&
        !e.repeat &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const sortedElements = React.useMemo(() => {
    return [...activePage.elements].sort((a, b) => (a.z || 0) - (b.z || 0));
  }, [activePage.elements]);

  const editingEl = editingTextId
    ? (activePage.elements.find((e) => e.id === editingTextId) as TextEl | undefined)
    : undefined;

  const overlayStyle: React.CSSProperties = React.useMemo(() => {
    if (!editingEl) return { display: "none" };
    const elXPx = mmToPx(editingEl.x);
    const elYPx = mmToPx(editingEl.y);
    const elWPx = mmToPx(editingEl.w);
    const elHPx = mmToPx(editingEl.h);

    const left = layerX + elXPx * zoom;
    const top = layerY + elYPx * zoom;
    const width = Math.max(80, elWPx * zoom);
    const height = Math.max(36, elHPx * zoom);

    const fontSizePx = mmToPx(editingEl.size * 0.352778) * zoom;

    return {
      position: "absolute",
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      minHeight: `${height}px`,
      transform: `rotate(${editingEl.rot || 0}deg)`,
      transformOrigin: "top left",
      fontFamily: editingEl.font || "Playfair Display",
      fontSize: `${fontSizePx}px`,
      fontWeight: editingEl.weight,
      fontStyle: editingEl.italic ? "italic" : "normal",
      textDecoration: editingEl.underline ? "underline" : "none",
      color: editingEl.color || "#1A1A1A",
      textAlign: editingEl.align,
      lineHeight: editingEl.lineHeight || 1.3,
      letterSpacing: `${(editingEl.letterSpacing || 0) * zoom}px`,
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(2px)",
      boxShadow: "0 0 0 1.5px #FF2D95, 0 4px 14px rgba(0,0,0,0.12)",
      borderRadius: "4px",
      padding: "2px 4px",
      border: "none",
      outline: "none",
      resize: "none",
      zIndex: 50,
      overflow: "hidden",
    };
  }, [editingEl, layerX, layerY, zoom]);

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // If Space is pressed or Pan tool is active, handle canvas pan
    if (isSpacePressed || activeTool === "pan" || e.evt.button === 1) {
      setIsPanning(true);
      lastPanPos.current = { x: e.evt.clientX, y: e.evt.clientY };
      return;
    }

    // Clicked on empty canvas background
    if (e.target === e.target.getStage() || e.target.name() === "page-background") {
      deselectAll();

      // Start marquee box
      const stage = stageRef.current;
      if (!stage) return;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      // Adjust pointer for zoom and centered pan
      const relX = (pointer.x - layerX) / zoom;
      const relY = (pointer.y - layerY) / zoom;

      setMarquee({
        x1: relX,
        y1: relY,
        x2: relX,
        y2: relY,
        active: true,
      });
    }
  };

  const handleStageMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Panning
    if (isPanning) {
      const dx = e.evt.clientX - lastPanPos.current.x;
      const dy = e.evt.clientY - lastPanPos.current.y;
      lastPanPos.current = { x: e.evt.clientX, y: e.evt.clientY };
      setPan({ x: pan.x + dx, y: pan.y + dy });
      return;
    }

    // Marquee dragging
    if (marquee.active) {
      const stage = stageRef.current;
      if (!stage) return;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const relX = (pointer.x - layerX) / zoom;
      const relY = (pointer.y - layerY) / zoom;

      setMarquee((prev) => ({ ...prev, x2: relX, y2: relY }));
    }
  };

  const handleStageMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
    }

    if (marquee.active) {
      const minX = Math.min(marquee.x1, marquee.x2);
      const maxX = Math.max(marquee.x1, marquee.x2);
      const minY = Math.min(marquee.y1, marquee.y2);
      const maxY = Math.max(marquee.y1, marquee.y2);

      // Only select if dragged more than 5px
      if (maxX - minX > 5 && maxY - minY > 5) {
        const selected: string[] = [];
        activePage.elements.forEach((el) => {
          const elX = mmToPx(el.x);
          const elY = mmToPx(el.y);
          const elW = mmToPx(el.w);
          const elH = mmToPx(el.h);

          // Check AABB intersection
          if (elX < maxX && elX + elW > minX && elY < maxY && elY + elH > minY) {
            selected.push(el.id);
          }
        });
        selectMarquee(selected);
      }

      setMarquee({ x1: 0, y1: 0, x2: 0, y2: 0, active: false });
    }
  };

  const handleElementDragMove = (
    elId: string,
    xPx: number,
    yPx: number,
    wPx: number,
    hPx: number
  ) => {
    const currentEl = activePage.elements.find((e) => e.id === elId);
    if (!currentEl) return;

    const xMm = pxToMm(xPx);
    const yMm = pxToMm(yPx);
    const wMm = pxToMm(wPx);
    const hMm = pxToMm(hPx);

    const otherElements = activePage.elements.filter((e) => e.id !== elId);
    const snap = calculateSnap(
      xMm,
      yMm,
      wMm,
      hMm,
      otherElements,
      dim.widthMm,
      dim.heightMm,
      dim.safeMarginMm
    );

    setGuides(snap.guides);

    // Apply snap position to Konva node directly during drag
    const node = nodeRefs.current.get(elId);
    if (node) {
      node.x(mmToPx(snap.x));
      node.y(mmToPx(snap.y));
    }
  };

  const handleElementDragEnd = (elId: string, xMm: number, yMm: number) => {
    setGuides({ vertical: [], horizontal: [] });
    updateElement(elId, { x: xMm, y: yMm });
  };

  const handleElementTransformEnd = (
    elId: string,
    xMm: number,
    yMm: number,
    wMm: number,
    hMm: number,
    rot: number
  ) => {
    updateElement(elId, { x: xMm, y: yMm, w: wMm, h: hMm, rot });
  };

  const pageBgResolved = resolveCanvasColor(activePage.bg, "#FAFAF8");

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden select-none ${
        isSpacePressed || activeTool === "pan"
          ? "cursor-grab active:cursor-grabbing"
          : "cursor-default"
      }`}
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
      >
        <Layer
          x={layerX}
          y={layerY}
          scaleX={zoom}
          scaleY={zoom}
        >
          {/* Page Drop Shadow */}
          <Rect
            x={2}
            y={4}
            width={pageWidthPx}
            height={pageHeightPx}
            fill="rgba(0,0,0,0.08)"
            cornerRadius={3}
          />

          {/* Page Main Surface */}
          <Rect
            name="page-background"
            x={0}
            y={0}
            width={pageWidthPx}
            height={pageHeightPx}
            fill={pageBgResolved}
            stroke="#E8E6E1"
            strokeWidth={1}
            cornerRadius={2}
          />

          {/* Optional Page Background Image */}
          {bgImageObj && (
            <KonvaImage
              image={bgImageObj}
              x={0}
              y={0}
              width={pageWidthPx}
              height={pageHeightPx}
              listening={false}
            />
          )}

          {/* Safe Margins Guide (subtle dashed line) */}
          <Rect
            x={marginPx}
            y={marginPx}
            width={pageWidthPx - marginPx * 2}
            height={pageHeightPx - marginPx * 2}
            stroke="#1A1A1A"
            strokeWidth={0.75}
            dash={[4, 4]}
            opacity={0.15}
            listening={false}
          />

          {/* Render Page Elements */}
          {sortedElements.map((el) => {
            if (el.type === "text") {
              return (
                <TextNode
                  key={el.id}
                  ref={(node) => {
                    if (node) nodeRefs.current.set(el.id, node);
                    else nodeRefs.current.delete(el.id);
                  }}
                  element={el}
                  activeTool={activeTool}
                  isEditing={editingTextId === el.id}
                  onSelect={(multi) => selectElement(el.id, multi)}
                  onDoubleClick={() => setEditingTextId(el.id)}
                  onDragMove={(x, y, w, h) => handleElementDragMove(el.id, x, y, w, h)}
                  onDragEnd={(x, y) => handleElementDragEnd(el.id, x, y)}
                  onTransformEnd={(x, y, w, h, rot) =>
                    handleElementTransformEnd(el.id, x, y, w, h, rot)
                  }
                />
              );
            }

            if (el.type === "image") {
              return (
                <ImageNode
                  key={el.id}
                  ref={(node) => {
                    if (node) nodeRefs.current.set(el.id, node);
                    else nodeRefs.current.delete(el.id);
                  }}
                  element={el}
                  activeTool={activeTool}
                  onSelect={(multi) => selectElement(el.id, multi)}
                  onDragMove={(x, y, w, h) => handleElementDragMove(el.id, x, y, w, h)}
                  onDragEnd={(x, y) => handleElementDragEnd(el.id, x, y)}
                  onTransformEnd={(x, y, w, h, rot) =>
                    handleElementTransformEnd(el.id, x, y, w, h, rot)
                  }
                />
              );
            }

            if (el.type === "shape") {
              return (
                <ShapeNode
                  key={el.id}
                  ref={(node) => {
                    if (node) nodeRefs.current.set(el.id, node);
                    else nodeRefs.current.delete(el.id);
                  }}
                  element={el}
                  activeTool={activeTool}
                  onSelect={(multi) => selectElement(el.id, multi)}
                  onDragMove={(x, y, w, h) => handleElementDragMove(el.id, x, y, w, h)}
                  onDragEnd={(x, y) => handleElementDragEnd(el.id, x, y)}
                  onTransformEnd={(x, y, w, h, rot) =>
                    handleElementTransformEnd(el.id, x, y, w, h, rot)
                  }
                />
              );
            }

            if (el.type === "icon") {
              return (
                <IconNode
                  key={el.id}
                  ref={(node) => {
                    if (node) nodeRefs.current.set(el.id, node);
                    else nodeRefs.current.delete(el.id);
                  }}
                  element={el}
                  activeTool={activeTool}
                  onSelect={(multi) => selectElement(el.id, multi)}
                  onDragMove={(x, y, w, h) => handleElementDragMove(el.id, x, y, w, h)}
                  onDragEnd={(x, y) => handleElementDragEnd(el.id, x, y)}
                  onTransformEnd={(x, y, w, h, rot) =>
                    handleElementTransformEnd(el.id, x, y, w, h, rot)
                  }
                />
              );
            }

            return null;
          })}

          {/* PAGE BOUNDARY CUT & TRANSLUCENT OVERFLOW MATTE */}
          {/* Top matte */}
          <Rect
            x={-3000}
            y={-3000}
            width={pageWidthPx + 6000}
            height={3000}
            fill="rgba(244, 244, 242, 0.76)"
            listening={false}
          />
          {/* Bottom matte */}
          <Rect
            x={-3000}
            y={pageHeightPx}
            width={pageWidthPx + 6000}
            height={3000}
            fill="rgba(244, 244, 242, 0.76)"
            listening={false}
          />
          {/* Left matte */}
          <Rect
            x={-3000}
            y={0}
            width={3000}
            height={pageHeightPx}
            fill="rgba(244, 244, 242, 0.76)"
            listening={false}
          />
          {/* Right matte */}
          <Rect
            x={pageWidthPx}
            y={0}
            width={3000}
            height={pageHeightPx}
            fill="rgba(244, 244, 242, 0.76)"
            listening={false}
          />

          {/* Page Trim Cut Boundary (Dashed Magenta/Coral) */}
          <Rect
            x={0}
            y={0}
            width={pageWidthPx}
            height={pageHeightPx}
            stroke="#FF2D95"
            strokeWidth={1 / zoom}
            dash={[6 / zoom, 4 / zoom]}
            opacity={0.8}
            listening={false}
          />

          {/* Corner Crop Marks */}
          <Line points={[-12, 0, 0, 0]} stroke="#FF2D95" strokeWidth={1.2 / zoom} listening={false} />
          <Line points={[0, -12, 0, 0]} stroke="#FF2D95" strokeWidth={1.2 / zoom} listening={false} />
          <Line points={[pageWidthPx, 0, pageWidthPx + 12, 0]} stroke="#FF2D95" strokeWidth={1.2 / zoom} listening={false} />
          <Line points={[pageWidthPx, -12, pageWidthPx, 0]} stroke="#FF2D95" strokeWidth={1.2 / zoom} listening={false} />
          <Line points={[-12, pageHeightPx, 0, pageHeightPx]} stroke="#FF2D95" strokeWidth={1.2 / zoom} listening={false} />
          <Line points={[0, pageHeightPx, 0, pageHeightPx + 12]} stroke="#FF2D95" strokeWidth={1.2 / zoom} listening={false} />
          <Line points={[pageWidthPx, pageHeightPx, pageWidthPx + 12, pageHeightPx]} stroke="#FF2D95" strokeWidth={1.2 / zoom} listening={false} />
          <Line points={[pageWidthPx, pageHeightPx, pageWidthPx, pageHeightPx + 12]} stroke="#FF2D95" strokeWidth={1.2 / zoom} listening={false} />

          {/* Konva Transformer Selection Box */}
          <Transformer
            ref={transformerRef}
            rotateAnchorOffset={24}
            borderStroke="#1A1A1A"
            borderStrokeWidth={1.5}
            anchorStroke="#1A1A1A"
            anchorFill="#FFFFFF"
            anchorSize={8}
            anchorCornerRadius={1}
            enabledAnchors={[
              "top-left",
              "top-center",
              "top-right",
              "middle-right",
              "middle-left",
              "bottom-left",
              "bottom-center",
              "bottom-right",
            ]}
            boundBoxFunc={(oldBox, newBox) => {
              if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) {
                return oldBox;
              }
              return newBox;
            }}
          />

          {/* Active Magenta Snapping Guides (#FF2D95) */}
          {guides.vertical.map((gx, idx) => (
            <Line
              key={`vg-${idx}-${gx}`}
              points={[mmToPx(gx), -200, mmToPx(gx), pageHeightPx + 200]}
              stroke="#FF2D95"
              strokeWidth={1.5 / zoom}
              listening={false}
            />
          ))}
          {guides.horizontal.map((gy, idx) => (
            <Line
              key={`hg-${idx}-${gy}`}
              points={[-200, mmToPx(gy), pageWidthPx + 200, mmToPx(gy)]}
              stroke="#FF2D95"
              strokeWidth={1.5 / zoom}
              listening={false}
            />
          ))}

          {/* Marquee Selection Box */}
          {marquee.active && (
            <Rect
              x={Math.min(marquee.x1, marquee.x2)}
              y={Math.min(marquee.y1, marquee.y2)}
              width={Math.abs(marquee.x2 - marquee.x1)}
              height={Math.abs(marquee.y2 - marquee.y1)}
              fill="rgba(26, 26, 26, 0.05)"
              stroke="#1A1A1A"
              strokeWidth={1 / zoom}
              dash={[4 / zoom, 4 / zoom]}
              listening={false}
            />
          )}
        </Layer>
      </Stage>

      {/* Double-click Inline Text Editing Overlay */}
      {editingEl && (
        <textarea
          ref={editingInputRef}
          style={overlayStyle}
          value={editingEl.text}
          onChange={(e) => {
            updateElement(editingEl.id, { text: e.target.value });
          }}
          onBlur={() => {
            setEditingTextId(null);
            saveToStorage();
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setEditingTextId(null);
              saveToStorage();
            }
          }}
        />
      )}
    </div>
  );
}
