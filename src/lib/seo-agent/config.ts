export const SEO_AGENT_CONFIG = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://clockhive.cc',
  strikingDistance: { min: 4, max: 20 },
  lowCtr: { minImpressions: 100, maxCtr: 0.03, maxPosition: 20 },
  trafficDropPercent: 20,
  topQueries: 1000,
} as const;

export type SeoOpportunityType =
  | 'striking_distance'
  | 'low_ctr'
  | 'traffic_drop'
  | 'content_gap'
  | 'technical';

export interface SeoOpportunity {
  type: SeoOpportunityType;
  priority: 'high' | 'medium' | 'low';
  query?: string;
  page?: string;
  position?: number;
  clicks?: number;
  impressions?: number;
  ctr?: number;
  recommendation: string;
}
