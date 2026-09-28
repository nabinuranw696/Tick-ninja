# TikView — Tik.ninja-style public TikTok viewer

A small, production-oriented starter for a public TikTok viewer.

## What it does

- Accepts a public TikTok URL.
- Validates the hostname server-side.
- Calls TikTok's public oEmbed endpoint from the backend.
- Displays returned title, creator, thumbnail, and TikTok's supplied embed.
- Responsive mobile UI.
- Does not collect TikTok passwords or cookies.

## Run locally

Requirements: Node.js 18+.

```bash
npm install
npm start
```

Open:

```text
http://localhost:3000
```

Development:

```bash
npm run dev
```

## API

```text
GET /api/health
GET /api/oembed?url=<public TikTok URL>
```

## Important limitation

This starter intentionally does not scrape private accounts or bypass TikTok access controls.
A username-to-full-profile search requires an appropriate TikTok API/data-access arrangement.
Do not add credential/session-cookie collection.

## Production checklist

- Put the app behind HTTPS.
- Add rate limiting at your reverse proxy/API layer.
- Add request logging without storing sensitive user data.
- Add a clear privacy policy and terms.
- Add abuse reporting/contact information.
- Respect TikTok's current developer/platform terms and any applicable copyright/privacy rules.
- Cache public oEmbed responses briefly to reduce repeated requests.
