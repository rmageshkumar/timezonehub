# ClockHive SEO Agent

Phase 1 provides a deterministic, read-only SEO opportunity engine.

## Goals

- Identify queries in the ranking striking-distance range (positions 4–20).
- Identify high-impression pages/queries with weak CTR.
- Produce explainable recommendations before any automated site changes.

## Planned integrations

1. Google Search Console Search Analytics API
2. Google Analytics 4 Data API
3. Technical sitemap/indexability checks
4. Optional AI-assisted recommendations
5. GitHub PR generation for reviewed changes

## Safety

The agent must not modify production content automatically in Phase 1. Credentials belong in deployment secrets/environment variables and must never be committed to the repository.
