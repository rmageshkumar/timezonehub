import { analyzeGscRows } from './analyzer';
import { querySearchConsole, type GscRow } from './gsc';

export interface SeoReport {
  generatedAt: string;
  period: { startDate: string; endDate: string };
  rows: number;
  opportunities: ReturnType<typeof analyzeGscRows>;
}

export async function buildSeoReport(
  accessToken: string,
  period: { startDate: string; endDate: string },
): Promise<SeoReport> {
  const rows: GscRow[] = await querySearchConsole(accessToken, {
    ...period,
    dimensions: ['query', 'page'],
    rowLimit: 1000,
  });

  return {
    generatedAt: new Date().toISOString(),
    period,
    rows: rows.length,
    opportunities: analyzeGscRows(rows),
  };
}
