# Security Checklist - Biovity

## Implemented

### Headers (next.config.ts)
- `X-Content-Type-Options: nosniff` - Prevents MIME-type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-XSS-Protection: 1; mode=block`

### Waitlist API
- Rate limiting: 5 requests/minute per IP
- Input validation: email format, role whitelist
- Max email length: 254 chars
- Parameterized SQL (no SQL injection)
- Generic error messages (no stack traces to client)

### Auth (Better Auth)
- Rate limiting: 10 requests/minute per IP
- Secure cookies in production
- 7-day session expiry

### Secrets
- `.env` in `.gitignore` - never commit
- `.env.example` - template without real values

## Recommendations

### Critical
1. **Rotate secrets** if `.env` was ever committed or shared
2. **Production env**: Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production domain
3. **Database**: Use Supabase connection pooling (Supavisor) for production

### Optional (scale)
- **Rate limiting**: For Vercel serverless, in-memory limit is per-instance. Consider [Upstash Redis](https://upstash.com) for distributed rate limiting
- **CSP**: Add Content-Security-Policy if you need stricter script/style control
- **CORS**: Next.js API routes allow same-origin by default; verify if you add external API consumers

### Monitoring
- Monitor `/api/waitlist` for 429s (rate limit hits)
- Log failed auth attempts
- Set up Supabase alerts for unusual DB activity
