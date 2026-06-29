# Elevate — Retreat Directory (Portfolio Showcase)

A mobile-first, installable PWA built for a private leadership retreat: a **member
directory**, a personalised **schedule**, a stylised property **map**, and an LLM
**concierge** that knows the room and suggests who to meet.

> **This is a sanitized public showcase.** Every attendee, company, and location in
> this version is **fictional** — the people are named after characters from classic
> literature, and the venue and map labels are invented — so that nothing about the
> real Elevate community or the retreat location is disclosed. The Elevate brand is
> used with permission for the purposes of this case study.

- **Stack:** React + Vite (installable PWA) · Cloudflare Worker with static assets (auth, gated content, Claude proxy)
- **Demo access:** the live build opens straight into a populated demo as a sample
  attendee — no code required. (The production app instead gates each attendee behind
  a personal `?c=` link; see *Auth* below.)

## What it demonstrates

- A polished, opinionated mobile UI recreated faithfully from a design handoff.
- A privacy-conscious architecture: **no member data ships in the client bundle** — in
  production it is served only from a token-gated API.
- Stateless HMAC auth (personal links → signed session tokens), no database.
- An LLM concierge (Claude) with prompt caching and structured output, grounded
  strictly in the supplied attendee/schedule data.

## Develop

```bash
npm install
npm run dev            # Vite UI on :5173 — uses content/ fixtures directly (no backend needed)
npm run worker:dev     # (optional) full-stack Worker locally (serves dist + /api)
npm run typecheck      # app
npm run typecheck:functions
```

- In dev the UI loads `content/*.json` directly (member data is **tree-shaken out of the
  production bundle** — prod serves it only via the token-gated `/api/content`).
- Dev viewer defaults to `elizabeth-bennet`. Switch in the browser console:
  `__store.setState({ viewer: 'sherlock-holmes' })`.

## Architecture

```
Cloudflare Worker + static assets (static React PWA — no member data in the JS bundle)
  POST /api/auth      validate a personal code (HMAC) OR open a demo session -> signed token
  GET  /api/content   members + schedule + groups + locations  (requires token; NO private notes)
  POST /api/assistant Claude proxy (claude-opus-4-8, prompt caching, structured output)
```

**Auth.** Personal links are `…/?c=<memberId>.<sig>` where `sig = HMAC(memberId, SERVER_SECRET)`
— stateless, no DB. In this showcase, hitting the site with no code mints a **demo session**
for a default attendee so anyone with the link can explore. Private "advice" notes live only
server-side and are used solely to build the concierge prompt — they are never sent to the client.

## Content model

All event content lives in `content/` and is the only thing that changes per event:

- `members.json` — attendees (name, company, bio, expertise, contact links)
- `member-notes.private.json` — server-only advice notes that inform the concierge
- `sessions.json` / `groups.json` — schedule and Forum/dinner/workshop groupings
- `locations.json` — map pins (labels + x/y coordinates)
- `event.json` — title, dates, day labels, venue

Photos/logos are optional: drop images into `public/photos/<id>.jpg` and
`public/logos/<id>.svg` and reference them in `members.json`; missing images fall back to
initials / company-initial tiles automatically.

## Deploy

Deployed as a Cloudflare **Worker with static assets**. By default it publishes to a
`*.workers.dev` hostname; to pin a custom demo subdomain, set a `[[routes]]` entry in
`wrangler.toml` and redeploy.

```bash
npm run deploy        # = vite build + wrangler deploy
```

Secrets (set once on the Worker; take effect immediately, no redeploy needed):

```bash
printf '%s' "$(openssl rand -hex 32)" | npx wrangler secret put SERVER_SECRET
printf '%s' "sk-ant-…"               | npx wrangler secret put ANTHROPIC_API_KEY
```

- `SERVER_SECRET` is required (it signs demo/session tokens).
- Without `ANTHROPIC_API_KEY` the concierge degrades gracefully (the other three features work).
