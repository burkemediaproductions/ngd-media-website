# NGD Media — launch site + full portfolio-ready website

**ServiceUp tenant slug:** `ngd-media`

This is a dependency-free, Node-powered **static HTML generator**. It produces complete crawlable HTML for each page during the Netlify build (not just a client-side React shell). The website is intentionally independent of ServiceUp until explicitly connected. Client-side JavaScript only adds optional interactions.

## Quick start

1. Install Node 20+.
2. Run `npm run build`.
3. Run `npm run check`.
4. Run `npm run dev` and open `http://localhost:4173/`.
5. Push this project to GitHub and connect it to Netlify. Netlify auto-detects `netlify.toml`, builds with `npm run build`, and publishes `dist/`.

## Launch now vs full site

- `/launch/` is a compact launch landing page with polished copy and CTAs. It is deliberately `noindex` so it does not compete in search with the full homepage.
- `/` is the fully built main homepage, with corresponding `/about/`, `/services/`, `/work/`, `/contact/`, `/privacy/`, `/terms/`, and individual services and project routes.
- **To launch the compact page as the live homepage**, in `src/build.mjs` change the `home` renderer from `home()` to `home(true)`; keep the `/launch/` URL as the internal staging preview. Switch it back when you want the full site. This avoids having duplicate indexable homepages.
- The three portfolio entries are explicitly labeled **creative concepts** rather than falsely presenting fictional projects as completed client work. Replace with verified projects and films when available.

## Edit content

All content lives in `data/site.mjs`: global configuration, SEO, page records, service records, and portfolio records. Each repeatable item has a unique `slug`, structured fields, and `status`, `createdAt`, and `publishedAt`. HTML templates live in `src/build.mjs`; presentation in `public/assets/css/style.css` and behavior in `public/assets/js/site.js`.

**Before launch:** Set `SITE_URL=https://your-verified-domain.com` as a Netlify environment variable to populate accurate canonicals, XML sitemap, OG URLs, and schema. If not set, the default `https://example.com` keeps the site unindexable to avoid indexing incorrect canonicals. Never publish with the default SITE_URL. Set `NOINDEX=true` for staging or use Netlify branch/deploy-preview contexts. Deployment previews automatically receive noindex directives and a restrictive robots.txt.

**Contact:** The form uses built-in Netlify Forms with spam honeypot. Netlify must be hosting the site and form detection enabled. Test a live submission from `/contact/` and configure notification recipients in Netlify. There is no invented email or phone number on the site.

## Media replacement map

Place these final exports in `public/assets/videos/`:

- `home-hero.mp4` — ambient homepage/launch hero; autoplay muted playsinline loop; no audio dependent content.
- `about-ambient.mp4` — About atmospheric ambient loop.
- `video-ambient.mp4`, `web-ambient.mp4`, `branding-ambient.mp4` — service detail ambient loops.
- `featured-film.mp4` — finished featured film, user-initiated playback on Home and About.
- `project-human-story.mp4` — optional project film.

The design works even before those files exist: video containers reveal still images and the featured player shows a graceful notice if requested before the video has been uploaded. You can add a WebM `<source>` later. Use H.264/MP4 and a poster matched to each clip for mobile/performance.

Existing supplied logo collage: `public/assets/images/ngd-original-collage.png` (used as hero poster and featured-media placeholder). Rebuilt vector concept: `public/assets/icons/logo.svg` and `mark.svg`. Illustrative art SVGs are swappable, and OG cover is at `public/assets/images/og-cover.svg`. Original logo is not claimed to be an exact vector extraction.

## Future ServiceUp integration

- Use the ServiceUp shared API tenant `ngd-media` at **build time only**. API URL and secret can be Netlify environment variables; do not expose credentials in `public/` or client JavaScript.
- Implement a `src/serviceup-adapter.mjs` that fetches and normalizes published ServiceUp content into the field structures in `data/site.mjs`. Update `src/build.mjs` to import the adapter's normalized pages, projects, services.
- Create/publish/edit/unpublish/delete events should trigger the tenant-specific Netlify build hook in ServiceUp's `SERVICEUP_SITE_BUILD_HOOKS` configuration. The Netlify build then re-renders all HTML, sitemap, canonical tags, and structured data atomically.
- Set `BASE_PATH=/preview-folder` if serving a preview inside a subfolder; build-time rendering prefixes links, media, form actions, and canonicals. Keep it unset on the final domain root. When using a subfolder, serve `dist/` beneath that prefix (do not relocate individual files independently).
- Dates are structured for future deterministic newest-first sorting. The seeded concept portfolio is currently shown in its intentional display order.

## SEO, UX, QA

Semantic landmarks, one H1/page, structured Open Graph/Twitter cards, canonical URLs, schema.org Organization + WebPage, XML sitemap, robots, 404, responsive menu with keyboard support, submenu support, focus states, reduced-motion preferences, optimized motion fallback, Netlify HTTP security headers, CSS-based section transitions, and accessible form labels are included.

**Before production:** Verify legal policy text with the business owner, actual contact information and hosting privacy practices, remove or replace concept items with verified credits, update site domain, supply video exports and real images, confirm Google Search Console indexing, test form email notifications, and run Lighthouse/axe on the deployed URL. The supplied visual poster is intentionally not a web-optimized final export; create compressed WebP/AVIF posters before traffic launch.

## Standalone launch-page update
- Visit `/launch/` for the one-page launch version. Its header and footer link only to anchors on that page. The on-page form is `ngd-launch-inquiries` (Netlify Forms); configure and test notifications and submissions on Netlify.
- Desktop hero: `public/assets/videos/launch-hero-desktop.mp4`; vertical hero: `public/assets/videos/launch-hero-mobile.mp4`. The active file changes on portrait / landscape changes and 767px responsive breakpoint. No hero MP4s are included yet.
- Sizzle reel: `public/assets/videos/launch-sizzle.mp4`, user-initiated playback only; the button will show a fallback message until the file is added.
- To launch the standalone page at the main domain, change the build mapping in `src/build.mjs` once you are ready, and make the launch homepage canonical to `/`. The full site remains available separately for now.


## V3 launch hero changes
- Header removed on `/launch/`; brand logo is a decorative hero mark alongside the right-aligned copy.
- Desktop and mobile keep independent video sources; the background is shaded more heavily behind copy.
- The mark shrinks, moves inward, and fades during scrolling; reduced-motion settings disable this animation.
- Hero uses requested Midwest positioning statement as marketing copy; independently verify the “leading experts” claim before publication.

## V5 launch refinement
- Desktop logo enlarged, and additional right-side copy padding provides a real gap without setting a width on `.launch-hero-copy`.
- Mobile hero logo is stacked above the copy. On all viewports, it scales toward center and reaches exactly zero opacity early in the scroll, while the text scales gently.
- `npm run preview` is supported as an alias for the existing local static preview server (port 4173). Run `npm run build` beforehand to refresh output.

## V6 launch hero refinement
- Launch hero copy begins at 83% scale and grows to 106% as the viewer scrolls. Desktop copy also shifts horizontally toward the center; mobile copy remains right aligned.
- Mobile hero logo translates downward while shrinking and fading to zero opacity; desktop logo retains its inward/upward motion.
- The “SCROLL ↓” cue is now a keyboard-accessible anchor to `#next-section` with native smooth scrolling (instant motion for reduced-motion visitors).
- Suggested hero export: desktop 1920×1080 (or 1600×900), 24/30fps H.264 MP4 2.5–5 Mbps, ~4–10 MB for 12–20s. Mobile 720×1280 or 1080×1920 H.264 1.5–3 Mbps, ~2–6 MB for 12–20s. No audio track needed for ambient hero. Keep poster WebP ideally <150 KB.
