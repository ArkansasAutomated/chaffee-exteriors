# Chaffee Exteriors
A responsive, aviation-inspired Next.js website preview. Custom vector artwork; no stock people, fabricated reviews, or claims of veteran ownership.

## Run
Node 22+.

```sh
npm install
npm run dev
npm test
npm run build
npm start
```

## Edit
- `lib/site.config.ts`: phone, legal business name, city registration, service areas, eligibility flags, booking URL. `LICENSED`, `INSURED`, and `WASH_RECLAIM` default false. Rebuild after changes.
- `lib/pricing.json`: draft rates, story and home-size buckets. Cleaning/house/roof arrays are story rows and size columns. Guards use per-foot rates. Estimator applies ±10%, minimums, and the $1,999 upper-range guard. Larger ranges have no numeric output.
- `content/pages.ts`: editable page copy, included services, and FAQs. Plain TypeScript content data is used in this version instead of MDX.
- `app/page.tsx`: homepage editorial sections and displayed draft starting rates; update these alongside pricing until all published prices are approved.
- `app/globals.css`: visual tokens, responsive layouts, controls.
- `public/flightline.svg`: original aircraft illustration, not a photograph or evidence of work.

## Built
Nine core routes, three noindex campaign routes, privacy and SMS pages, shared estimator, request form, server validation and server-side price recalculation, honeypot, configurable Turnstile, webhook delivery, FAQ/service/breadcrumb structured data, sitemap, robots, and llms.txt. Installation returns 404 while disabled. No phone number is fabricated.

## Before launch — not a completed production integration
Confirm all draft rates and membership terms, legal entity, phone, city registration number, insurance, operating hours, crews, and service availability. Fill `lib/site.config.ts`. Verify legal requirements independently; this build implements the PRD's restrictive pricing gate, not a legal determination.

Copy `.env.example` to `.env.local`. Configure Turnstile and an authenticated HTTPS webhook that **durably stores** each lead before returning 2xx. The app deliberately returns 503 without both credentials, and never claims a lead was delivered in preview. Set `NEXT_PUBLIC_LEADS_ENABLED=true` only after end-to-end testing. Do not log customer details.

CRM workflow must deliver owner alerts and requested customer SMS confirmations, honor consent/STOP/HELP, and schedule the 1-hour/24-hour follow-ups. SMS, email, durable lead storage, and retry/outbox infrastructure are not implemented by this site. The form collects no email address, so email confirmation requires a revised data-collection flow. Webhook failures return a visible error; network ambiguity can require operator reconciliation.

Booking is a date request, not a confirmed calendar reservation. `components/Booking.tsx` supports a hosted scheduler URL but a configured provider and required address/phone capture need real integration testing. No payments or membership enrollment occur.

GA4, advertising pixels, CAPI, Google Ads, address autocomplete, real reviews, work photos, gutter video, and tracking-number insertion are intentionally not live without credentials and approved data. UTM source is held in session storage; a consent-aware cookie/analytics implementation remains a launch task. Unknown hours/phone/geolocation are not fabricated in structured data. Hero is an original SVG; no video assets have been supplied. Core fonts use the native Arial stack, avoiding external requests. Meta images can be added once approved branding is exported.

Campaign routes use `noindex` and remain crawlable so crawlers can read it, rather than simultaneously blocking them in robots. Their headers/footers have no site-navigation links; required consent-policy links remain in forms.

## Deployment
Use Vercel's Next.js preset, project root this directory. Add production environment values, run the test/build, then connect chaffeeexteriors.com and configure www to redirect to apex. No deployment or DNS change was made by this build.

## Verification
`npm test` exhaustively checks all service/story/size combinations and the licensing price gate. `npm run build` typechecks and prerenders routes. Live webhook/SMS/calendar/analytics tests and externally measured Lighthouse/Rich Results acceptance require configured services and a production URL. Do not claim those passed based on a local build.

### Verified in this build (September 28, 2026)
- Production build and TypeScript checks pass.
- Pricing self-check passes for all 60 service/story/size combinations, plus custom-quote and enabled-flag boundaries.
- `node tests/smoke.mjs` passes: 14 routes (12 requested plus two policies), canonical tags, one H1 per route, campaign noindex, installation 404, API validation, and fail-closed unconfigured delivery.
- Browser DOM checks: all 12 requested routes at 360, 768, and 1280 CSS pixels have no horizontal overflow.
- Browser interaction: guards at one story and the second size bucket show “Custom quote needed”; request form opens.
- Browser visual review of homepage desktop/mobile; no captured browser errors.
- Lighthouse scores, real rich-result eligibility, actual CRM delivery, and live analytics are not verified.

The requested DeepSeek V4.1 Flash subagents were attempted but the provider returned HTTP 400 for that model. Implementation and final review continued on the root model.
