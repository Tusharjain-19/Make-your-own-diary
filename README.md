<div align="center">

```
  ███████╗████████╗ ██████╗ ██████╗ ██╗   ██╗██████╗  ██████╗ ██╗   ██╗███╗   ██╗██████╗ 
  ██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗╚██╗ ██╔╝██╔══██╗██╔═══██╗██║   ██║████╗  ██║██╔══██╗
  ███████╗   ██║   ██║   ██║██████╔╝ ╚████╔╝ ██████╔╝██║   ██║██║   ██║██╔██╗ ██║██║  ██║
  ╚════██║   ██║   ██║   ██║██╔══██╗  ╚██╔╝  ██╔══██╗██║   ██║██║   ██║██║╚██╗██║██║  ██║
  ███████║   ██║   ╚██████╔╝██║  ██║   ██║   ██████╔╝╚██████╔╝╚██████╔╝██║ ╚████║██████╔╝
  ╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═════╝ 
```

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 120" width="100%" height="120" style="max-width: 800px;">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#1A1C1B;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#6A5D43;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1A1C1B;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#1A1C1B" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect x="10" y="10" width="780" height="100" rx="12" fill="#F9F9F7" stroke="#E8E6E1" stroke-width="1.5" filter="url(#shadow)"/>
  <!-- Decorative Book Icon -->
  <g transform="translate(45, 36)">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#1A1C1B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#1A1C1B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="#FFFFFF"/>
    <path d="M8 7h8M8 11h6" stroke="#B8A88A" stroke-width="1.8" stroke-linecap="round"/>
  </g>
  <!-- Text Elements -->
  <text x="95" y="55" font-family="'Playfair Display', Georgia, serif" font-size="26" font-weight="600" fill="#1A1C1B" letter-spacing="-0.5">STORYBOUND</text>
  <text x="95" y="78" font-family="'Inter', -apple-system, sans-serif" font-size="12" font-weight="500" fill="#6B6B66" letter-spacing="1.5">MAKE YOUR OWN DIARY · THE PERSONAL BOOK STUDIO</text>
  <!-- Ribbon Badge -->
  <rect x="620" y="38" width="135" height="28" rx="14" fill="#F0EEE9" stroke="#E8E6E1" stroke-width="1"/>
  <text x="687" y="56" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#1A1C1B" text-anchor="middle">300 DPI · PRINT READY</text>
</svg>

<p align="center">
  <strong>Your memories. Your stories. Your handwriting. Your book.</strong>
</p>

<p align="center">
  A Canva-like web design studio for crafting tactile, bespoke travel diaries, memory books, and personal journals in mm-based precision, typesetting stories in your own personal handwriting font, downloading 300 DPI archival PDFs, and ordering linen-bound hardcovers.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14_App_Router-black?style=flat&logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-Warm_Editorial-6A5D43?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/react--konva-HTML5_Canvas-E8E6E1?style=flat&labelColor=1A1C1B&color=B8A88A" alt="Konva Canvas" />
  <img src="https://img.shields.io/badge/State-Zustand_%2B_Immer-orange?style=flat" alt="Zustand Immer" />
  <img src="https://img.shields.io/badge/Design_System-Warm_Editorial_Stationery-F9F9F7?style=flat&labelColor=1A1C1B&color=E8E6E1" alt="Warm Editorial Stationery" />
</p>

---

</div>

## 📌 Table of Contents

- [Vision & Philosophy](#-vision--philosophy)
- [Key Features](#-key-features)
- [Design System — Warm Editorial Stationery](#-design-system--warm-editorial-stationery)
- [Interactive Canvas & Editing Engine](#-interactive-canvas--editing-engine)
- [Signature Handwriting Pipeline](#-signature-handwriting-pipeline)
- [Tech Stack & Architecture](#-tech-stack--architecture)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Roadmap & Build Journey](#-roadmap--build-journey)
- [License](#-license)

---

## 📖 Vision & Philosophy

**Storybound** bridges the gap between ephemeral digital photo albums and timeless, tactile print craft.

Traditional photo book creators force users into rigid templates, clumsy drag-and-drop mechanics, or generic typography. Storybound reimagines bookmaking with:
1. **Millimeter-Accurate Layouts**: Every page, margin, bleed, and element is stored in **mm**, guaranteeing that what appears on your screen translates 1:1 to archival paper.
2. **True Personal Handwriting**: Instead of generic script fonts, users can vectorize their own handwriting from a simple printed A4 sheet into an authentic digital font.
3. **Calm Editorial Aesthetic**: Grounded in unbleached warm parchment, crisp cotton white sheets, deep carbon ink, and hairline borders—free from distracting neon colors or aggressive drop shadows.
4. **Accessible Pricing**: Design for free, download print-ready vector 300 DPI PDFs for ₹50, and order custom linen-bound physical hardcovers directly.

---

## ✨ Key Features

### 📐 Millimeter-Scale Studio Canvas
- **Native Formats**: Supports **A5 Portrait** (148 × 210 mm), **A4 Portrait** (210 × 297 mm), and **Square** (203 × 203 mm).
- **Scale Rendering**: Base coordinate conversion of `1 mm = 4 px` with continuous smooth zoom (25% to 300%) and hand pan tool (`H` or `Space + Drag`).
- **Safety Guides**: Built-in 10 mm safe margin guides and 3 mm bleed indicators.

### 🎯 Canva-Grade Element Manipulation
- **Konva Transformer**: 8 resize handles and top rotation anchor for smooth scaling and rotation.
- **Smart Magnetic Snapping**: Dynamic magenta snapping guides (`#FF2D95`) snapping to page center, edges, safe margins, and sibling element bounds.
- **Marquee Multi-Selection**: Drag on the canvas to select multiple elements simultaneously or `Shift + Click` to group.
- **Z-Index Layer Stacking**: Bring forward, send backward, bring to front, and send to back.
- **Full History**: Deep undo/redo stack (`Ctrl + Z` / `Ctrl + Y`).
- **Precision Nudging**: Arrow keys nudge elements by 1 mm (or 10 mm holding `Shift`).

### ✍️ Signature "My Handwriting" Engine
- Printable single-page A4 glyph template containing uppercase, lowercase, numbers, and punctuation.
- Perspective-warp scanning and ink stroke cleaning from phone photography.
- Vectorized TrueType/OpenType font generation private to the user account.
- 1-click application of handwriting to any heading, journal entry, or pull quote.

### 🎨 10 Curated Editorial Themes
- **Warm Editorial Stationery** (Flagship default: `#FAFAF8` parchment, Playfair Display & Inter)
- **Vintage Journal** (`#F3E9D2` aged paper, Special Elite typewriter & Lora)
- **Royal India** (`#F8F1E4` sandstone, Cormorant Garamond & DM Sans)
- **Modern Editorial** (`#FFFFFF` grid, Space Grotesk & Inter)
- **Polaroid Scrapbook** (`#FFF9F0` cream, Caveat script & washi tape accents)
- Plus Nature Adventure, Romantic Storybook, Colour Pop, Classic Literature, and Dark Luxury.

### 📑 15 Structured Layout Presets (L01–L15)
- Full-bleed photography, 50/50 photo and story splits, chapter openers, multi-photo grids, pull quote spreads, and collage entries.

### 🔒 Privacy & Row Level Security (RLS)
- LocalStorage simulation of strict PostgreSQL RLS policies (`WHERE user_id = auth.uid()`).
- Data isolation ensuring different user accounts cannot view, duplicate, or mutate each other's books.

---

## 🎨 Design System — Warm Editorial Stationery

Storybound is styled strictly under the **Warm Editorial Stationery** token specification:

```yaml
Colors:
  background:               #F9F9F7   (Warm unbleached parchment)
  surface:                  #FFFFFF   (Crisp pure white sheet)
  surface-container-low:    #F4F4F2   (Editor canvas stage)
  surface-container:        #EEEEEC   (Tab containers & tags)
  on-surface / primary:     #1A1C1B   (Deep carbon ink)
  on-surface-variant:       #444748   (Secondary label tone)
  outline / border:         #E8E6E1   (Subtle warm hairline border)
  text-muted:               #6B6B66   (Weathered pencil gray)
  accent-soft:              #F0EEE9   (Interactive wash tone)
  warm-gold:                #B8A88A   (Milestone & bookmark accent)
  success:                  #2F7D5B   (Softened botanical green)
  error:                    #BA1A1A   (Subdued terracotta crimson)

Geometry:
  radius-default:           10px (0.625rem) — Uniform moleskine corner
  radius-full:              9999px — Discrete pill tags & badges

Typography:
  Display & Headings:       Playfair Display (Serif, 400-600)
  Body & Interface:         Inter (Sans-serif, 400-600)
```

---

## 🛠️ Tech Stack & Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      STORYBOUND APPLICATION                     │
├───────────────────────────────┬─────────────────────────────────┤
│ FRONTEND LAYER                │ CANVAS & STATE LAYER            │
│ • Next.js 14 (App Router)     │ • react-konva & konva (Canvas)  │
│ • TypeScript (Strict mode)    │ • Zustand (Global editor store) │
│ • Tailwind CSS (Theme tokens) │ • Immer (Immutable state trees) │
│ • Radix UI / shadcn/ui        │ • mmToPx (1 mm = 4 px scaling)  │
│ • Lucide React (1.5px stroke) │ • Snap Engine (Magenta guides)  │
├───────────────────────────────┼─────────────────────────────────┤
│ DATA & STORAGE LAYER          │ PRINT & EXPORT LAYER            │
│ • Simulated RLS Multi-User    │ • Playwright headless browser   │
│ • Next.js Edge Middleware     │ • 300 DPI Vector PDF generator  │
│ • Browser Storage / Cookies   │ • 3 mm bleed & safe margin calc │
│ • Next.js REST API Routes     │ • Razorpay payment integration  │
└───────────────────────────────┴─────────────────────────────────┘
```

---

## 📂 Project Directory Structure

```text
make-your-own-diary/
├── design.md                  # Warm Editorial Stationery design specification
├── docs/                      # PRD, specs, and architectural guidelines
│   ├── design.md              # Design tokens and component rules
│   ├── prd.md                 # Product requirement documentation
│   ├── frontend.md            # Frontend architecture & types
│   ├── backend.md             # Database schemas and API specifications
│   └── stitch-prompts.md      # UI & Stitch design prompts
├── templates/                 # Global layout & theme JSON models
│   ├── themes.json            # 10 editorial theme definitions
│   └── layouts.json           # 15 page layout templates
└── frontend/                  # Next.js 14 web application
    ├── public/                # Static assets, fonts, and samples
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/        # Login & Signup with demo user switching
    │   │   ├── (marketing)/   # Landing page & Theme gallery shell
    │   │   ├── api/books/     # REST endpoint creating books & 20 pages
    │   │   ├── books/new/     # 4-step interactive book wizard
    │   │   ├── books/[id]/    # Canva-like Konva editor shell
    │   │   ├── dashboard/     # "My Books" shelf with RLS demonstration
    │   │   ├── layout.tsx     # Root layout with Playfair & Inter fonts
    │   │   └── middleware.ts  # Route authentication guard
    │   ├── components/
    │   │   ├── editor/
    │   │   │   ├── Canvas/    # KonvaStage, TextNode, ImageNode, ShapeNode
    │   │   │   ├── panels/    # Themes, Layouts, Uploads, Text, Elements, Handwriting
    │   │   │   ├── LeftRail.tsx        # 72px icon rail with 300px flyout
    │   │   │   ├── TopBar.tsx          # 56px action bar with zoom & undo/redo
    │   │   │   ├── PropertiesPanel.tsx # 280px contextual properties inspector
    │   │   │   └── PageStrip.tsx       # 110px bottom thumbnail navigation
    │   │   └── ui/            # Button, Input, Card, Dialog, Tabs
    │   ├── lib/
    │   │   ├── auth/          # Auth context & browser storage RLS engine
    │   │   ├── editor/        # Types, mm units scaling, snap math, Zustand store
    │   │   └── themes/        # Theme & layout loaders
    │   └── styles/
    │       └── globals.css    # Warm Editorial Stationery CSS tokens & typography
    ├── next.config.mjs        # Webpack config with konva browser alias
    └── tailwind.config.ts     # Tailwind theme extensions
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `18.17+` or `20.x`
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Tusharjain-19/Make-your-own-diary.git
   cd Make-your-own-diary
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   ```
   http://localhost:3000 (or http://localhost:3001)
   ```

5. **Demo Accounts (Instant 1-Click Sign In):**
   - **Tushar Sharma**: `tushar@storybound.app` (ID: `user-tushar-01`)
   - **Sarah Jenkins**: `sarah@storybound.app` (ID: `user-sarah-02`)

---

## ⌨️ Keyboard Shortcuts

Inside the editor canvas (`/books/[id]/edit`), standard Canva keyboard shortcuts are active:

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + Z` / `Cmd + Z` | Undo last change |
| `Ctrl + Y` / `Ctrl + Shift + Z` | Redo last change |
| `Ctrl + D` / `Cmd + D` | Duplicate selected element (offset by +5mm) |
| `Ctrl + C` / `Cmd + C` | Copy selected element to clipboard |
| `Ctrl + V` / `Cmd + V` | Paste element from clipboard |
| `Delete` / `Backspace` | Delete selected element |
| `Escape` | Deselect all elements |
| `Arrow Keys` | Nudge element by 1 mm |
| `Shift + Arrow Keys` | Nudge element by 10 mm |
| `]` | Bring forward |
| `[` | Send backward |
| `Shift + ]` | Bring to front |
| `Shift + [` | Send to back |
| `V` | Switch to Select Tool |
| `H` / `Space + Drag` | Pan canvas workspace |

---

## 🗺️ Build Journey & Roadmap

- [x] **Day 1**: Project initialization, Next.js 14, Tailwind tokens, shadcn/ui primitives, Inter & Playfair Display fonts.
- [x] **Day 2**: Authentication context, Edge middleware protection, demo user switching, and simulated Row Level Security (RLS).
- [x] **Day 3**: Responsive marketing landing page, how-it-works workflow, pricing, and 10-theme showcase gallery.
- [x] **Day 4**: Dashboard with "My Books" shelf, 4-step creation wizard (Type → Size → Theme → Metadata), and automated 20-page book creation.
- [x] **Day 5**: Editor shell (`TopBar`, `LeftRail`, `PropertiesPanel`, `PageStrip`) and Konva mm-scale canvas stage proof-of-concept.
- [x] **Day 6**: Core element editing with `Konva.Transformer`, multi-selection, magenta snapping guides, z-ordering, and keyboard shortcuts.
- [x] **Design Refinement**: Comprehensive unification under the **Warm Editorial Stationery** design system.
- [ ] **Day 7**: Handwriting font glyph scanning, perspective warp processing, and vector font compilation.
- [ ] **Day 8**: Headless Playwright 300 DPI PDF export service and Razorpay checkout integration.
- [ ] **Day 9**: Physical hardcover print order fulfillment and shipping tracker.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <sub>Crafted with care for thoughtful travelers and memory keepers. Built with Next.js, Konva, and Tailwind CSS.</sub>
</div>
