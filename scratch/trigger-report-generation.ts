import { config } from 'dotenv';
config({ path: '.env.local' });
import { getAiService } from '../lib/ai/service';

async function testReport() {
  const organizationId = '0d6abdb4-6698-4a29-9569-f730892be9da';
  console.log(`--- TRIGGERING REPORT GENERATION FOR ID: ${organizationId} ---`);

  try {
    const aiService = getAiService();
    const result = await aiService.generateExecutiveReport(organizationId);

    console.log('\n[SUCCESS] Executive Report Compiled!');
    console.log(JSON.stringify(result, null, 2));
    console.log('--------------------------------------------------');
  } catch (error) {
    console.error('[FAILED] Report compilation encountered an error:', error);
  }
}

testReport();
