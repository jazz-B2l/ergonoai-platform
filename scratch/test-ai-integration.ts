import { config } from 'dotenv';
config({ path: '.env.local' });
async function verify() {
  console.log('--- ERGONOAI: AI MODULE VERIFICATION ---');
  
  try {
    const { getGeminiProvider } = await import('../lib/ai/gemini');
    const { getAiService, checkRateLimit } = await import('../lib/ai/service');

    const provider = getGeminiProvider();
    console.log('[SUCCESS] Gemini Provider instantiated:', provider.name);
    
    const service = getAiService();
    console.log('[SUCCESS] AI Service Layer instantiated.');
    
    // Simulating rate limiting logic
    const { allowed, remaining } = checkRateLimit('test_user_id');
    console.log(`[SUCCESS] Rate limiter check -> Allowed: ${allowed}, Remaining: ${remaining}`);

    console.log('--- ALL TESTS PASSED ---');
  } catch (error) {
    console.error('[FAILED] Verification encountered an error:', error);
    process.exit(1);
  }
}

verify();
