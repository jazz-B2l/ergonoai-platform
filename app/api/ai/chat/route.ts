import { NextRequest, NextResponse } from 'next/server';
import { getAiService, checkRateLimit } from '@/lib/ai/service';
import { AI_CONSTANTS } from '@/lib/ai/constants';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const chatSchema = z.object({
  conversationId: z.string().nullable().optional(),
  organizationId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  message: z.string().min(1),
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

    // 2. Parse and Validate Request Payload with Zod
    const parsedBody = chatSchema.safeParse(await request.json().catch(() => ({})));
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Validation Error', message: parsedBody.error.message },
        { status: 400 }
      );
    }
    
    const { conversationId, organizationId, userId, message, aiProvider, aiModel } = parsedBody.data;
    const activeUserId = userId || user.id;

    // 3. Call AI Service
    const aiService = getAiService();
    const result = await aiService.chat(
      conversationId || null,
      organizationId,
      activeUserId,
      message,
      { provider: aiProvider, modelId: aiModel }
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
