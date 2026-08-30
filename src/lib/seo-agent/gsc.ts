import { SEO_AGENT_CONFIG } from './config';

export interface GscRow {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
}

export interface GscQueryRequest {
  startDate: string;
  endDate: string;
  dimensions?: Array<'query' | 'page' | 'country' | 'device' | 'date'>;
  rowLimit?: number;
  startRow?: number;
}

/**
 * Thin Google Search Console Search Analytics client.
 * Credentials are intentionally injected by the runtime; never commit them.
 */
export async function querySearchConsole(
  accessToken: string,
  request: GscQueryRequest,
): Promise<GscRow[]> {
  const siteUrl = encodeURIComponent(SEO_AGENT_CONFIG.siteUrl);
  const response = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: request.startDate,
        endDate: request.endDate,
        dimensions: request.dimensions ?? ['query', 'page'],
        rowLimit: Math.min(request.rowLimit ?? 1000, 25000),
        startRow: request.startRow ?? 0,
      }),
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Search Console API ${response.status}: ${body.slice(0, 500)}`);
  }

  const data = (await response.json()) as { rows?: GscRow[] };
  return data.rows ?? [];
}
