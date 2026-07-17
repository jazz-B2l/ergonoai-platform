import { NextResponse } from 'next/server';
import { getGroqProvider } from '@/lib/ai/groq';
import { DEFAULT_CHAT_MODEL, DEFAULT_ANALYSIS_MODEL } from '@/lib/ai/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  try {
    // 1. Check environment variables
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json(
        {
          status: 'unhealthy',
          error: 'Configuration Error',
          message: 'GROQ_API_KEY is not defined in the server environment variables.',
        },
        { status: 500 }
      );
    }

    // 2. Test live connectivity with a lightweight prompt
    const provider = getGroqProvider();
    const testCompletion = await provider.chatCompletion(
      [{ role: 'user', content: 'respond with single word "OK"' }],
      {
        modelId: DEFAULT_CHAT_MODEL,
        temperature: 0.1,
        maxTokens: 5,
        timeoutMs: 10000 // 10 seconds timeout for health test
      }
    );

    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: {
        groqApiKeyConfigured: true,
      },
      config: {
        defaultChatModel: DEFAULT_CHAT_MODEL,
        defaultAnalysisModel: DEFAULT_ANALYSIS_MODEL,
      },
      connectivity: {
        provider: provider.name,
        testResponse: testCompletion.content.trim(),
        latencyMs,
      },
    });
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    console.error('Health Check Failure:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Connectivity Error',
        message: error.message || 'Failed to establish test connection to Groq API.',
        latencyMs,
      },
      { status: 500 }
    );
  }
}
