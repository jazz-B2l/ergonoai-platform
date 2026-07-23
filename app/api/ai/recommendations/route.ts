import { NextRequest, NextResponse } from 'next/server';
import { getAiService, checkRateLimit } from '@/lib/ai/service';
import { AI_CONSTANTS } from '@/lib/ai/constants';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const recommendationsSchema = z.object({
  findings: z.array(z.string()).min(1),
  hazards: z.array(z.string()).optional(),
  context: z.string().optional(),
  organizationId: z.string().uuid().optional(),
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
    const parsedBody = recommendationsSchema.safeParse(await request.json().catch(() => ({})));
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Validation Error', message: parsedBody.error.message },
        { status: 400 }
      );
    }

    const { findings, hazards, context, organizationId, aiProvider, aiModel } = parsedBody.data;

    // 3. Call AI Service to generate recommendations
    const aiService = getAiService();
    const recommendations = await aiService.generateRecommendations(findings, hazards, context, {
      provider: aiProvider,
      modelId: aiModel,
      organizationId
    });

    // 4. Return results
    return NextResponse.json({ recommendations }, { status: 200 });

  } catch (error: any) {
    console.error('Recommendations API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Recommendation Failed', 
        message: error.message || 'An unexpected error occurred while generating recommendations.' 
      }, 
      { status: 500 }
    );
  }
}
