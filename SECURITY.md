# Security Documentation

## Security Review Summary

**Last Review Date:** January 2026
**Reviewer:** Security audit by Claude (Anthropic)
**Application:** F&J Stone Services - Next.js + Supabase + Tailwind

---

## Threat Model

### Top Risks for This Application

| Risk | Severity | Status | Mitigation |
|------|----------|--------|------------|
| Auth/Session bypass | Critical | Mitigated | Supabase Auth + admin role check in middleware |
| RLS bypass (data access) | Critical | Secure | RLS enabled on all tables, `is_admin()` function |
| XSS (Cross-Site Scripting) | High | Secure | No `dangerouslySetInnerHTML`, HTML escaping in emails |
| CSRF | Medium | Secure | Server Actions use POST with origin checks |
| SSRF | Low | N/A | No user-provided URL fetching |
| Open Redirects | Low | Secure | All redirects use hardcoded paths |
| API Abuse / Brute Force | High | Mitigated | Rate limiting on login + quote form |
| File Upload Attacks | High | Mitigated | MIME validation + magic byte verification |
| PII Leakage (Sentry) | Medium | Fixed | `sendDefaultPii: false`, scrubbing enabled |
| Environment Variable Exposure | Critical | Secure | Service role key server-only |

---

## Security Controls Implemented

### 1. Authentication & Authorization

- **Supabase Auth** with email/password authentication
- **Admin allowlist** via `admin_allowlist` table
- **`is_admin()` RPC function** for role verification (SECURITY DEFINER)
- **Middleware protection** on `/admin/*` routes with:
  - Authentication check
  - Admin role verification
  - Rate limiting on login (5 attempts / 15 minutes)

### 2. Row Level Security (RLS)

All tables have RLS enabled with least-privilege policies:

| Table | Public Access | Admin Access |
|-------|--------------|--------------|
| `site_settings` | SELECT | SELECT, UPDATE, INSERT |
| `projects` | SELECT (published only) | CRUD |
| `project_images` | SELECT (published projects) | CRUD |
| `reviews` | SELECT (published only) | CRUD |
| `quote_requests` | INSERT only | SELECT, UPDATE, DELETE |
| `quote_request_files` | None | SELECT, INSERT, DELETE |
| `content_blocks` | SELECT | CRUD |

### 3. Security Headers

Configured in `next.config.ts`:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: [comprehensive policy]
```

### 4. Input Validation

- **Zod schemas** for all form inputs (client + server)
- **Header injection prevention** (CR/LF characters blocked)
- **HTML injection prevention** in portfolio validation
- **Phone number normalization** and US format validation
- **Email validation** with max length limits

### 5. File Upload Security

- **MIME type validation** (JPEG, PNG, WebP only)
- **Magic byte verification** to prevent MIME spoofing
- **File size limits** (5MB per file, 5 files max for quotes)
- **Secure filename generation** (UUID-based, no user input)
- **Private storage bucket** for quote uploads (signed URLs only)

### 6. Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| Quote submission | 5 requests | 1 minute |
| Admin login | 5 attempts | 15 minutes |

### 7. Error Handling

- Generic error messages to users (no stack traces)
- Detailed logging server-side only
- Sentry configured with PII scrubbing

---

## Files Changed in Security Hardening

| File | Changes |
|------|---------|
| `sentry.server.config.ts` | Disabled PII, added data scrubbing, reduced trace rate |
| `sentry.edge.config.ts` | Disabled PII, reduced trace rate |
| `instrumentation-client.ts` | Disabled PII, added breadcrumb scrubbing |
| `next.config.ts` | Added security headers (CSP, HSTS, etc.) |
| `middleware.ts` | Added login rate limiting, admin role check |
| `lib/validations.ts` | Added magic byte validation function |
| `lib/validations/portfolio.ts` | Re-exported magic byte validation |
| `app/actions/quote.ts` | Added magic byte validation for uploads |
| `app/api/admin/projects/[id]/upload-images/route.ts` | Added magic byte validation |

---

## How to Verify Security Fixes

### 1. Security Headers
```bash
# Check headers in browser DevTools (Network tab) or:
curl -I https://fjstoneservices.com
```

Verify presence of:
- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Content-Security-Policy`

### 2. Rate Limiting (Login)
```bash
# Attempt 6+ rapid login requests
# Should get 429 response after 5 attempts
```

### 3. Rate Limiting (Quote Form)
```bash
# Submit 6+ quote requests in < 1 minute
# Should get rate limit error
```

### 4. File Upload Validation
```bash
# Try uploading a .txt file renamed to .jpg
# Should be rejected by magic byte validation
```

### 5. Admin Access Control
```bash
# Access /admin routes without being in admin_allowlist
# Should redirect to /admin/unauthorized
```

### 6. Sentry PII Check
```bash
# Trigger an error and check Sentry dashboard
# Verify no user IPs, emails, or cookies are captured
```

---

## Ongoing Security Maintenance

### Weekly
- [ ] Check `npm audit` for new vulnerabilities
- [ ] Review Sentry for unusual errors or attack patterns

### Monthly
- [ ] Review Supabase Auth logs for suspicious activity
- [ ] Check rate limit effectiveness
- [ ] Update dependencies with security patches

### Quarterly
- [ ] Review and update RLS policies if schema changes
- [ ] Audit admin_allowlist membership
- [ ] Test backup/recovery procedures
- [ ] Review CSP and update if new domains needed

### Before Each Deploy
- [ ] Run `npm audit`
- [ ] Verify no secrets in code (`grep -r "SUPABASE_SERVICE" --include="*.ts"`)
- [ ] Check environment variables are correctly scoped
- [ ] Test admin authentication flow

---

## Environment Variable Security

### Server-Only (NEVER expose to client)
```
SUPABASE_SERVICE_ROLE_KEY  # Bypasses RLS - CRITICAL
RESEND_API_KEY             # Email service
SENTRY_AUTH_TOKEN          # Build-time only
```

### Public (Safe to expose)
```
NEXT_PUBLIC_SUPABASE_URL       # Public API endpoint
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Public anonymous key (RLS-protected)
NEXT_PUBLIC_SITE_URL           # Site URL for links
```

---

## Reporting Security Issues

If you discover a security vulnerability, please:

1. **Do NOT** open a public GitHub issue
2. Email the development team directly
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

---

## Security Checklist for New Features

When adding new features, verify:

- [ ] Input validation with Zod on both client and server
- [ ] RLS policies cover new tables/columns
- [ ] Admin-only endpoints check `is_admin()`
- [ ] File uploads validate magic bytes
- [ ] No user input used in SQL/shell commands
- [ ] No sensitive data logged
- [ ] Error messages don't leak implementation details
- [ ] New routes added to CSP if external domains needed
