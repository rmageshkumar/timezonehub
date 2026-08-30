import { NextRequest, NextResponse } from 'next/server';
import { getSearchConsoleAccessToken } from '@/lib/seo-agent/auth';
import { buildSeoReport } from '@/lib/seo-agent/report';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function dateDaysAgo(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

export async function GET(request: NextRequest) {
  const expectedSecret = process.env.SEO_AGENT_CRON_SECRET;
  const suppliedSecret = request.headers.get('x-seo-agent-secret');

  if (!expectedSecret || suppliedSecret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = request.nextUrl;
    const days = Math.min(Math.max(Number(url.searchParams.get('days') ?? '28'), 1), 90);
    const accessToken = await getSearchConsoleAccessToken();
    const report = await buildSeoReport(accessToken, {
      startDate: dateDaysAgo(days),
      endDate: dateDaysAgo(1),
    });

    return NextResponse.json(report, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('SEO agent report failed', error);
    return NextResponse.json({ error: 'Unable to retrieve Search Console data.' }, { status: 502 });
  }
}
