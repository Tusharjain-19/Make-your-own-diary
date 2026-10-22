# prompt.md — Day-by-Day Build Prompts

**How to use:** Put `prd.md`, `designtemplete.md`, `frontend.md`, `backend.md` in a `/docs` folder of your repo. Paste the **Master Context** once at the start of every AI IDE session, then paste that day's prompt. Finish each day's "Done when" check before moving on.

---

## Master Context (paste first, every session)

```
You are helping me build "Storybound", a web app where people design personal books/travel diaries in a Canva-like editor, write in their own handwriting font, download a PDF for ₹50, and order printed hardcovers.
Read /docs/prd.md, /docs/designtemplete.md, /docs/frontend.md, /docs/backend.md before coding.
Stack: Next.js (App Router, TypeScript), Tailwind, shadcn/ui, Zustand+Immer, react-konva, Supabase, Razorpay.
Rules: minimal, clean design; all page units in mm; page data stored as JSON; small commits; no unused code; explain any file you create in one line; run lint/typecheck after changes.
```

---

## WEEK 1 — Foundation

### Day 1 — Project setup & design tokens

```
Create the Next.js 14 TypeScript project with Tailwind and shadcn/ui. Add the folder structure from frontend.md. Implement the CSS variables and Tailwind theme from designtemplete.md (colors, radius, shadow). Set up Inter and Playfair Display with next/font. Create a basic layout, a Button, Input, Card, Dialog, Tabs from shadcn styled minimally. Add ESLint, Prettier, and path aliases.
```

**Done when:** `npm run dev` shows a styled starter page; typecheck passes.

### Day 2 — Supabase, auth, database

```
Set up Supabase client/server helpers. Create SQL migrations for all tables in backend.md with RLS policies (user_id = auth.uid(); pages via books). Create storage buckets: photos, handwriting, exports (private), themes-assets (public). Build login/signup (email + Google) pages and an auth middleware protecting /dashboard, /books, /handwriting, /orders. Auto-create a profile on signup via trigger.
```

**Done when:** you can sign up, log in, and see a protected dashboard; RLS blocks another user's rows.

### Day 3 — Landing page & theme gallery shell

```
Build the marketing landing page: hero ("Your memories. Your stories. Your handwriting. Your book."), 3-step how-it-works, theme carousel placeholder, handwriting teaser, pricing (PDF ₹50, print coming), FAQ, footer. Follow the minimal style in designtemplete.md with lots of whitespace. Add /themes page with 10 empty theme cards. Fully responsive.
```

**Done when:** landing looks clean on mobile and desktop.

### Day 4 — Dashboard & book creation wizard

```
Build /dashboard with "My Books" grid (cover thumbnail placeholder, title, edited date, status) and a New Book button. Build /books/new wizard: type → size (A5/A4/Square) → theme (10 cards) → title/subtitle/author/dates. On finish, POST /api/books that creates the book and a cover plus 20 blank pages. Add duplicate and delete with confirm dialog.
```

**Done when:** creating a book inserts rows in books and pages and redirects to the editor route.

### Day 5 — Editor shell + canvas proof of concept

```
Build the editor shell at /books/[id]/edit with the layout from designtemplete.md: top bar, left rail with panels (Themes, Layouts, Uploads, Text, Elements, Handwriting), center canvas, right properties panel, bottom page strip. Implement the Zustand store with the Book/Page/Element types from frontend.md. Use react-konva to render the current page at mm-based scale with zoom and pan. Render a hardcoded sample page with one text and one image. Compare Konva behavior; keep Konva unless blocked.
```

**Done when:** the page renders to scale, zoom works, selection handles appear.

### Day 6 — Core element editing

```
Implement element selection (click, shift-click, marquee), move, resize, rotate with Konva Transformer. Add snapping to page center, edges, margins and other elements with magenta guides. Add z-order actions (forward/back/front/back-most), lock, duplicate, delete, arrow-key nudge, copy/paste. Add keyboard shortcuts from frontend.md.
```

**Done when:** you can manipulate elements as smoothly as in Canva basics.

### Day 7 — Undo/redo + autosave + load/save

```
Add patch-based undo/redo with Immer (Ctrl+Z / Ctrl+Y, 100 steps). Load book + pages from Supabase into the store. Implement debounced autosave (2s) via PUT /api/books/:id/pages/:pageId with a "Saved · just now / Saving… / Error" indicator and retry. Add an IndexedDB offline queue. Add page strip actions: add, duplicate, delete, drag-reorder.
```

**Done when:** refresh keeps everything; reorder persists.

---

## WEEK 2 — Content tools

### Day 8 — Image upload & placement

```
Build the Uploads panel: drag-drop/multi-select upload to Supabase Storage via signed URLs (/api/assets/sign). Accept JPEG/PNG/WebP and convert HEIC. Generate thumbnail and editor-size preview with sharp in /api/assets/:id/process; store width/height. Show uploads grid; click or drag to add an ImageEl to the page. Add low-resolution warning logic (DPI at placed size < 150).
```

**Done when:** a Jaipur photo uploads and appears on the page quickly.

### Day 9 — Image properties

```
Implement non-destructive crop (crop rect stored in element), rotate, flip, replace image, border, corner radius, opacity, and frames (none, polaroid, round, arch). Build ImageProps in the right panel. Double-click enters crop mode with drag-to-reposition inside the frame.
```

**Done when:** crop can be changed later without re-uploading.

### Day 10 — Text editing and fonts

```
Implement text elements with double-click inline editing (contentEditable overlay synced to Konva). Build TextProps: font family, size, weight, italic, underline, color, alignment, line height, letter spacing, rotation. Self-host the fonts listed in designtemplete.md (WOFF2, subset latin) and build a searchable font picker that previews each font name in its own face. Add Text panel presets: Heading, Subheading, Body, Caption, Quote.
```

**Done when:** you can type a story and switch among 20 fonts instantly.

### Day 11 — Shapes, icons, colors

```
Build the Elements panel: shapes (rect, circle, line, arrow), frames, dividers, stamps, tape, and the icon set from designtemplete.md as SVG with currentColor. Add a color picker with HEX input, recent colors, and "my colors". Add page background color/image. Create the 10 palette presets and an apply-palette action that recolors theme-token elements only.
```

**Done when:** icons recolor and palettes swap without breaking layout.

### Day 12 — Layout library

```
Implement the 15 layouts L01–L15 as JSON templates in mm with placeholder slots (image frames, text boxes). Build the Layouts panel with thumbnails. Applying a layout maps existing photos/text into slots by order and keeps extras on the page. Add "Add page from layout".
```

**Done when:** switching layouts reflows existing content sensibly.

### Day 13 — Themes 1–5

```
Create theme JSON for Minimal Memories, Vintage Journal, Royal India, Modern Editorial, Polaroid Scrapbook per designtemplete.md: palette, fonts, 3 cover templates, layout variants, decor assets (SVG). Wire theme selection into the wizard and the Themes panel. Applying a theme to an existing book restyles fonts/colors/background without deleting content.
```

**Done when:** each theme looks distinct and good on a sample 6-page book.

### Day 14 — Themes 6–10 + gallery

```
Create the remaining themes: Nature & Adventure, Romantic Storybook, Colour Pop, Classic Literature, Dark Luxury. Generate gallery preview images (cover + 2 spreads) from theme JSON. Populate the /themes gallery and landing carousel. Polish all 10 for whitespace, alignment and contrast.
```

**Done when:** all 10 themes complete; gallery live.

---

## WEEK 3 — Signature feature, export, money

### Day 15 — Handwriting: template sheet & capture

```
Design the glyph template (A4 PDF): 4 corner alignment markers, a grid of labeled boxes for A–Z, a–z, 0–9 and common punctuation (. , ! ? ' " - : ; ( ) & @ ₹), with baseline guides and a "write with a dark pen" instruction. Save as /public/glyph-template.pdf and keep the grid coordinates in lib/handwriting/grid.ts. Build the Handwriting panel step 1 (download) and step 2 (upload photo/scan) with preview and tips.
```

**Done when:** you can print the sheet and upload a phone photo of it.

### Day 16 — Handwriting: processing pipeline

```
In a Web Worker with OpenCV.js: grayscale, adaptive threshold, detect the 4 corner markers, perspective-warp to canonical size, slice cells using the known grid, remove grid lines, threshold, denoise, trim and record per-glyph bounding box and baseline offset. Return glyph bitmaps with a quality score. Build GlyphReview grid showing each glyph, flagging empty/low-quality ones.
```

**Done when:** a real sheet yields ~90 clean glyph images.

### Day 17 — Handwriting: vectorize, build font, use it

```
Vectorize each glyph (potrace/ImageTracer), simplify paths, scale to unitsPerEm 1000 using baseline/x-height alignment, compute advance widths with side bearings. Build the font with opentype.js, export OTF, upload to the handwriting bucket, POST /api/handwriting (server validates glyph count and size, enforces 3 fonts/user). Load with FontFace and add to the top of the font picker with a pen icon. Add FontPreview with custom sample text, Draw mode to redraw a single glyph, and delete font.
```

**Done when:** you type a paragraph on a page in your own handwriting.

### Day 18 — Preview & flipbook

```
Build /books/[id]/preview with single page, two-page spread, and flip-through animation (CSS 3D). Add a realistic cover mockup preview. Add keyboard arrows navigation. Make preview use the same renderer as export (shared JSON → React render component) so output matches.
```

**Done when:** preview is accurate to the editor and smooth.

### Day 19 — PDF export service

```
Create the PDF worker service (Node + Playwright, Dockerfile) with token auth. Implement exports table jobs: load book JSON and assets, build HTML with mm-positioned elements, @page size from book size, @font-face for theme fonts and the user's handwriting font, render PDF with preferCSSPageSize and printBackground, upload to the exports bucket, return signed URL. Add a watermarked preview mode. Add a test script that exports fixtures for every layout and saves PNGs of each page for visual comparison.
```

**Done when:** the exported PDF matches the editor for all 15 layouts.

### Day 20 — Razorpay ₹50 flow

```
Implement /api/payments/create (₹50 = 5000 paise), Razorpay Checkout on /books/[id]/checkout (UPI first), a signed webhook handler as the source of truth, pdf_entitlements with 7-day free re-export, and the Download PDF button that is enabled after payment. Make it idempotent and add a payments table log. Send a receipt email via Resend.
```

**Done when:** a test-mode payment unlocks the clean PDF download.

### Day 21 — Hardening & QA

```
Add Sentry, error boundaries, loading skeletons, and empty states. Write Playwright E2E: signup → create book → upload photo → add text with handwriting font → export watermark preview → pay (test) → download. Fix performance: lazy-load the editor, limit Konva layers, use preview-size images. Run a Lighthouse pass on the landing page.
```

**Done when:** E2E passes and a 20-page book edits smoothly.

---

## WEEK 4 — Print & launch

### Day 22 — Print-ready export

```
Add print export: 3 mm bleed, crop marks optional, safe-margin warnings in the editor, a cover spread PDF with spine width computed from page count and a configurable printer spec (stored in print_products). Add a pre-flight check listing low-res images, text outside safe area, empty pages, and missing glyph fallbacks.
```

**Done when:** the pre-flight report appears and a print PDF is generated.

### Day 23 — Print orders (manual fulfilment)

```
Build the order flow: choose product (Mini / Travel Diary / Classic), copies, address form with PIN validation, Razorpay payment, orders table. Build /orders with a status timeline and an /admin/orders page to download print files, update status and tracking URL, and trigger status emails.
```

**Done when:** you can place and manage a test print order.

### Day 24 — Polish pass

```
Do a design polish pass following designtemplete.md: spacing, alignment, microcopy, empty states, tooltips, onboarding tour (3 steps), keyboard shortcut help modal. Add a sample "Jaipur" demo book users can copy. Improve mobile view/preview experience and tablet panels as bottom sheets.
```

**Done when:** the app feels calm, consistent and minimal.

### Day 25 — Create your demo & content

```
Help me prepare marketing assets: seed the Jaipur sample book content from my photos, write landing copy variants, FAQ, pricing explanation, privacy policy and terms (plain-language drafts to be reviewed by a professional), and a short script for a 30-second demo video showing the handwriting feature.
```

### Day 26 — Security & privacy review

```
Audit RLS, storage policies and signed URL lifetimes. Verify handwriting files and photos are private. Add account deletion that removes books, assets, fonts, exports. Add rate limiting to uploads, exports, payments. Strip EXIF GPS from derivatives. Provide a checklist of findings and fixes.
```

### Day 27 — Deploy

```
Prepare deployment: Vercel for web, Railway/Render for the PDF worker (Docker), Supabase production project with migrations, env vars from backend.md, Razorpay live webhook, custom domain, Resend domain verification. Write a deployment checklist and a rollback plan.
```

### Day 28 — Beta with 20 people

Manual day. Give 20 users (friends, classmates) the link. Ask them to make a 10-page book. Track: how many finish, how many try handwriting, how many pay ₹50, what breaks.

```
Create a simple feedback form and an events table (book_created, page_edited, handwriting_started, handwriting_completed, export_paid, order_placed) with a small admin dashboard showing funnel counts.
```

### Day 29 — Fix top issues

```
Here are the top 10 issues from beta: [paste]. Triage by severity, propose fixes, implement the top 5, and add regression tests.
```

### Day 30 — Launch & printer validation

Manual: get 3 printer quotes using your Jaipur book, order samples, then set real print prices.

```
Update print_products with the final specs/prices, update pricing copy on the landing page, and add a launch checklist (Product Hunt/Instagram/Reddit posts, referral link, creator outreach list).
```

---

## Debug prompts (reuse anytime)

```
Bug: [describe]. Expected: [..]. Actual: [..]. Relevant files: [..]. Find the root cause first, explain it in 3 lines, then fix with the smallest change and add a test.
```

```
Refactor [file] for readability and performance without changing behavior. List what you changed.
```

```
Review the current code against /docs/prd.md and list features that are missing or incomplete, ordered by priority.
```

---

## Cut-scope guide (if you run out of time)

Keep: auth, dashboard, editor core, 5 themes, handwriting (sheet flow), PDF export, ₹50 payment.
Delay: 5 extra themes, Draw mode, flipbook animation, print ordering, onboarding tour.
