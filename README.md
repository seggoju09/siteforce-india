# SiteForce India — Phase 1 MVP

This is the India build of SiteForce, adapted from the UK product's Phase 1 MVP:
Next.js on the frontend, Supabase for the database. It is a **separate codebase
and a separate Supabase project** from SiteForce UK — same brand, same concept,
independent infrastructure.

## What's different from the UK version

- Currency is INR (₹), not GBP.
- Trades and cities are adapted for the Indian market (Mumbai, Delhi NCR,
  Bengaluru, Hyderabad, Pune, Chennai, Ahmedabad, Kolkata, Indore, Kochi), with
  vernacular trade names alongside English ones (e.g. "Mason (Mistri /
  Rajmistri)", "General Labourer (Mazdoor)").
- The UK's CSCS-card verification field is replaced with `id_verified`, framed
  around **e-Shram card / BOCW (Building and Other Construction Workers)
  registration** — the closest real Indian equivalents to a UK CSCS card. See
  the "SiteForce India — Launch Workflow" doc for why there's no single
  CSCS-equivalent scheme in India and how this was decided.
- Full Aadhaar numbers are intentionally **not** collected anywhere in this
  schema — see the legal/compliance notes in the workflow doc for why (Aadhaar
  Act Section 57 was struck down by the Supreme Court; private platforms
  mandating/storing Aadhaar numbers directly is legally risky).

## What's real here

- `/labourers` — a signup form that inserts a real row into a Supabase
  `labourers` table when submitted.
- `/companies` — a browse page that reads live from that same table. Publish a
  profile, then open this page: it's really there, not mocked.
- `supabase/schema.sql` — the actual database schema (labourers, companies,
  hire_requests tables) with row-level security policies.

## What's intentionally stubbed, and why

- **No login yet.** The database policies currently let anyone insert a
  labourer profile with no auth, so the demo works immediately. Before a real
  launch, add [Supabase Auth](https://supabase.com/docs/guides/auth) and
  tighten the RLS policies in `schema.sql`.
- **No payments.** A payment gateway integration (Razorpay/Cashfree/PayU are
  the common India options) for the "pay only when you hire" model isn't wired
  in yet.
- **No "shortlist and hire" UI yet** — the `hire_requests` table exists in the
  schema so it's ready to build against, but there's no page for it yet.
- **No Aadhaar/e-Shram/BOCW API integration yet** — the `id_verified` checkbox
  is currently self-declared by the worker, not verified against a government
  database. Real verification (e.g. via DigiLocker or a licensed KYC
  intermediary) is a post-MVP milestone, not something to build without legal
  sign-off first — see the compliance notes.

## Setup (takes about 10 minutes)

You'll need two free accounts that only you can create — a Supabase login and a
Vercel login are personal credentials, not something that can be set up on your
behalf.

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a NEW Supabase project** at [supabase.com](https://supabase.com)
   (free tier is enough to start) — a separate project from the UK SiteForce
   one. In the project's SQL editor, paste and run the contents of
   `supabase/schema.sql`.

3. **Copy your API keys.** In Supabase: Settings → API. Copy the Project URL
   and the `anon public` key.

4. **Set up your environment**
   ```bash
   cp .env.example .env.local
   ```
   Paste your Project URL and anon key into `.env.local`.

5. **Run it locally**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 — publish a test profile at `/labourers`, then
   check it shows up at `/companies`.

## Deploying it for real

The easiest path is [Vercel](https://vercel.com) (made by the Next.js team,
free tier is enough to start), as a **new, separate Vercel project** from the
UK site:

```bash
npm install -g vercel
vercel login          # your own account — this step is yours to do
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel --prod
```

**Important:** on first import, Vercel's Framework Preset sometimes defaults to
"Other" instead of "Next.js" for a fresh GitHub import, which builds
successfully but 404s the live site. If that happens: Project Settings → Build
and Deployment → set Framework Preset to "Next.js" → redeploy. (This exact
issue happened on the UK build and cost real time to diagnose — check it
first before debugging anything else.)

## Legal/regulatory formalities — read before real launch

Unlike the tech stack, the legal formalities for operating this as a real
business in India (company registration, GST, labour-law compliance, DPDP Act
data-protection obligations, etc.) are NOT something that can be automated or
filed by an AI assistant — they need a human founder, and in several places a
CA/company-secretary or labour-law counsel. See the full checklist and market
research in the **[SiteForce India — Launch Workflow](https://claude.ai/artifact/V2E9dNCEJ8iWnyndhaTKUf)**
doc for what's genuinely settled vs. what needs a lawyer's sign-off before you
rely on it.

## Live deployment

- Site: https://siteforce-india.vercel.app
- Database: Supabase project `siteforce-india` (South Asia / Mumbai), under
  the SiteForce org
- Verified end-to-end: a test profile was published through `/labourers` and
  confirmed live on `/companies`, then removed so the site starts clean.

## Next milestones, in order

1. Supabase Auth (worker + company accounts)
2. Payment gateway integration (Razorpay/Cashfree/PayU) for pay-on-hire
3. The shortlist/hire request flow using the `hire_requests` table
4. Real e-Shram/BOCW/DigiLocker-based verification (with legal sign-off first)
5. Company registration + GST + labour-law compliance (see workflow doc)
6. Point a registered domain at this deployment
