# Security requirements — Web application

## HTTP headers (required)
- Content-Security-Policy: target `default-src 'self'` with no `unsafe-inline`/`unsafe-eval`; audit all inline scripts, styles, and third-party sources first — a strict CSP will break them without prior inventory
- X-Frame-Options: DENY (or SAMEORIGIN)
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: disable only features the application does not use (e.g. `camera=(), microphone=(), geolocation=()`); do not blanket-deny features required by legitimate app functionality
- Strict-Transport-Security: max-age=63072000 (HTTPS only); add includeSubDomains only if ALL subdomains support HTTPS; add preload only as a deliberate opt-in
- Content-Security-Policy: include `frame-ancestors 'none'` (or `'self'`) alongside X-Frame-Options

## CORS
- Never set `Access-Control-Allow-Origin: *` on endpoints that use authentication or handle sensitive data
- Maintain an explicit allowlist of trusted origins; reject requests from unlisted origins
- Do not reflect the request `Origin` header back without validation
- `Access-Control-Allow-Credentials: true` requires an exact origin match, never a wildcard

## CSRF protection
- Use SameSite=Strict cookies as primary defense
- Add CSRF token to all state-changing forms (POST/PUT/PATCH/DELETE)
- Validate Origin/Referer headers on sensitive endpoints
- Validate all redirect targets against an allowlist of trusted URLs/paths; never redirect to user-supplied arbitrary URLs (Open Redirect)

## Frontend
- Sanitize HTML rendered from user input (DOMPurify or equivalent)
- NEVER use innerHTML / dangerouslySetInnerHTML with untrusted data
- Store tokens in memory or httpOnly cookies — not localStorage
- Avoid eval(), Function(), setTimeout(string), document.write()
- Subresource Integrity (SRI) for all third-party scripts and stylesheets

## Cookies
- All authentication cookies must have: `Secure; HttpOnly; SameSite=Strict` (use `Lax` only when cross-site GET navigation is required)
- Set `Path` and `Domain` to the narrowest scope needed
- Never store sensitive data in non-HttpOnly cookies accessible to JavaScript

## Sessions
- Regenerate session ID after login and privilege escalation
- Enforce absolute and idle session timeouts
- Invalidate sessions server-side on logout

## Rate limiting & abuse
- Rate-limit login, registration, and password-reset endpoints
- Implement account lockout or CAPTCHA after N failed attempts
- Throttle API endpoints per user/IP

# Also apply all rules from the universal security prompt