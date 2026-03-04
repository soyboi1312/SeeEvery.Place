# Security Review: SeeEvery.Place

**Date:** 2026-03-04
**Scope:** Full codebase review — 48 API routes, middleware, authentication, database schema (55 migrations), RLS policies, security headers, client-side code

## Overall Assessment

The codebase demonstrates **solid security practices**. Authentication is consistently applied, admin routes are well-protected, the service role key is guarded with `server-only`, and error handling avoids leaking internals. No SQL injection, no hardcoded secrets, and comprehensive security headers.

However, several issues were identified across database RLS policies, rate limiting, and input validation.

---

## CRITICAL

### 1. `newsletter_send_logs` has an overly permissive RLS policy

- **File:** `supabase/migrations/20241210_newsletter_feature.sql:145-147`
- **Issue:** `FOR ALL WITH CHECK (true)` allows any user to read, insert, update, and delete send log records — exposing subscriber emails, Resend IDs, and send statuses. Unlike similar issues in `admin_logs` and `notifications` (fixed in later migrations), this was **never patched**.
- **Fix:** Drop this policy. The service role bypasses RLS, so no explicit policy is needed.

```sql
DROP POLICY IF EXISTS "Service role can manage send logs" ON public.newsletter_send_logs;
```

---

## HIGH

### 2. `user_achievements` INSERT policy allows achievement spoofing

- **File:** `supabase/schema.sql:40-42`
- **Issue:** Any authenticated user can insert arbitrary achievement records for themselves directly via the Supabase client API, bypassing server-side validation.
- **Fix:** Remove the INSERT policy. Achievements should only be created by SECURITY DEFINER functions or the service_role client.

### 3. `user_challenges` INSERT/UPDATE policies allow challenge manipulation

- **File:** `supabase/migrations/20241216_visits_challenges_streaks.sql:228-235`
- **Issue:** Users can insert completed challenge records or update `current_count`/`completed_at` to fake completions.
- **Fix:** Remove direct INSERT/UPDATE policies. Let `check_challenge_progress()` handle mutations.

### 4. `user_streaks` and `user_activity` direct write policies

- **File:** `supabase/migrations/20241216_visits_challenges_streaks.sql:269-281, 317-326`
- **Issue:** Users can manipulate login streaks and activity records directly.
- **Fix:** Remove direct INSERT/UPDATE policies. Only allow mutations through SECURITY DEFINER functions.

### 5. No rate limiting on most API endpoints

- **Issue:** Only `/api/suggestions` (3/hour) is rate-limited. All other endpoints — including newsletter subscribe, follow/unfollow, feed POST, user search, and username check — have no rate limiting.
- **Fix:** Configure Cloudflare Rate Limiting rules (recommended), or add application-level rate limiting for high-risk endpoints.

---

## MEDIUM

### 6. PostgREST filter injection in admin newsletter subscriber search

- **File:** `src/app/api/admin/newsletter/subscribers/route.ts:73`
- **Issue:** `search` parameter is interpolated directly into a PostgREST filter string. Special characters could manipulate filter logic.
- **Fix:** Use separate `.ilike()` calls or sanitize PostgREST special characters.

### 7. Service role key reused as HMAC secret for impersonation JWT

- **File:** `src/app/api/admin/users/impersonate/route.ts:7-10`
- **Issue:** Conflates two security domains: the service role key as a bearer token AND as an HMAC signing secret.
- **Fix:** Use a dedicated `IMPERSONATION_JWT_SECRET` environment variable.

### 8. CSP uses `unsafe-inline` and `unsafe-eval`

- **File:** `next.config.mjs:280`
- **Issue:** Significantly weakens XSS protection. Required by Next.js + React Compiler.
- **Fix:** Consider CSP nonces (Next.js 13+ supports them). If React Compiler isn't essential, removing it allows dropping `unsafe-eval`.

### 9. `search_users` function vulnerable to LIKE wildcard injection

- **File:** `supabase/migrations/20250107_comprehensive_function_search_paths.sql:267-269`
- **Issue:** Users can craft patterns like `___` to find all 3-character usernames.
- **Fix:** Escape `%` and `_` in input before `ILIKE` comparison.

### 10. `get_user_status` SECURITY DEFINER function has no authorization check

- **File:** `supabase/migrations/20241211_user_management.sql:91-110`
- **Issue:** Any authenticated user can check if any other user is suspended.
- **Fix:** Add `auth.uid() = user_id OR is_admin()` check.

---

## LOW

| # | Issue | Location |
|---|-------|----------|
| 11 | Unbounded pagination in admin newsletter routes | `admin/newsletter/route.ts:60-61` |
| 12 | Profile `bio`/`full_name` have no length limits | `src/app/api/profile/route.ts:93-94` |
| 13 | Admin-created banners lack XSS sanitization | `src/app/api/admin/banners/route.ts:109, 159` |
| 14 | Raw Supabase error exposed in collaborators route | `itineraries/[id]/collaborators/route.ts:61` |
| 15 | Raw error messages in admin maintenance endpoint | `admin/maintenance/route.ts:75, 105` |
| 16 | Stale `deploy.yml` copy at repo root | `deploy.yml` |
| 17 | Sidebar cookie lacks `SameSite` attribute | `src/components/ui/sidebar.tsx:77` |
| 18 | No `upgrade-insecure-requests` in CSP | `next.config.mjs:278-287` |
| 19 | Overly broad default privileges (`GRANT ALL` to anon/authenticated) | `supabase/schema.sql:5` |
| 20 | `handle_new_user` trigger doesn't validate OAuth `raw_user_meta_data` | `supabase/schema.sql:134-146` |

---

## Positive Security Practices

- `server-only` import guard on admin Supabase client
- `getUser()` (not `getSession()`) used consistently for server-side auth
- Admin self-protection (can't delete/demote/suspend/impersonate yourself)
- Impersonation uses short-lived JWTs (5 min) in httpOnly, sameSite=strict cookies
- Admin audit logging on all admin actions with IP tracking
- Open redirect prevention in auth callback
- XP calculated server-side in RPC to prevent spoofing
- IP hashing for GDPR compliance with 90-day retention
- No hardcoded secrets — all via env vars/Cloudflare secrets
- Comprehensive security headers (HSTS, X-Frame-Options, CSP, etc.)
- Zod validation on key input endpoints
- `sanitizeText()` consistently applied to itinerary content

---

## Recommended Priority Actions

1. **Drop `newsletter_send_logs` RLS policy** (Critical)
2. **Remove direct INSERT/UPDATE RLS policies** on `user_achievements`, `user_challenges`, `user_streaks`, `user_activity` (High)
3. **Configure Cloudflare Rate Limiting** for public endpoints (High)
4. **Sanitize PostgREST filter input** in admin subscriber search (Medium)
5. **Use dedicated impersonation JWT secret** (Medium)
