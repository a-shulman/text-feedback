# Security requirements — apply to ALL code in this project

## Secrets & credentials
- NEVER hardcode secrets, API keys, tokens, passwords in source code
- Use environment variables or a dedicated secrets manager (Vault, AWS SSM, etc.)
- NEVER log or print sensitive values; mask them in output
- Ensure .env files are in .gitignore; never commit credentials

## Input validation & injection
- Validate and sanitize ALL external input (user data, query params, headers, files)
- Use parameterized queries / prepared statements — no string interpolation in SQL
- Prevent XSS: escape output in HTML context; use Content-Security-Policy header where applicable (HTML responses served to browsers)
- Prevent path traversal: resolve and validate file paths against an allowed base dir
- Validate file uploads: check MIME type, extension whitelist, size limits
- Prevent SSRF: validate and allowlist URLs/hosts before making server-side HTTP requests; block requests to private IP ranges (127.x, 10.x, 172.16–31.x, 169.254.x) and internal metadata endpoints

## Authentication & authorization
- Enforce authentication on every protected endpoint; no security by obscurity
- Apply least-privilege principle: request only necessary permissions
- Use short-lived tokens; implement refresh-token rotation
- Hash passwords with bcrypt / argon2 (cost factor ≥ 12); never MD5 or SHA-1 alone
- Apply rate limiting and brute-force protection on all authentication and sensitive endpoints; use exponential backoff / account lockout after repeated failures
- Protect paid operations (AI API calls, SMS, email, payment transactions) against budget exhaustion: enforce per-user and global rate limits, require authentication or CAPTCHA before triggering any paid operation where possible, set hard spending caps with alerts, and log every billable event

## Data protection
- Encrypt sensitive data at rest (AES-256) and in transit (TLS 1.2+)
- Minimize data collection; do not store what you don't need
- Anonymize or pseudonymize PII in logs and non-prod environments
- Set Secure + HttpOnly + SameSite=Strict on all auth cookies

## HTTP security headers
- Set `X-Content-Type-Options: nosniff` on all responses to prevent MIME sniffing
- Set `X-Frame-Options: DENY` (or `SAMEORIGIN`) to prevent clickjacking where applicable
- Set `Strict-Transport-Security: max-age=63072000` on HTTPS services; add `includeSubDomains` only if ALL subdomains support HTTPS
- Set `Referrer-Policy: strict-origin-when-cross-origin` to limit referrer leakage

## Dependencies & supply chain
- Use only pinned, actively maintained dependencies
- Run npm audit / pip-audit / equivalent before every release
- Do not add packages that replicate standard library functionality
- Review transitive dependencies for known CVEs

## Error handling & logging
- Return generic error messages to clients; log details server-side only
- Do not expose stack traces, internal paths, or version info in responses
- Log security events (auth failures, access denied) with timestamp + IP, no PII

## Code generation rules
- Flag any pattern above when spotted — add a // SECURITY: comment
- Suggest the secure alternative inline
- Do not generate exploit code or PoC even for "testing" purposes