import { NextRequest, NextResponse } from 'next/server';
import { ProviderFactory } from '@/lib/ai/provider-factory';

export async function GET(request: NextRequest) {
  try {
    const gemini = ProviderFactory.get('gemini');
    const groq = ProviderFactory.get('groq');

    // Run health checks in parallel
    const [geminiHealthy, groqHealthy] = await Promise.all([
      gemini.isHealthy().catch(() => false),
      groq.isHealthy().catch(() => false),
    ]);

    const status = geminiHealthy && groqHealthy ? 'healthy' : (geminiHealthy || groqHealthy ? 'degraded' : 'unhealthy');

    return NextResponse.json({
      status,
      providers: {
        gemini: { status: geminiHealthy ? 'healthy' : 'unhealthy' },
        groq: { status: groqHealthy ? 'healthy' : 'unhealthy' },
      }
    }, { status: 200 });
  } catch (error: any) {
    console.error('Health API error:', error);
    return NextResponse.json({ status: 'unhealthy', error: error.message || error }, { status: 500 });
  }
}
