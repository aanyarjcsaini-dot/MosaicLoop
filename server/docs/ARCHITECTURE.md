# Architecture — MERN (brief-aligned)

## Services
- `client/` (Vite+React, Vercel): brand gate, check-in, DNA, calendar, shelf, restock modals, reviews, SKU check, buddy, family, rewards.
- `server/` (Express+Node, Render): `/api/auth, /checkins, /dna, /purchases, /restock, /reviews, /sku, /chat, /family, /habits, /rewards, /consults`.
- MongoDB Atlas `mosaic_loop`: users, households, checkins, dnaSnapshots, products, purchases, dayEvents, reviews, skuReports, chatTurns, habits, rewards/coupons, consults.

## Flows
- Gate brand → check-in POST → DNA derived → calendar event.
- Purchase → shelf + delivery/finish dates from official usage → cron restock prompt → RESTOCK/PASS + reason → review prompt (verified).
- SKU enter → report + reviews. Chat → signal keywords, refuse out-of-scope, severe → fixed-fee consult. Habit 30d → trial coupon → sample purchase → new loop.

## Env
Server: MONGO_URI, JWT_SECRET, CLIENT_URL, PORT. Client: VITE_API_URL. Secrets in `.env` only.
