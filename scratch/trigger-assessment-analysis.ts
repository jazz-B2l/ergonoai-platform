import { config } from 'dotenv';
config({ path: '.env.local' });
import { getAiService } from '../lib/ai/service';

async function testAnalysis() {
  const responseId = '1a2d1566-69fc-4910-a0dd-2c794be3ee54';
  console.log(`--- TRIGGERING ASSESSMENT ANALYSIS FOR ID: ${responseId} ---`);

  try {
    const aiService = getAiService();
    const result = await aiService.analyzeAssessment(responseId);

    console.log('\n[SUCCESS] Assessment Analysis Complete!');
    console.log('Overall Risk Score:', result.overallRiskScore);
    console.log('Risk Level:', result.riskLevel);
    console.log('Confidence Score:', result.confidenceScore);
    console.log('Summary:', result.summary);
    console.log('Recommendations Count:', result.recommendations?.length || 0);
    console.log('Detected Risks Count:', result.detectedRisks?.length || 0);
    console.log('--------------------------------------------------');
  } catch (error) {
    console.error('[FAILED] Assessment Analysis encountered an error:', error);
  }
}

testAnalysis();
