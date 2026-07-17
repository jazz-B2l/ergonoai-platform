import { config } from 'dotenv';
config({ path: '.env.local' });
import { getAiService } from '../lib/ai/service';
import { getGroqProvider } from '../lib/ai/groq';

async function verify() {
  console.log('--- ERGONOAI: AI MODULE VERIFICATION ---');
  
  try {
    const provider = getGroqProvider();
    console.log('[SUCCESS] Groq Provider instantiated:', provider.name);
    
    const service = getAiService();
    console.log('[SUCCESS] AI Service Layer instantiated.');
    
    // Simulating rate limiting logic
    const { allowed, remaining } = require('../lib/ai/service').checkRateLimit('test_user_id');
    console.log(`[SUCCESS] Rate limiter check -> Allowed: ${allowed}, Remaining: ${remaining}`);

    console.log('--- ALL TESTS PASSED ---');
  } catch (error) {
    console.error('[FAILED] Verification encountered an error:', error);
    process.exit(1);
  }
}

verify();
