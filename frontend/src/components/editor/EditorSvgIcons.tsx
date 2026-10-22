import * as React from "react";

export interface SvgIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

// 1. Canva Checkerboard Transparency / Opacity Icon
export function SvgTransparency({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" />
      <path d="M3 3h4.5v4.5H3z" fill="currentColor" opacity="0.3" stroke="none" />
      <path d="M12 3h4.5v4.5H12z" fill="currentColor" opacity="0.7" stroke="none" />
      <path d="M7.5 7.5H12v4.5H7.5z" fill="currentColor" opacity="0.5" stroke="none" />
      <path d="M16.5 7.5H21v4.5h-4.5z" fill="currentColor" opacity="0.9" stroke="none" />
      <path d="M3 12h4.5v4.5H3z" fill="currentColor" opacity="0.4" stroke="none" />
      <path d="M12 12h4.5v4.5H12z" fill="currentColor" opacity="0.8" stroke="none" />
      <path d="M7.5 16.5H12V21H7.5z" fill="currentColor" opacity="0.6" stroke="none" />
      <path d="M16.5 16.5H21V21h-4.5z" fill="currentColor" opacity="1" stroke="none" />
    </svg>
  );
}

// 2. Canva Copy Style Paint Roller Icon
export function SvgPaintRoller({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="3" y="3" width="14" height="6" rx="2" fill="currentColor" fillOpacity="0.15" />
      <path d="M17 6h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-6v4" />
      <rect x="11" y="16" width="4" height="6" rx="1.5" fill="currentColor" />
    </svg>
  );
}

// 3. Text Effects FX Icon
export function SvgTextEffects({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M3 5h8M3 11h6M3 5v14" />
      <path d="M14 8l6 10M20 8l-6 10" />
      <circle cx="18" cy="6" r="1.5" fill="currentColor" />
    </svg>
  );
}

// 4. Hollow / Knockout Text Icon
export function SvgHollowText({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M4 19L11.2 4h1.6L20 19M7 14h10" strokeDasharray="3 2" />
      <path d="M12 7l3 7h-6z" fill="none" strokeWidth="1" />
    </svg>
  );
}

// 5. Uppercase / Lowercase aA Modifier Icon
export function SvgUppercase({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M3 18L8 5l5 13M5 14h6" />
      <path d="M15 13a3 3 0 0 1 5-2v7M20 14a3 3 0 1 1-5 2" />
    </svg>
  );
}

// 6. Strikethrough Icon
export function SvgStrikethrough({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M16 6.5A4.5 4.5 0 0 0 7.5 9c0 2 1.5 3 4.5 3.5M3 12h18M8 17.5A4.5 4.5 0 0 0 16.5 15" />
    </svg>
  );
}

// 7. Flip Horizontal Icon
export function SvgFlipHorizontal({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="12" y1="2" x2="12" y2="22" strokeDasharray="3 3" />
      <path d="M8 6L3 12l5 6V6z" fill="currentColor" fillOpacity="0.2" />
      <path d="M16 6l5 6-5 6V6z" />
    </svg>
  );
}

// 8. Flip Vertical Icon
export function SvgFlipVertical({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="2" y1="12" x2="22" y2="12" strokeDasharray="3 3" />
      <path d="M6 8L12 3l6 5H6z" fill="currentColor" fillOpacity="0.2" />
      <path d="M6 16l6 5 6-5H6z" />
    </svg>
  );
}

// 9. Bold Icon
export function SvgBold({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    </svg>
  );
}

// 10. Italic Icon
export function SvgItalic({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="19" y1="4" x2="10" y2="4" />
      <line x1="14" y1="20" x2="5" y2="20" />
      <line x1="15" y1="4" x2="9" y2="20" />
    </svg>
  );
}

// 11. Underline Icon
export function SvgUnderline({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M6 3v7a6 6 0 0 0 12 0V3" />
      <line x1="4" y1="21" x2="20" y2="21" />
    </svg>
  );
}

// 12. Text Alignments
export function SvgAlignLeft({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <line x1="21" y1="6" x2="3" y2="6" /><line x1="15" y1="12" x2="3" y2="12" /><line x1="19" y1="18" x2="3" y2="18" />
    </svg>
  );
}
export function SvgAlignCenter({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <line x1="21" y1="6" x2="3" y2="6" /><line x1="17" y1="12" x2="7" y2="12" /><line x1="19" y1="18" x2="5" y2="18" />
    </svg>
  );
}
export function SvgAlignRight({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="12" x2="9" y2="12" /><line x1="21" y1="18" x2="5" y2="18" />
    </svg>
  );
}
export function SvgAlignJustify({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="12" x2="3" y2="12" /><line x1="21" y1="18" x2="3" y2="18" />
    </svg>
  );
}

// 13. Spacing / Sliders
export function SvgSpacing({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...props}>
      <path d="M7 6h10M7 18h10M12 6v12M9 9l3-3 3 3M9 15l3 3 3-3" />
    </svg>
  );
}

// 14. Border Settings Icon
export function SvgBorder({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 3" />
      <rect x="7" y="7" width="10" height="10" rx="1" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
}

// 15. Stacking Layers
export function SvgLayerUp({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5l-7 7h4v7h6v-7h4l-7-7z" />
    </svg>
  );
}
export function SvgLayerDown({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 19l7-7h-4V5h-6v7H5l7 7z" />
    </svg>
  );
}
export function SvgLayers({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

// 16. Lock & Unlock
export function SvgLock({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
export function SvgUnlock({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}

// 17. Duplicate & Trash
export function SvgDuplicate({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="8" y="8" width="13" height="13" rx="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}
export function SvgTrash({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

// 18. Palette & Sparkles
export function SvgPalette({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M13.5 2C8.8 2 5 5.8 5 10.5c0 2.4 1 4.5 2.5 6 1 .9 1.5 2.2 1.5 3.5 0 .6.4 1 1 1h2c4.7 0 8.5-3.8 8.5-8.5C20.5 6.2 17.4 2 13.5 2z" />
      <circle cx="9.5" cy="8.5" r="1.2" fill="currentColor" />
      <circle cx="13.5" cy="6.5" r="1.2" fill="currentColor" />
      <circle cx="16.5" cy="10.5" r="1.2" fill="currentColor" />
    </svg>
  );
}
export function SvgSparkles({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" fill="currentColor" fillOpacity="0.2" />
      <path d="M19 16l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z" />
    </svg>
  );
}

// 19. Plus, Minus, Check
export function SvgPlus({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
export function SvgMinus({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
export function SvgCheck({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// 20. Canvas View Controls: Rulers, Margins, Bleed
export function SvgRulersGuides({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...props}>
      <path d="M3 4h18M3 4v16M3 9h4M3 14h6M3 19h4M8 4v4M13 4v6M18 4v4" />
    </svg>
  );
}
export function SvgMargins({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <rect x="7" y="7" width="10" height="10" strokeDasharray="2 2" />
    </svg>
  );
}
export function SvgPrintBleed({ size = 16, className = "", ...props }: SvgIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...props}>
      <rect x="5" y="5" width="14" height="14" />
      <path d="M2 5h3M2 19h3M22 5h-3M22 19h-3M5 2v3M19 2v3M5 22v-3M19 22v-3" />
    </svg>
  );
}
