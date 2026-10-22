import { El } from "./types";

export interface SnapResult {
  x: number;
  y: number;
  guides: {
    vertical: number[]; // x positions in mm
    horizontal: number[]; // y positions in mm
  };
}

export function calculateSnap(
  draggedX: number,
  draggedY: number,
  w: number,
  h: number,
  otherElements: El[],
  pageWidthMm: number,
  pageHeightMm: number,
  marginMm: number,
  thresholdMm = 1.8
): SnapResult {
  let snapX = draggedX;
  let snapY = draggedY;
  const guides = {
    vertical: [] as number[],
    horizontal: [] as number[],
  };

  // Dragged element key points
  const left = draggedX;
  const centerX = draggedX + w / 2;
  const right = draggedX + w;

  const top = draggedY;
  const centerY = draggedY + h / 2;
  const bottom = draggedY + h;

  // Vertical snap targets (X positions)
  const xTargets = [
    0, // Page Left
    marginMm, // Left safe margin
    pageWidthMm / 2, // Page horizontal center
    pageWidthMm - marginMm, // Right safe margin
    pageWidthMm, // Page Right
  ];

  // Add other elements' left, center, right
  for (const el of otherElements) {
    xTargets.push(el.x, el.x + el.w / 2, el.x + el.w);
  }

  // Horizontal snap targets (Y positions)
  const yTargets = [
    0, // Page Top
    marginMm, // Top safe margin
    pageHeightMm / 2, // Page vertical center
    pageHeightMm - marginMm, // Bottom safe margin
    pageHeightMm, // Page Bottom
  ];

  // Add other elements' top, center, bottom
  for (const el of otherElements) {
    yTargets.push(el.y, el.y + el.h / 2, el.y + el.h);
  }

  // Evaluate X snapping (left, center, right)
  let minDiffX = thresholdMm;
  let chosenSnapX: number | null = null;
  let chosenGuideX: number | null = null;

  for (const target of xTargets) {
    // Left edge to target
    const diffLeft = Math.abs(left - target);
    if (diffLeft < minDiffX) {
      minDiffX = diffLeft;
      chosenSnapX = target;
      chosenGuideX = target;
    }
    // Center to target
    const diffCenter = Math.abs(centerX - target);
    if (diffCenter < minDiffX) {
      minDiffX = diffCenter;
      chosenSnapX = target - w / 2;
      chosenGuideX = target;
    }
    // Right edge to target
    const diffRight = Math.abs(right - target);
    if (diffRight < minDiffX) {
      minDiffX = diffRight;
      chosenSnapX = target - w;
      chosenGuideX = target;
    }
  }

  if (chosenSnapX !== null && chosenGuideX !== null) {
    snapX = chosenSnapX;
    guides.vertical.push(chosenGuideX);
  }

  // Evaluate Y snapping (top, center, bottom)
  let minDiffY = thresholdMm;
  let chosenSnapY: number | null = null;
  let chosenGuideY: number | null = null;

  for (const target of yTargets) {
    // Top edge to target
    const diffTop = Math.abs(top - target);
    if (diffTop < minDiffY) {
      minDiffY = diffTop;
      chosenSnapY = target;
      chosenGuideY = target;
    }
    // Center to target
    const diffCenter = Math.abs(centerY - target);
    if (diffCenter < minDiffY) {
      minDiffY = diffCenter;
      chosenSnapY = target - h / 2;
      chosenGuideY = target;
    }
    // Bottom edge to target
    const diffBottom = Math.abs(bottom - target);
    if (diffBottom < minDiffY) {
      minDiffY = diffBottom;
      chosenSnapY = target - h;
      chosenGuideY = target;
    }
  }

  if (chosenSnapY !== null && chosenGuideY !== null) {
    snapY = chosenSnapY;
    guides.horizontal.push(chosenGuideY);
  }

  return { x: snapX, y: snapY, guides };
}
