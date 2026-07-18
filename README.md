# Diamond House Blessings LLC — Website

Safe, stable, supportive shared housing in Detroit. A hand-built static website
(HTML, CSS, vanilla JS). No build step, no framework.

Concept: **"A Place That Shines."** Warm-black cinematic canvas, one champagne-gold
accent, the diamond-in-house mark as the light of home. Content emerges from the
dark into light on scroll.

## Pages
- `index.html` — Home (long-scroll: hero, mission, who we welcome, what's included, rooms, how it works, important information, values, CTA)
- `about.html` — About us, values, mission
- `referrals.html` — Referral information for agencies, case managers, hospitals
- `faq.html` — Frequently asked questions
- `contact.html` — Contact details and the inquiry / waiting-list form
- `thank-you.html` — Post-submit confirmation page

## Structure
- `assets/css/site.css` — the design system (one file)
- `assets/js/site.js` — motion + the inquiry form handler
- `assets/img/` — `logo.svg`, `favicon.svg`
- `assets/photos/` — real property photos (private room, shared room, kitchen, common areas) go here
- GSAP + ScrollTrigger loaded from CDN for parallax on native scroll

## The inquiry / waiting-list form
The form on `contact.html` is built two ways so it works everywhere:
1. **Production (Netlify):** it carries `data-netlify`, a honeypot, and a hidden
   `form-name`. On Netlify it captures submissions and emails them, then redirects
   to `thank-you.html`. No code change needed.
2. **Preview (GitHub Pages / local):** `assets/js/site.js` detects a static host
   and composes a pre-filled email to `Info@diamondhouseblessings.com` so a real
   visitor can still reach the owner. Swap `FALLBACK_EMAIL` or wire Formspree /
   Pathworth Intelligence in that one place.

## Local preview
`python -m http.server 5710` from this folder, then open http://localhost:5710
Add `?static` to the URL to freeze animations.

## Notes
- Version-stamp: bump `?v=N` on the CSS/JS links if you edit those files.
- `body { overflow-x: clip }` (never `hidden`) keeps anchor scrolling working.
- Currently `noindex` + `robots.txt: Disallow` while private. See `AGENTS.md` to go public.

Designed & built by Pathworth Consulting & Solutions — https://www.pathworthcs.com
