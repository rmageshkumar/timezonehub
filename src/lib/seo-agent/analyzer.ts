import { SEO_AGENT_CONFIG, SeoOpportunity } from './config';

export interface SearchRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

/** Turns Search Console rows into actionable, explainable SEO opportunities. */
export function analyzeSearchRows(rows: SearchRow[]): SeoOpportunity[] {
  const opportunities: SeoOpportunity[] = [];

  for (const row of rows) {
    const [query = '', page = ''] = row.keys;

    if (
      row.position >= SEO_AGENT_CONFIG.strikingDistance.min &&
      row.position <= SEO_AGENT_CONFIG.strikingDistance.max
    ) {
      opportunities.push({
        type: 'striking_distance',
        priority: row.position <= 10 ? 'high' : 'medium',
        query,
        page,
        position: row.position,
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        recommendation:
          'Improve the matching page with stronger intent alignment, useful content, internal links and a compelling title/meta description.',
      });
    }

    if (
      row.impressions >= SEO_AGENT_CONFIG.lowCtr.minImpressions &&
      row.ctr <= SEO_AGENT_CONFIG.lowCtr.maxCtr &&
      row.position <= SEO_AGENT_CONFIG.lowCtr.maxPosition
    ) {
      opportunities.push({
        type: 'low_ctr',
        priority: row.impressions >= 500 ? 'high' : 'medium',
        query,
        page,
        position: row.position,
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        recommendation:
          'Review title and meta description for search intent and SERP appeal before changing page content.',
      });
    }
  }

  return opportunities.sort((a, b) => {
    const priority = { high: 3, medium: 2, low: 1 };
    return priority[b.priority] - priority[a.priority] ||
      (b.impressions ?? 0) - (a.impressions ?? 0);
  });
}
