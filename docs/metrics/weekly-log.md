# Weekly Log - Week of April 20-26, 2026

## What Shipped
- SEO foundation: dynamic sitemap.ts + robots.ts, FAQPage + Course + Breadcrumb JSON-LD, favicon, dynamic OG image, metadataBase.
- New pages: /privacy, /terms. Footer fixed to point at them.
- Analytics: GA4 wired in root layout, Vercel Analytics added, purpose-built event wrapper in `src/lib/analytics.ts`.
- Funnel instrumentation: `lead_submit`, `begin_checkout`, `book_audit_click` (tagged per CTA location), `purchase` (server-side via Measurement Protocol).
- Next week: 5 pillar pages — /how-it-works, /for-independent-agencies, /resources/ai-renewal-automation-playbook, /resources/instant-lead-response-under-60-seconds, /resources/ams-ai-integration-guide.
- Ongoing: weekly content engine with three triggers (GitHub Actions primary, Vercel Cron backup, Claude Code /loop on-demand).

## Post-deploy verification checklist
- [ ] Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` + `GA_API_SECRET` in Vercel production env
- [ ] Set `ANTHROPIC_API_KEY`, `TAVILY_API_KEY`, `GH_PAT` for content engine
- [ ] Submit https://renewalengineai.com/sitemap.xml to Google Search Console
- [ ] Submit to Bing Webmaster Tools
- [ ] Validate FAQ + Course + Article schemas: https://search.google.com/test/rich-results
- [ ] LinkedIn Post Inspector on /, /courses, each /resources post
- [ ] Lighthouse: /, /courses, /mastermind, /resources — target LCP < 2.5s
- [ ] Fire test events in GA4 DebugView (chrome extension) — verify lead_submit, begin_checkout, purchase
- [ ] Run `gh workflow run weekly-content.yml` once manually to confirm the engine

---

# Weekly Log - Week of March 17-23, 2026

## What Shipped Today
- Initial website structure (homepage, consulting, courses, AI retention course pages)
- Stripe checkout integration for three productized offers (Audit, Sprint, Managed Ops)
- Lead magnet: "5 AI Automations Every Insurance Agent Should Set Up This Week"

## Deals Moved Forward
- None yet (pre-launch phase)

## Content Published
- Lead magnet document in content/lead-magnet/5-ai-automations.md
- Website pages built based on MEMORY.md specifications

## Customer Conversations Had
- None yet (pre-launch phase)

## Next Week's Priorities
1. Await feedback on PR #8 (website structure)
2. Begin outbound sequence development for consulting leads
3. Create course outline for AI Agent Retention flagship course
4. Set up basic analytics tracking