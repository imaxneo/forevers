# Launch Checklist

## 1) Environment & Secrets
- [ ] Set `NEXT_PUBLIC_BASE_URL` to production domain.
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL`.
- [ ] Set `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [ ] Set `SUPABASE_SERVICE_ROLE_KEY` (server only).
- [ ] Set `STRIPE_SECRET_KEY` (live mode).
- [ ] Set `STRIPE_WEBHOOK_SECRET` (live webhook).

## 2) Stripe Validation
- [ ] Create a real test reservation from `/book`.
- [ ] Verify checkout opens Stripe live checkout.
- [ ] Verify redirect to `/success?session_id=...`.
- [ ] Verify webhook stores row in `squares` table.
- [ ] Verify reserved star appears in `/stars` and `/reserve`.

## 3) Supabase & Data Safety
- [ ] Confirm `squares` table has unique constraint on `grid_position`.
- [ ] Confirm RLS policies for public read + controlled write.
- [ ] Confirm webhook upsert uses `onConflict: grid_position`.
- [ ] Verify no public endpoint can bypass payment to reserve.

## 4) UX Final QA
- [ ] Desktop QA: drag, zoom, select, reserve flow.
- [ ] Mobile QA: drag, controls, CTA visibility.
- [ ] Verify reserved stars are clearly visible.
- [ ] Verify no UI panel blocks important star-map details.
- [ ] Verify page performance on mid-range device.

## 5) Content & Branding
- [ ] Finalize Arabic/English copy consistency.
- [ ] Finalize CTA labels and success copy.
- [ ] Replace placeholders (links/images) if any.

## 6) SEO & Metadata
- [ ] Update `app/layout.tsx` metadata title/description.
- [ ] Add Open Graph image.
- [ ] Confirm favicon and social preview.

## 7) Post-Launch Monitoring
- [ ] Check Stripe dashboard for completed payments.
- [ ] Check Supabase logs for API/webhook errors.
- [ ] Track reservation conversion for first 48 hours.

## Ready to Ship
- [ ] Final smoke test on production URL.
- [ ] Publish.
