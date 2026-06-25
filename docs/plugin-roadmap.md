# Local Agent Wizard Plugin Roadmap

## Recommended order

1. **Supabase**
   - Use Postgres for leads, comments, wizard runs, diagnostics, orders and entitlements.
   - Use Edge Functions for writes so the public site does not expose privileged keys.
   - Keep localStorage fallback for the static version.

2. **Resend**
   - Send newsletter confirmations, diagnostic booking confirmations and template delivery links.
   - Trigger from Supabase Edge Functions after a validated lead/order event.

3. **PostHog or Vercel Analytics**
   - Track page view, wizard completion, config export, diagnostic matched, lead submit and purchase click.
   - PostHog is better for product funnels. Vercel Analytics is simpler for traffic.

4. **Stripe or Lemon Squeezy**
   - Start with hosted payment links for template packs and consulting deposits.
   - Add webhooks after the offer is validated.
   - Write paid orders into `orders`, then grant `template_entitlements`.

5. **Giscus**
   - Good temporary discussion layer for guides.
   - If comment moderation and user support become important, migrate to the `comments` table.

6. **Cloudflare Turnstile**
   - Add before opening public comment and diagnostic submission endpoints.
   - Verify token in Edge Functions, not in the browser.

7. **Pagefind or Algolia**
   - Add once guide count grows.
   - Pagefind is enough for a static content site. Algolia is better for richer search analytics.

## MVP data events

| Event | Source | Destination |
| --- | --- | --- |
| `page_view` | all pages | PostHog/Vercel Analytics |
| `wizard_start` | local-agent-wizard.html | PostHog + optional `events` |
| `wizard_complete` | local-agent-wizard.html | `wizard_runs` |
| `config_export` | local-agent-wizard.html | PostHog |
| `diagnose_run` | diagnose.html | `diagnostics` |
| `lead_submit` | newsletter/templates/pricing | `leads` + Resend |
| `comment_create` | comments.js | `comments` |
| `purchase_click` | templates/pricing | PostHog |
| `order_paid` | Stripe/Lemon webhook | `orders` + `template_entitlements` |

## Implementation notes

- Never expose Supabase service role keys in static HTML or client JavaScript.
- Keep personally identifiable data opt-in. Anonymous wizard analytics should not store file paths, API keys, raw prompts or full error logs.
- Comments should be `pending` by default and shown only after moderation.
- Paid template download URLs should expire or require authenticated entitlement checks.
- Email unsubscribe and consent timestamps should be stored from day one.

## What to skip for now

- Full custom admin dashboard: use Supabase Table Editor until moderation volume exists.
- Complex account system: hosted Supabase Auth is enough after paid templates launch.
- Vector database: not needed unless the site adds searchable user documents or a large troubleshooting knowledge base.
- Custom ad server: static affiliate slots are enough for the current stage.
