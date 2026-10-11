# Design — Bodywise-inspired storefront (distinct)

Reference: https://bebodywise.com/ — keep elements, not clone.

## Tokens
- BG #FFFFFF, surface #F7F5F0, ink #111111, muted #6B7280, line #ECE8DE.
- Brand green #0E3B2E (headers/buttons), accent peach #FFE9D6 + mint #E7F5EC for wellness (not medical).
- Sale red #D33 for % off, star #F59E0B.
- Fonts: Headings `Plus Jakarta Sans 800` (Bodywise uses bold grotesk), Body 400/600. Base 14px, H1 32-40, card 14 bold.
- Radius: 20px cards, 99px pills/buttons. Shadow soft: 0 10px 30px rgba(0,0,0,.06).

## Layout (Bodywise-like)
- Top bar: logo left (Mosaic Loop), center nav (Shop by concern, Build kit, Honest Reports), right search/profile/cart icons.
- Hero: full-width rounded banner, headline + CTA, dots 1/7 style.
- Category tiles: 6 image cards (Hair, Body, Nutrition, Offers, Sun, Face) → map to check-in concerns.
- Best-seller cards: image, concern tag, name, pcs, price + MRP strike + % off, rating ★, ADD button, 3 options.
- Reviews: Happy customers carousel, verified badge, Learn More.
- Wellness widget (our hero, styled like routine card): emoji check-in chips, DNA dots ●●●○○, Save → calendar.
- Footer: payment icons, links, app badges.

## Rules
- Never copy images/text verbatim; use own copy + placeholders. No medical scores, dots only.
