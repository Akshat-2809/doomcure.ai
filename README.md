# Doomcure

Production site for **doomcure.com**: an antidote to doomscrolling.

```
doomcure/
├── design/project/   Approved design (Main.dc.html is the source of truth)
├── web/              Next.js 16 site (App Router, React 19, CSS Modules) → Vercel project #1
└── api/              Express + TypeScript waitlist API (Postgres via Drizzle) → Vercel project #2
```

Both apps deploy to **Vercel**, as two projects from the same repo. The database is Postgres from **Neon**, added through the Vercel Marketplace.

## Open items before launch

- **Founder photo.** `[Founder photo]` is a visible placeholder in `web/src/components/Founder.tsx` (search for `TODO`). Add the image (e.g. `web/public/thenn.jpg`) and swap the `TA` initials for `next/image`.
- **Privacy and Terms.** `/privacy` and `/terms` are placeholders marked `[DRAFT — to be written]`. These are required before collecting emails at scale.
- **CTA headline.** The design says "Make your scroll doomproof." (from when the brand was Doomproof). It was kept word for word; change it in `web/src/components/Waitlist.tsx` if you want different wording.
- **Brand sheet.** `Brand.dc.html` wasn't in the design export. The logo, favicon, apple icon and OG image are built from the logo SVG in `Main.dc.html`.

---

## Local setup

Requirements: Node 20+ and a Postgres database (a free Neon branch works, or local Postgres/Docker).

```bash
# 1. API
cd api
cp .env.example .env          # fill DATABASE_URL and IP_HASH_SECRET (openssl rand -hex 32)
npm install
npm run db:migrate            # creates the tables
npm run dev                   # http://localhost:4000

# 2. Web (new terminal)
cd web
cp .env.example .env.local    # NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev                   # http://localhost:3000
```

Without `RESEND_API_KEY` the API still works and logs `skipping waitlist emails`.

### Scripts (both apps)

| Script | web | api |
| --- | --- | --- |
| `npm run dev` | Next dev server (Turbopack) | `tsx watch` on `src/local.ts` |
| `npm run build` | `next build` | `tsc` → `dist/` |
| `npm run lint` | ESLint (next config) | ESLint (typescript-eslint) |
| `npm run typecheck` | `tsc --noEmit` | `tsc --noEmit` |
| | | `db:generate` (new migration from schema), `db:migrate`, `db:studio` |

---

## API

| Method | Path | Notes |
| --- | --- | --- |
| `POST` | `/v1/waitlist` | Body `{ email, source: "hero" \| "cta", website }`. `201 {status:"joined"}` · duplicate → `200 {status:"already_joined"}` · honeypot filled → `200`, nothing stored · invalid → `400` · over limit → `429` + `Retry-After` |
| `GET` | `/v1/waitlist/count` | `{ count }`, cached 60s (in memory and at the CDN). For the founder; not shown on the site. |
| `GET` | `/health` | `{ status: "ok" }` |

- Emails are trimmed and lowercased before validation (zod).
- Rate limit: 10 requests per IP per hour (`RATE_LIMIT_PER_HOUR`). The counter lives in Postgres (`rate_limits` table), so the limit holds across serverless instances.
- Privacy: only `ip_hash` (HMAC-SHA256 with `IP_HASH_SECRET`) is stored. The raw IP never is.
- Emails go through Resend after the response is sent (`waitUntil`). A welcome email ("You're on the list. More on this soon.") goes to the signup and a notification to `NOTIFY_EMAIL`. If an email fails, it's logged and the signup still succeeds.
- Also: helmet, pino logs (emails redacted), centralised errors, and no stack traces in production.
- CORS allows `https://doomcure.com`, `https://www.doomcure.com`, anything in `ALLOWED_ORIGINS` (supports `*`, e.g. `https://doomcure-*.vercel.app`), and localhost outside production.

Schema (`api/src/db/schema.ts`, migration in `api/drizzle/`): `waitlist_signups(id, email unique, source, created_at, ip_hash, user_agent)` and `rate_limits(key, window_start, count)`.

---

## Deploy

### 1. Database (Neon on Vercel)

1. Vercel dashboard → **Storage** → **Create** → **Neon (Postgres)**. Create it and connect it to the **api** project (step 2). This injects `DATABASE_URL` and `DATABASE_URL_UNPOOLED`.
2. Run the migration once from your machine:
   ```bash
   cd api
   DATABASE_URL="<the DATABASE_URL_UNPOOLED value>" npm run db:migrate
   ```
   Re-run it whenever a new migration file appears in `api/drizzle/`.

### 2. API → Vercel (project "doomcure-api")

1. **Add New → Project** and import the repo.
2. **Root Directory: `api`**. Vercel detects Express, and `src/app.ts` (default export) becomes the function. No `vercel.json` is needed.
3. Environment variables (Production, and Preview if you use it):

   | Name | Value |
   | --- | --- |
   | `DATABASE_URL` | from Neon (pooled), set automatically when connected |
   | `IP_HASH_SECRET` | `openssl rand -hex 32` |
   | `RESEND_API_KEY` | from resend.com (verify the `doomcure.com` domain in Resend first) |
   | `EMAIL_FROM` | `Doomcure <hello@doomcure.com>` |
   | `NOTIFY_EMAIL` | where signup notifications go |
   | `ALLOWED_ORIGINS` | `https://doomcure-*.vercel.app` (preview URLs of the web project) |
   | `NODE_ENV` | `production` (Vercel sets this) |

4. Deploy, then check `https://<api-project>.vercel.app/health`.
5. **Settings → Domains** → add `api.doomcure.com`.

### 3. Web → Vercel (project "doomcure")

1. **Add New → Project** and import the same repo again.
2. **Root Directory: `web`** (framework: Next.js, detected).
3. Environment variables:

   | Name | Value |
   | --- | --- |
   | `NEXT_PUBLIC_API_URL` | `https://api.doomcure.com` (or the API's `*.vercel.app` URL until DNS is live) |
   | `NEXT_PUBLIC_SITE_URL` | `https://doomcure.com` |

   `NEXT_PUBLIC_*` values are baked in at build time. Redeploy after changing them.
4. **Settings → Domains** → add `doomcure.com` and `www.doomcure.com` (Vercel suggests redirecting one to the other; keep `doomcure.com` as the main one).

### 4. Connect doomcure.com from GoDaddy

In GoDaddy → **My Products → doomcure.com → DNS → Manage DNS**:

1. Delete GoDaddy's default **A @** (Parked) record and any **CNAME www** that points to GoDaddy.
2. Add exactly the records that **Vercel shows** under each project's **Settings → Domains**. They are usually:

   | Type | Name | Value | For |
   | --- | --- | --- | --- |
   | A | `@` | the IP Vercel shows (commonly `76.76.21.21`) | web (apex) |
   | CNAME | `www` | the target Vercel shows (e.g. `cname.vercel-dns.com` or a project-specific `*.vercel-dns-0xx.com`) | web (www) |
   | CNAME | `api` | the target Vercel shows on the **api** project | API |

   Always copy the values from the Vercel dashboard; they can differ per project.
3. Wait for the domains to show **Valid Configuration** in Vercel (minutes, sometimes up to an hour). Vercel issues the SSL certificates automatically.
4. If you add Resend, also add the SPF/DKIM records Resend shows for `doomcure.com` in the same GoDaddy DNS screen.

### 5. Optional: dopaminedetox.ai → doomcure.com (301)

If you buy that domain, the simplest way is in Vercel: on the **web** project, **Settings → Domains → Add** `dopaminedetox.ai` (and `www.dopaminedetox.ai`), choose **Redirect to** `doomcure.com` with **301 (Permanent)**, then point that domain's DNS at Vercel with the records it shows. (GoDaddy's own "Forwarding → 301" also works, but it doesn't keep paths and is slower.)

---

## Notes on the build

- **Faithful port.** Every section, line of copy, animation and interaction from `design/project/Main.dc.html` is kept. The brand is renamed Doomproof → Doomcure (wordmarks, sticker, DOOM/CURE label, slider label, founder chapter, footer, email `hello@doomcure.com`).
- **Client JS only where needed.** Client components: phone slider, waitlist forms, scroll meter (value + ruler + pill share one tiny store), card deck, story arrows, and a small `Offscreen` wrapper. Its IntersectionObserver pauses the marquee, phone feeds and grain while they're off-screen. Everything else is a Server Component.
- **Fonts.** `next/font/google` (self-hosted, metric-matched fallbacks, no layout shift), exposed as `--disp`, `--body`, `--mono`.
- **SEO.** Metadata, `opengraph-image`/`twitter-image` (generated at build with `next/og`), `icon.svg`, `apple-icon`, `sitemap.xml`, `robots.txt`, Organization JSON-LD, and a branded 404.
