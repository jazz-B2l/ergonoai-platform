import { NextRequest, NextResponse } from 'next/server';
import { getAiService, checkRateLimit } from '@/lib/ai/service';
import { AI_CONSTANTS } from '@/lib/ai/constants';

export async function POST(request: NextRequest) {
  try {
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
    const { findings, hazards, context } = body;

    if (!findings || !Array.isArray(findings) || findings.length === 0) {
      return NextResponse.json(
        { error: 'Validation Error', message: 'Missing or empty findings array' }, 
        { status: 400 }
      );
    }

    // 3. Call AI Service to generate recommendations
    const aiService = getAiService();
    const recommendations = await aiService.generateRecommendations(findings, hazards, context);

    // 4. Return results
    return NextResponse.json({ recommendations }, { status: 200 });

  } catch (error: any) {
    console.error('Recommendations API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Recommendation Generation Failed', 
        message: error.message || 'An unexpected error occurred while generating recommendations.' 
      }, 
      { status: 500 }
    );
  }
}
