# ClockHive SEO Agent

Phase 1 connects the deterministic opportunity analyzer to Google Search Console Search Analytics.

## Runtime configuration

Set a Google OAuth access token at runtime as `GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN`. Do not commit credentials.

The token must be authorized for the Search Console property represented by `NEXT_PUBLIC_APP_URL` (default: `https://clockhive.cc`).

## Example

```ts
import { buildSeoReport } from '@/lib/seo-agent/report';

const report = await buildSeoReport(process.env.GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN!, {
  startDate: '2026-08-01',
  endDate: '2026-08-30',
});
```

The next step is to add a protected server endpoint and scheduled job. Keep the endpoint server-only and never expose the access token to browser code.
