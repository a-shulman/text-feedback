# Security requirements — Backend / API

## API design
- Enforce authentication (JWT, OAuth 2.0, API keys) on every non-public route
- Validate JWT signature, expiry (exp), audience (aud), and issuer (iss)
- Implement RBAC or ABAC — verify authorization per resource, not just per route
- Return 401 vs 403 correctly; never leak resource existence to unauthorized callers

## Input & deserialization
- Validate request body schema with a strict schema library (Zod, Pydantic, joi)
- Reject unknown fields; set max payload size limits; limit JSON nesting depth to prevent JSON bomb / stack overflow attacks
- Prevent mass assignment: never bind incoming data directly to a model; use an explicit allowlist of writable fields
- NEVER deserialize untrusted data with pickle / Java ObjectInputStream / YAML.load
- Validate and whitelist allowed Content-Type headers

## Database
- Use ORM parameterized queries or explicit prepared statements everywhere
- Restrict DB user to minimum required privileges (no DROP/ALTER in app user)
- Enable query logging for audit; scrub PII before long-term storage
- Avoid raw query construction from user-supplied field names or sort orders

## Infrastructure & config
- Store config in environment, not in code (12-factor app)
- Disable debug mode and verbose error output in production
- Run the process as a non-root user with minimal filesystem permissions
- Use a read-only filesystem where possible; mount secrets as ephemeral volumes
- Set explicit timeouts on all outbound HTTP requests and DB queries; limit response body size from external services to prevent resource exhaustion

## Logging
- Never log Authorization headers, raw passwords, payment card numbers, or full request bodies containing sensitive fields
- Scrub or mask sensitive values before writing to any log sink (stdout, file, SIEM)
- Log security-relevant events (auth failures, permission denied, input validation errors) with timestamp, endpoint, and anonymized user identifier

## Inter-service communication
- Prefer mutual TLS (mTLS) or signed tokens for service-to-service calls where infrastructure supports it; at minimum enforce TLS and validate server certificates
- Validate the source of events and webhooks (HMAC signatures); reject replays by checking a timestamp in the signed payload (reject if older than 5 minutes) and tracking processed nonces/event IDs
- Apply the same input validation rules to internal API calls

# Also apply all rules from the universal security prompt