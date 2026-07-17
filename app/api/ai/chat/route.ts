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
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': AI_CONSTANTS.MAX_REQUESTS_PER_MINUTE.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toString()
          }
        }
      );
    }

    // 2. Parse and Validate Request Payload
    const body = await request.json();
    const { conversationId, organizationId, userId, message } = body;

    if (!organizationId) {
      return NextResponse.json({ error: 'Validation Error', message: 'Missing organizationId' }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: 'Validation Error', message: 'Missing userId' }, { status: 400 });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Validation Error', message: 'Missing message content' }, { status: 400 });
    }

    // 3. Call AI Service
    const aiService = getAiService();
    const result = await aiService.chat(
      conversationId || null,
      organizationId,
      userId,
      message
    );

    // 4. Return response with rate limit headers
    return NextResponse.json(result, {
      status: 200,
      headers: {
        'X-RateLimit-Limit': AI_CONSTANTS.MAX_REQUESTS_PER_MINUTE.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': rateLimit.resetTime.toString()
      }
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    
    const status = error.message?.includes('Rate Limit') ? 429 : 500;
    return NextResponse.json(
      { 
        error: 'AI Completion Failed', 
        message: error.message || 'An unexpected error occurred during message processing.' 
      }, 
      { status }
    );
  }
}
