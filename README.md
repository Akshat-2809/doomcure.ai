# Doomcure — doomcure.com

> **The forms deliver nothing.** The waitlist forms and the contact form are front end only. They validate in the browser and show their success message, but nothing is sent, stored or emailed. Visitors who want to join the waitlist or get in touch must email `support@doomcureai.com`, so that address must be a real, monitored mailbox.

Production site for Doomcure, an antidote to doomscrolling. It's a faithful port of the approved homepage design.

Everything lives in one Next.js 16 app in [`web/`](web/). There is no database, no email sending and no API besides a health check.

```
doomcure/
├── design/project/              Approved design (Main.dc.html is the source of truth)
└── web/                         Next.js 16 (App Router, React 19, TypeScript), deployed to Vercel
    ├── assets/                  Latin subset of Dela Gothic One, used only to render the OG image
    └── src/
        ├── app/
        │   ├── page.tsx         homepage: assembles the sections, Organization JSON-LD
        │   ├── layout.tsx       fonts (next/font), metadata
        │   ├── globals.css      design tokens + shared classes
        │   ├── api/health/      GET { status: "ok" }
        │   ├── contact/         contact page (form + email/location cards)
        │   ├── privacy/ terms/  legal pages (shared layout: components/LegalDoc.tsx)
        │   ├── not-found.tsx    styled 404
        │   └── opengraph-image.tsx, twitter-image.tsx, icon.svg, apple-icon.tsx, sitemap.ts, robots.ts
        ├── components/          one component + CSS Module per section
        ├── assets/founder/      founder photo
        └── lib/
            ├── waitlist/ contact/  zod schemas the forms validate with
            ├── waitlistStore.ts shared client state for the two waitlist forms
            └── scrollMeter.ts   shared scroll-distance store (Problem meter + pill)
```

## Sections and what runs in the browser

Sections are Server Components and ship no JavaScript, except the interactive pieces marked "client" below.

| Section | Component | Client JS |
|---|---|---|
| Nav | `Nav` | none |
| Hero | `Hero` (server), with `PhoneSplit` (DOOM/CURE slider + auto-sweep) and `WaitlistForm` | client: `PhoneSplit`, `WaitlistForm` |
| Marquee | `Marquee` | `Offscreen` only (pauses the loop when off-screen) |
| Problem | `Problem` (server), with `MeterValue`/`MeterRuler` | client: meter |
| Idea | `Idea` (server), with `CardDeck` | client: `CardDeck` |
| Story | `Story` (server), with `StoryArrows` | client: `StoryArrows` |
| Founder, Footer | `Founder`, `Footer` | none |
| Waitlist | `Waitlist` (server), with `WaitlistForm` | client: `WaitlistForm` |
| Scroll pill | `ScrollMeterPill` | client |

`Offscreen` is a tiny IntersectionObserver wrapper. While its content is off-screen it sets `data-offscreen`, which pauses the marquee, the phone feeds and the grain.

## Placeholders still to replace

- **Legal review.** `/privacy` and `/terms` contain full drafts written for Indian law (IT Act 2000, SPDI Rules 2011, DPDP Act 2023 with the DPDP Rules 2025), modelled on squarebookai's. Have them reviewed by a lawyer before launch. Shared values (the "Last updated" date and the location) are in `web/src/lib/legal.ts`.
- **CTA headline.** It reads "Make your scroll doomproof." (from when the brand was Doomproof). It was kept word for word; change it in `web/src/components/Waitlist.tsx` if you want.
- **Brand sheet.** `Brand.dc.html` wasn't in the design export. The logo, favicon, apple icon and OG image are built from the logo SVG in `Main.dc.html`.

## Local setup

Requirements: Node 20.9 or later.

```bash
cd web
npm install
npm run dev                     # http://localhost:3000
```

No environment variables are needed. `.env.example` lists the one optional variable.

### Scripts (in `web/`)

| Script | What it does |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (`eslint-config-next`) |
| `npm run typecheck` | `next typegen` + `tsc --noEmit` |

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | no | Defaults to `https://doomcure.com`. Used for canonical URLs, sitemap and OG tags. |

## How the forms work

All three forms (the hero and CTA waitlist forms, and the `/contact` form) are front end only. Nothing is sent over the network.

- **Waitlist:** both forms call `joinWaitlist` in `src/lib/waitlistStore.ts`, which validates the email with the zod schema in `src/lib/waitlist/schema.ts`. If it's valid, both forms switch to "You're on the list" (the CTA plays the card burst). If not, an inline message appears. The browser's own `required`/`type="email"` check runs first.
- **Contact:** `ContactForm` validates with `src/lib/contact/schema.ts` (name, email, a message of 10 to 5,000 characters). Errors appear next to each field and keep what the person typed. On success, a confirmation panel with a tick replaces the form and receives focus.

## Deploy to Vercel

1. Push the repo to GitHub, GitLab or Bitbucket, then in Vercel choose **Add New → Project** and import it.
2. Set **Root Directory** to `web`. The framework preset (Next.js) and the build command are detected automatically.
3. Deploy. No environment variables are required. Preview deployments serve a `Disallow: /` robots.txt, so they stay out of search results.

## Connect doomcure.com (bought on GoDaddy)

### 1. Point the domain at Vercel
1. In Vercel: Project → **Settings → Domains** → add `doomcure.com`, then add `www.doomcure.com`. When asked, choose to **redirect `www` to the apex**. The canonical URLs, sitemap and OG tags all use `https://doomcure.com`.
2. Vercel then shows the exact DNS records to create. Use those values; they are typically:
   - apex `doomcure.com`: **A** record, host `@`, pointing to the IP Vercel shows (often `76.76.21.21`)
   - `www`: **CNAME** record, host `www`, pointing to the target Vercel shows (often `cname.vercel-dns.com`)
3. In GoDaddy: **My Products → doomcure.com → DNS → Manage DNS**.
   - Delete GoDaddy's default "Parked" **A** record for `@`, and any existing `www` CNAME, so they don't conflict.
   - Add the A and CNAME records exactly as Vercel shows them, with TTL 1 hour or lower.
4. Back in Vercel, wait for both domains to show **Valid Configuration**. HTTPS certificates are issued automatically.

### 2. Receive mail at @doomcureai.com
Since the forms deliver nothing, email is the only way visitors can reach you. To receive mail at support@doomcureai.com and thennarasan@doomcureai.com, set up a mailbox provider (Google Workspace, Zoho, etc.) for doomcureai.com and add its MX records for `@`. The site lives on doomcure.com, but all email addresses are on doomcureai.com.

### 3. Optional: dopaminedetox.ai → doomcure.com (301)
If you buy that domain, add `dopaminedetox.ai` (and `www.dopaminedetox.ai`) in the same Vercel project under **Settings → Domains**, choose **Redirect to `doomcure.com`** with **301 (Permanent)**, and point its DNS at Vercel with the records it shows. GoDaddy's own "Forwarding → 301" also works, but it doesn't keep paths.

## Fidelity notes (vs. the approved design, `Main.dc.html`)

Compared side by side in Chrome at 1440px and 390px:
- **Layout:** every section has the same top and height as in the design.
- **Pixel difference:** under 0.4% in every section except the CTA/footer, where the brand name changed.
- **Interactions:** all checked in the browser (slider auto-sweep and drag, scroll meter + pill, nav anchors under the sticky nav, card deck, story arrows, waitlist states).

Intentional differences:
- The brand is renamed Doomproof → Doomcure: wordmarks, sticker text, the DOOM/CURE label, the slider's aria-label and the footer. The first career card reads just "Founder & CEO", without the company name. The contact email is `support@doomcureai.com` everywhere, as a `mailto:` link. The founder card has Email (`thennarasan@doomcureai.com`) and LinkedIn buttons, as on squarebookai. Both also appear in the Organization JSON-LD.
- "Privacy · Terms" are links to the new pages, and a "Contact" link was added next to them. The footer's link rows sit above the giant wordmark (`z-index`), and the scroll pill ignores clicks (`pointer-events: none`). Without this, the wordmark's glyphs and the pill covered the legal links.
- Nav and footer links point to `/#section`, so they also work from the Privacy, Terms and Contact pages.
- The founder card shows the real photo in place of the `[Founder photo]` placeholder.
- **Story carousel:** it doesn't use CSS `scroll-behavior: smooth`. Together with scroll-snap, that made Chrome perform a smooth snap on load, which stopped LCP from ever being recorded (Lighthouse Performance: 0). The arrow buttons pass `behavior: "smooth"` themselves, so it looks the same.
- **Hero fade-ins:** they start at opacity .01 instead of 0. It looks identical, and Chrome can count the hero text as the LCP element.
- **Accessibility additions with no visual change:** a focus ring on the phone slider and the form pill and live regions for form status.

Kept as designed, worth a decision later:
- At 390px the nav wraps onto two lines.
- In the Story section, the tag and intro text are white on violet `#7B61FF` (contrast 4.2:1 and 3.5:1, below AA's 4.5:1).

## Lighthouse (mobile, local production build)

Performance 95–97, Accessibility 96, Best Practices 100, SEO 100. CLS is 0, LCP 2.6–2.9s (simulated slow 4G). The only accessibility warnings are the two Story-section contrast items above. Re-run Lighthouse against the Vercel URL after deploying.
