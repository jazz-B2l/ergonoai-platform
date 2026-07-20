import { NextRequest, NextResponse } from 'next/server';
import { getAiService, checkRateLimit } from '@/lib/ai/service';
import { AI_CONSTANTS } from '@/lib/ai/constants';
import { createClient } from '@/lib/supabase/server';

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

    // 2. Parse and Validate Request Payload
    const body = await request.json();
    const { responseId } = body;

    if (!responseId) {
      return NextResponse.json({ error: 'Validation Error', message: 'Missing responseId' }, { status: 400 });
    }

    // 3. Call AI Service to analyze the assessment
    const aiService = getAiService();
    const result = await aiService.analyzeAssessment(responseId);

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
