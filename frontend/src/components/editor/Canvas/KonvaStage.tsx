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
    setZoom,
    saveToStorage,
    showMargins,
    showBleed,
    showRulers,
    copiedStyle,
    applyCopiedStyle,
    deleteSelected,
    duplicateSelected,
    copySelected,
    paste,
    undo,
    redo,
    nudgeSelected,
  } = useEditorStore();

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const stageRef = React.useRef<Konva.Stage | null>(null);
  const transformerRef = React.useRef<Konva.Transformer | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodeRefs = React.useRef<Map<string, any>>(new Map());

  // Live Rotation Degree & Guiding Crosshairs State
  const [rotatingInfo, setRotatingInfo] = React.useState<{
    active: boolean;
    degree: number;
    centerPx: { x: number; y: number } | null;
    badgePos: { x: number; y: number } | null;
  }>({ active: false, degree: 0, centerPx: null, badgePos: null });

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

  // Comprehensive Keyboard Shortcuts & Pan listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If typing in input/textarea (like the inline text editing overlay), ignore shortcuts
      const target = e.target as HTMLElement;
      if (
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) &&
        target !== document.body
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (e.code === "Space" && !e.repeat) {
        setIsSpacePressed(true);
        return;
      }

      // Delete: Delete or Backspace
      if ((e.key === "Delete" || e.key === "Backspace") && selectedIds.length > 0) {
        e.preventDefault();
        deleteSelected();
        saveToStorage();
        return;
      }

      // Duplicate: Ctrl/Cmd + D
      if (cmdOrCtrl && e.key.toLowerCase() === "d" && selectedIds.length > 0) {
        e.preventDefault();
        duplicateSelected();
        saveToStorage();
        return;
      }

      // Copy: Ctrl/Cmd + C
      if (cmdOrCtrl && e.key.toLowerCase() === "c" && selectedIds.length > 0) {
        e.preventDefault();
        copySelected();
        return;
      }

      // Paste: Ctrl/Cmd + V
      if (cmdOrCtrl && e.key.toLowerCase() === "v") {
        e.preventDefault();
        paste();
        saveToStorage();
        return;
      }

      // Undo: Ctrl/Cmd + Z
      if (cmdOrCtrl && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z
      if ((cmdOrCtrl && e.key.toLowerCase() === "y") || (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === "z")) {
        e.preventDefault();
        redo();
        return;
      }

      // Deselect: Escape
      if (e.key === "Escape") {
        e.preventDefault();
        deselectAll();
        return;
      }

      // Arrow Key Nudges: 1mm normal, 10mm with Shift
      if (selectedIds.length > 0) {
        const step = e.shiftKey ? 10 : 1;
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          nudgeSelected(-step, 0);
          return;
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          nudgeSelected(step, 0);
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          nudgeSelected(0, -step);
          return;
        }
        if (e.key === "ArrowDown") {
          e.preventDefault();
          nudgeSelected(0, step);
          return;
        }
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
  }, [
    selectedIds,
    deleteSelected,
    duplicateSelected,
    copySelected,
    paste,
    undo,
    redo,
    deselectAll,
    nudgeSelected,
    saveToStorage,
  ]);

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

  const handleSelectElement = React.useCallback(
    (id: string, multi = false) => {
      // Unfocus any active DOM input so keyboard shortcuts (Delete, Backspace, Ctrl+C/V/D) respond instantly
      if (
        typeof document !== "undefined" &&
        document.activeElement instanceof HTMLElement &&
        document.activeElement.tagName !== "BODY"
      ) {
        document.activeElement.blur();
      }
      if (copiedStyle) {
        applyCopiedStyle(id);
      } else {
        selectElement(id, multi);
      }
    },
    [copiedStyle, applyCopiedStyle, selectElement]
  );

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Unfocus any active DOM input on canvas click
    if (
      typeof document !== "undefined" &&
      document.activeElement instanceof HTMLElement &&
      document.activeElement.tagName !== "BODY"
    ) {
      document.activeElement.blur();
    }

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

  // Canvas Mouse Wheel & Touchpad Scrolling (Vertical, Horizontal with Shift, Zoom with Ctrl)
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    // Ctrl or Meta: Zoom in/out
    if (e.evt.ctrlKey || e.evt.metaKey) {
      const zoomFactor = 1.05;
      const direction = e.evt.deltaY > 0 ? -1 : 1;
      const newZoom = direction > 0 ? zoom * zoomFactor : zoom / zoomFactor;
      const clampedZoom = Math.max(0.2, Math.min(3.0, newZoom));
      setZoom(Math.round(clampedZoom * 100) / 100);
      return;
    }

    // Shift key or horizontal touchpad gesture: Horizontal Scroll
    if (e.evt.shiftKey || Math.abs(e.evt.deltaX) > Math.abs(e.evt.deltaY)) {
      const delta = e.evt.deltaX !== 0 ? e.evt.deltaX : e.evt.deltaY;
      setPan({ x: pan.x - delta, y: pan.y });
    } else {
      // Normal Vertical Wheel Scroll
      setPan({ x: pan.x, y: pan.y - e.evt.deltaY });
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
        onWheel={handleWheel}
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
          {showMargins && (
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
          )}

          {/* Render Page Elements */}
          {sortedElements.map((el) => {
            if (el.type === "text") {
              const textEl = el as TextEl;
              return (
                <React.Fragment key={el.id}>
                  {/* Fading Font Box Background Shape (Canva-style) */}
                  {textEl.bgPill && (
                    <Rect
                      x={mmToPx(el.x)}
                      y={mmToPx(el.y)}
                      width={mmToPx(el.w)}
                      height={mmToPx(el.h)}
                      fill={textEl.bgPill.color || "#FFFFFF"}
                      opacity={textEl.bgPill.opacity ?? 0.8}
                      cornerRadius={textEl.bgPill.radius || 4}
                      rotation={el.rot || 0}
                      listening={false}
                    />
                  )}
                  <TextNode
                    ref={(node) => {
                      if (node) nodeRefs.current.set(el.id, node);
                      else nodeRefs.current.delete(el.id);
                    }}
                    element={el}
                    activeTool={activeTool}
                    isEditing={editingTextId === el.id}
                    onSelect={(multi) => handleSelectElement(el.id, multi)}
                    onDoubleClick={() => setEditingTextId(el.id)}
                    onDragMove={(x, y, w, h) => handleElementDragMove(el.id, x, y, w, h)}
                    onDragEnd={(x, y) => handleElementDragEnd(el.id, x, y)}
                    onTransformEnd={(x, y, w, h, rot) =>
                      handleElementTransformEnd(el.id, x, y, w, h, rot)
                    }
                  />
                </React.Fragment>
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
                  onSelect={(multi) => handleSelectElement(el.id, multi)}
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
                  onSelect={(multi) => handleSelectElement(el.id, multi)}
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
                  onSelect={(multi) => handleSelectElement(el.id, multi)}
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

          {/* PAGE BOUNDARY CUT & TRANSLUCENT OVERFLOW MATTE (Canva Print Bleed) */}
          {showBleed && (
            <>
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
            </>
          )}

          {/* Konva Transformer Selection Box */}
          <Transformer
            ref={transformerRef}
            rotateAnchorOffset={24}
            rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
            rotationSnapTolerance={5}
            borderStroke="#1A1A1A"
            borderStrokeWidth={1.5}
            anchorStroke="#1A1A1A"
            anchorFill="#FFFFFF"
            anchorSize={8}
            anchorCornerRadius={1}
            onTransform={() => {
              const nodes = transformerRef.current?.nodes() || [];
              if (nodes.length > 0) {
                const node = nodes[0];
                const rawRot = Math.round(node.rotation());
                let deg = rawRot % 360;
                if (deg > 180) deg -= 360;
                if (deg < -180) deg += 360;

                const nodeW = Math.max(10, node.width() * (node.scaleX() || 1));
                const nodeH = Math.max(10, node.height() * (node.scaleY() || 1));
                const cx = node.x() + nodeW / 2;
                const cy = node.y() + nodeH / 2;

                setRotatingInfo({
                  active: true,
                  degree: deg,
                  centerPx: { x: cx, y: cy },
                  badgePos: {
                    x: layerX + cx * zoom,
                    y: layerY + cy * zoom - 36,
                  },
                });
              }
            }}
            onTransformEnd={() => {
              setRotatingInfo({ active: false, degree: 0, centerPx: null, badgePos: null });
            }}
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

          {/* Live Rotation Guiding Crosshairs & Degree Ray */}
          {rotatingInfo.active && rotatingInfo.centerPx && (
            <>
              {/* Horizontal Center Guide */}
              <Line
                points={[-800, rotatingInfo.centerPx.y, pageWidthPx + 800, rotatingInfo.centerPx.y]}
                stroke="#FF2D95"
                strokeWidth={1.2 / zoom}
                dash={[5 / zoom, 4 / zoom]}
                opacity={0.85}
                listening={false}
              />
              {/* Vertical Center Guide */}
              <Line
                points={[rotatingInfo.centerPx.x, -800, rotatingInfo.centerPx.x, pageHeightPx + 800]}
                stroke="#FF2D95"
                strokeWidth={1.2 / zoom}
                dash={[5 / zoom, 4 / zoom]}
                opacity={0.85}
                listening={false}
              />
              {/* Angle Ray along rotation axis */}
              <Line
                points={[
                  rotatingInfo.centerPx.x - Math.cos((rotatingInfo.degree * Math.PI) / 180) * 800,
                  rotatingInfo.centerPx.y - Math.sin((rotatingInfo.degree * Math.PI) / 180) * 800,
                  rotatingInfo.centerPx.x + Math.cos((rotatingInfo.degree * Math.PI) / 180) * 800,
                  rotatingInfo.centerPx.y + Math.sin((rotatingInfo.degree * Math.PI) / 180) * 800,
                ]}
                stroke="#FF2D95"
                strokeWidth={1.4 / zoom}
                opacity={0.9}
                listening={false}
              />
            </>
          )}

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

      {/* Live Rotation Degree Badge */}
      {rotatingInfo.active && rotatingInfo.badgePos && (
        <div
          className="pointer-events-none absolute z-50 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-white bg-neutral-900/95 border border-white/20 shadow-2xl backdrop-blur -translate-x-1/2 -translate-y-full transition-all"
          style={{
            left: `${rotatingInfo.badgePos.x}px`,
            top: `${rotatingInfo.badgePos.y}px`,
          }}
        >
          <svg className="w-3.5 h-3.5 text-[#FF2D95]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{rotatingInfo.degree}°</span>
        </div>
      )}

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
      {/* Floating Recenter / Reset View Button when panned */}
      {(pan.x !== 0 || pan.y !== 0) && (
        <button
          type="button"
          onClick={() => setPan({ x: 0, y: 0 })}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface/90 hover:bg-surface text-text text-xs font-medium border border-border shadow-md backdrop-blur transition-all active:scale-95"
          title="Reset canvas pan to center"
        >
          <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span>Recenter Page</span>
        </button>
      )}

      {/* Subtle Vertical Canvas Scroll Track Indicator */}
      <div className="absolute right-1 top-2 bottom-2 w-1.5 bg-black/5 rounded-full pointer-events-none z-30">
        <div
          className="w-full bg-neutral-400/60 rounded-full transition-all"
          style={{
            height: `${Math.max(24, Math.min(stageSize.height - 16, (stageSize.height / (pageHeightPx * zoom + stageSize.height)) * stageSize.height))}px`,
            transform: `translateY(${Math.max(0, Math.min(stageSize.height - 40, (0.5 - pan.y / (pageHeightPx * zoom + 500)) * (stageSize.height - 40)))}px)`,
          }}
        />
      </div>

      {/* Subtle Horizontal Canvas Scroll Track Indicator */}
      <div className="absolute bottom-1 left-2 right-2 h-1.5 bg-black/5 rounded-full pointer-events-none z-30">
        <div
          className="h-full bg-neutral-400/60 rounded-full transition-all"
          style={{
            width: `${Math.max(24, Math.min(stageSize.width - 16, (stageSize.width / (pageWidthPx * zoom + stageSize.width)) * stageSize.width))}px`,
            transform: `translateX(${Math.max(0, Math.min(stageSize.width - 40, (0.5 - pan.x / (pageWidthPx * zoom + 500)) * (stageSize.width - 40)))}px)`,
          }}
        />
      </div>
    </div>
  );
}
