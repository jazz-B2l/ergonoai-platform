import { NextRequest, NextResponse } from 'next/server';
import { getAiService, checkRateLimit } from '@/lib/ai/service';
import { AI_CONSTANTS } from '@/lib/ai/constants';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const assessmentSchema = z.object({
  responseId: z.string().uuid(),
  aiProvider: z.enum(['auto', 'gemini', 'groq', 'openai', 'claude', 'deepseek']).optional(),
  aiModel: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'User authentication required' },
        { status: 401 }
      );
    }

    // 1. Rate Limiting Check
    const ip = request.headers.get('x-forwarded-for') || 'anonymous_ip';
    const rateLimit = checkRateLimit(ip);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too Many Requests', message: AI_CONSTANTS.ERRORS.RATE_LIMIT_EXCEEDED },
        { status: 429 }
      );
    }

    // 2. Parse and Validate Request Payload with Zod
    const parsedBody = assessmentSchema.safeParse(await request.json().catch(() => ({})));
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Validation Error', message: parsedBody.error.message },
        { status: 400 }
      );
    }
    
    const { responseId, aiProvider, aiModel } = parsedBody.data;

    // 3. Call AI Service to analyze the assessment
    const aiService = getAiService();
    const result = await aiService.analyzeAssessment(responseId, {
      provider: aiProvider,
      modelId: aiModel
    });

    // 4. Return results
    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    console.error('Assessment API Error:', error);
    
    const isNotFound = error.message?.includes('not found') || error.message?.includes(AI_CONSTANTS.ERRORS.RECORD_NOT_FOUND);
    const status = isNotFound ? 404 : 500;
    
    return NextResponse.json(
      { 
        error: 'Assessment Analysis Failed', 
        message: error.message || 'An unexpected error occurred during ergonomic assessment analysis.' 
      }, 
      { status }
    );
  }
}
