# Commerce integration — REQUIRED CONFIG (not operational until approved)

Target: official Be Bodywise checkout only. App never charges.

Supported paths (implement in order):
1. Manual order linking (LIVE): user pastes order ref → `POST /api/purchases/link` → status `linked-unverified`. Dedupe by `orderRef`.
2. Official API/webhook (NOT CONFIGURED): needs from platform owner —
   - `WEBHOOK_SECRET`, webhook URL `POST /api/purchases/webhook`
   - order payload contract: product/variant IDs, qty, orderRef, purchaseDate, payment status, delivery status
   - user matching (authenticated account link + consent), cancel/refund/failed handling
   - No scraping, no passwords. Validate payment before marking verified.

Until (2) is approved, UI must say “pending verification, not purchased” after restock click. Never show false success.
