# NSaaS Deploy Guide

## Branch Naming Convention

- `nsaas/nightly-YYYYMMDD-feature-name` — Feature branches
- `main` — Production branch
- `nightly/YYYYMMDD-experiment-name` — Experiments / spikes

## PR Template

```markdown
## What's New
- Bullet points of changes

## Checklist
- [ ] Vercel env vars configured
- [ ] Supabase schema migrated (if applicable)
- [ ] Stripe webhooks registered (if applicable)
- [ ] Rate limit service connected (if applicable)
- [ ] Auth redirects updated (if applicable)
```

## Vercel Env Vars Needed

| Variable | Source | Required For |
|----------|--------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project Settings | Auth, DB |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Project Settings | Auth, DB |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Project Settings | Server-side DB ops |
| `STRIPE_SECRET_KEY` | Stripe Dashboard | Billing |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard | Webhook verification |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard | Client-side Stripe |
| `TELEGRAM_BOT_TOKEN` | BotFather | Waitlist alerts |
| `TELEGRAM_CHAT_ID` | Telegram | Waitlist alerts |
| `UPSTASH_REDIS_REST_URL` | Upstash | Rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash | Rate limiting |

## Pre-Deploy Checklist

1. **Git**
   - [ ] Branch pushed to origin
   - [ ] PR created against `main`
   - [ ] CI passes (if configured)

2. **Database**
   - [ ] Schema changes applied via Supabase SQL Editor
   - [ ] RLS policies verified
   - [ ] Indexes created

3. **Stripe**
   - [ ] Webhook endpoint registered for production URL
   - [ ] Plans/products created in Stripe Dashboard
   - [ ] Customer portal settings configured

4. **Vercel**
   - [ ] Env vars set in project settings
   - [ ] Preview deployment tested
   - [ ] Production deployment triggered

5. **Post-Deploy**
   - [ ] Smoke test critical flows (auth, billing, waitlist)
   - [ ] Check Stripe webhook deliveries
   - [ ] Verify Supabase RLS policies

## Current PRs

| Branch | PR | Status |
|--------|-----|--------|
| `nsaas/nightly-20260423-stripe-billing` | [#2](https://github.com/CreditDefaultSwaps/nsaas/pull/2) | Open |
| `nsaas/nightly-20260424-onboarding-flow` | [#1](https://github.com/CreditDefaultSwaps/nsaas/pull/1) | Open |

## Supabase Project

- **URL:** https://supabase.com/dashboard/project/shxncijzcgzwjbppcxfa
- **Waitlist table:** Already created and verified
