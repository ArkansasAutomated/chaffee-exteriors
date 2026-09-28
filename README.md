# Chaffee Exteriors
Next.js site for a local, owner-operated exterior-care business. Nine core pages, three paid-traffic pages, privacy/SMS terms, an estimator, and a lead API.

## Run and verify
Node 22+.

```sh
npm ci
npm run dev
npm test
node --experimental-strip-types tests/lead-delivery.test.ts
npm run build
npm start
# With a running local server and delivery credentials unset:
node tests/smoke.mjs
```

## Pricing and flags
Edit **`lib/pricing.json`**, the file imported by `lib/pricing.ts`. Its cleaning/house/roof arrays are story rows and home-size columns; guards use per-foot rates. The older `config/pricing.json` is retained but is not used by the application. Neither pricing file nor the cap calculation was modified in the launch polish.

Draft pricing approvals are an owner responsibility. The estimator applies its existing minimums and ±10% range. While `LICENSED=false`, an upper range above $1,999 becomes “Custom quote needed” with no numeric range. Do not split a project to evade the cap. Rebuild after editing prices. Static starting-price copy in `content/pages.ts` and `app/page.tsx` must also be checked when changing rates.

`lib/site.config.ts` controls phone display, telephone href, schema phone, email, service areas, hours, legal details, and flags. Change the three phone representations together. `LICENSED` controls the installation page and footer license details; `INSURED` enables the corresponding footer claim; `WASH_RECLAIM` is reserved and no reclaim claim is currently rendered. Only enable factual claims after documentation is available. Opening hours remain an empty placeholder; fill confirmed hours before launch.

## Lead delivery
Copy `.env.example` to `.env.local` and fill server secrets locally or in Vercel. Never commit secrets.

- `LEAD_WEBHOOK_URL`: authenticated HTTPS CRM endpoint. Must durably store a lead before acknowledging it. Optional `LEAD_WEBHOOK_SECRET` is sent as a bearer token.
- `RESEND_API_KEY`: enables an email notification to `site.EMAIL` for every accepted lead, regardless of webhook outcome. `RESEND_FROM` can override the sender in config; the sending domain must be verified in Resend.
- `TURNSTILE_SECRET_KEY` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: configure both. Public submissions fail closed if the server key is absent. Honeypot and server validation are also enabled.

Webhook and email delivery are attempted independently and awaited. At least one must confirm acceptance before the form reports success. If neither is configured, both fail, or spam protection is unavailable, the form provides the call-us fallback. This prevents false success; it cannot guarantee delivery during all network/provider failures. A channel failure with a successful alternate emits an ID-only server log for reconciliation. Email receipt means provider acceptance, not an inbox-delivery guarantee.

Notifications contain name, phone, address, service, stories, size bucket, server-calculated estimate, date, UTM, page URL, intent, and SMS consent. There is no customer email field. CRM/owner operations must handle customer follow-up, texts, STOP/HELP, and owner alerts. The site does not itself send customer SMS. Do not text users who withheld consent; call them instead. The visible success sentence was specified by the owner, so prompt follow-up must be operational before launch.

`call_click` and `email_click` events are pushed once per click into `window.dataLayer` and dispatched as browser events. GA4, Meta and Google Ads variables are listed in `.env.example`; third-party analytics remain disabled until a consent-aware integration is configured. Event dispatch does not imply remote analytics receipt.

## Content and media
Edit page text/FAQs in `content/pages.ts`; homepage sections in `app/page.tsx`. Contact information belongs only in `lib/site.config.ts`. `public/roofline.svg` is original illustrated artwork, not a job photo. Put `gutter-flow.mp4` and/or `gutter-flow.webm` in `public/`, each at most 2 MB, to enable the campaign video slot after rebuilding. Otherwise it displays the poster. Videos load near visibility, stay muted, loop inline, and respect reduced motion.

## SEO
Business schema omits a street address and unconfirmed opening hours. Service and breadcrumb data are included on appropriate pages. Sitemap excludes campaigns and policy pages. Campaign pages remain deliberately `noindex` and `/lp/` is disallowed in robots as requested. Therefore Lighthouse's indexability checks can prevent an SEO score of 100 on a campaign page; this is expected, not a reason to make advertising pages indexable.

## Vercel deployment
Import the private GitHub repository with the Next.js preset, root directory the repository root. Configure environment variables and verified Resend domain, deploy, then add chaffeeexteriors.com and redirect www to apex. Confirm contact/legal details, opening hours, price approval, real lead delivery, SMS operations, and appointment handling before directing paid traffic. No DNS or production deployment is performed by this repository push.

Live provider delivery requires real credentials and a controlled end-to-end test. Booking remains a date request until a scheduler is configured. No payment or automatic membership enrollment occurs.
