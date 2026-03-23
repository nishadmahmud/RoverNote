# Premium exports + image quality roadmap

## Goals
- Free users can browse and share journeys, but premium enables “creator-grade” exports.
- Premium users get higher-quality images (and optional watermark removal on downloads).

## Image resolution differences (practical MVP)
Free tier (today / quick win)
- Keep your current upload flow and existing UI limits (1 cover + up to 4 additional).
- Optionally cap uploads on the client (e.g., recommend <= 2–3MB images) to control storage cost.
- Use current stored images as-is for viewing.

Premium tier (next)
- Store the original upload for premium users (no downscaling).
- If you want strict control without heavy backend work:
  - Post-upload, create “premium variants” in storage (e.g., 2048px + original).
  - Serve the premium variant to premium users in the web UI.

## Export options to sell (Premium)
1. `PDF export` (best perceived value)
- One-click export of a journey as a scrapbook-style PDF.
- Include: title, location/country, date, story text, must-dos list, and the photos in a nice layout.

2. `Download ZIP` (creator-friendly)
- Download all photos from a journey as a single ZIP.
- Premium version:
  - higher resolution images (or original variants)
  - optional removal of watermarks for downloaded files

3. Public “share as PDF” later (optional)
- Generate a shareable read-only page for the journey (already partially handled by `is_public`).
- Later: allow “export from share link”.

## How to implement later (implementation notes)
- Do exports in server context:
  - Route handler triggers a job and returns a file URL.
  - Store generated PDFs/zips temporarily (then delete after N hours) to avoid long-term storage costs.
- PDF generation approaches (choose one):
  - `@react-pdf/renderer` (pure JS, works well with React)
  - HTML->PDF using a headless renderer if you need pixel-perfect templates

## Suggested order
1. PDF export for a single journey
2. ZIP download for premium
3. Optional: higher-res photo variants + watermark controls

