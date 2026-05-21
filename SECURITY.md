# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not** open a public issue. Instead, please report it privately.

### How to Report

1. **Email**: Send details to [opensource@yandex-team.ru](mailto:opensource@yandex-team.ru)
2. **Subject**: Include `[SECURITY]` in the subject line
3. **Details**: Please include:
   - Description of the vulnerability
   - Steps to reproduce (if applicable)
   - Potential impact
   - Suggested fix (if you have one)

### What to Expect

- We will acknowledge receipt of your report within 48 hours
- We will provide an initial assessment within 7 days
- We will keep you informed of our progress
- We will notify you when the vulnerability is fixed
- We will credit you in the security advisory (unless you prefer to remain anonymous)

## Security Considerations

This extension has both a **Node.js** part (Diplodoc CLI build step) and a **browser** part (injected into generated docs):

**Node.js build step**
- Reads `textFeedback` config value and validates it before use
- Copies a pre-built browser bundle to the output directory — verify the package integrity after installation (`npm audit`)

**Browser bundle**
- Sends user-submitted feedback as a POST request to the configured `endpoint`; ensure the endpoint uses HTTPS
- All user input is sanitized (HTML-escaped, truncated to 5000 chars) before sending
- A 7-second cooldown prevents rapid repeated submissions
- The `connect-src` CSP directive is automatically set to the endpoint origin

**Recommendations**
- Keep the package and its dependencies up to date (`npm audit`)
- Use an HTTPS endpoint for feedback submissions
- Validate and sanitize data on the server side as well — do not rely solely on client-side sanitization
- The browser bundle is included verbatim in generated docs; review it before deploying to production

Thank you for helping keep this project secure!
