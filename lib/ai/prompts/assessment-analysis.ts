import { AssessmentAnalysisResult } from '../types';

export const ASSESSMENT_ANALYSIS_SYSTEM_PROMPT = `You are a Senior Occupational Health & Ergonomics Analyst. Your job is to perform a detailed assessment of a worker's workstation, postures, symptoms, and environment, based on their questionnaire responses and physical context.

You must analyze:
1. Musculoskeletal symptoms (e.g. Nordic Musculoskeletal Questionnaire / NMQ data, discomfort in neck, back, hands, shoulders, etc.)
2. Workstation configurations (chair, desk, screen heights and distances)
3. Environmental comfort (thermal, noise, glare, lighting quality)
4. Worker characteristics (height, weight, dominant hand, working hours per day)

You MUST generate a response in strict JSON format. Do not include any explanation or markdown formatting outside the JSON block.

The JSON response MUST match the following structure:
\`\`\`json
{
  "overallRiskScore": 55.5, // Numeric score from 0.0 to 100.0 representing computed overall risk
  "riskLevel": "medium", // String value: "low" | "medium" | "high" | "critical"
  "confidenceScore": 92.0, // AI confidence score from 0.0 to 100.0 based on data completeness
  "summary": "Detailed summary paragraph explaining the worker's current risk drivers, core issues found, and general situation...",
  "recommendations": [
    "Raise the chair height by 3cm to allow elbow alignment",
    "Reposition the secondary screen to avoid neck rotation",
    "Establish a 20-20-20 visual break routine to alleviate eye strain"
  ],
  "detectedRisks": [
    {
      "body_part": "Neck", // Body region if applicable (e.g., "Neck", "Shoulders", "Lower Back", etc.) or null
      "category": "Physical", // Category of hazard (e.g., "Physical", "Mechanical", "Chemical", "Biological", "Fire", "Negative/Passive")
      "finding": "Frequent neck flexion due to low monitor placement",
      "severity": "high", // "low" | "medium" | "high" | "critical"
      "score": 7.5 // Local severity score out of 10.0
    }
  ],
  "bodyPartScores": {
    "Neck": 7.5,
    "Shoulders": 4.0,
    "Lower Back": 6.0
  },
  "categoryScores": {
    "Physical": 6.8,
    "Mechanical": 5.0
  }
}
\`\`\`

Strict Rules:
- Return ONLY the raw JSON string. Do not wrap it in anything else, or prefix it.
- Ensure all numeric values are numbers, not strings.
- Be objective and map findings directly to RULA/REBA guidelines and ISO comfort standards.
- Evaluate height, weight, and working hours per day context. For example, long working hours (>8 hrs) increase musculoskeletal risk factors.
`;

export function generateAssessmentAnalysisUserPrompt(data: {
  employee: any;
  organization: any;
  department: any;
  site: any;
  assessment: any;
  template: any;
  answers: Array<{ questionText: string; questionCode: string; category: string; value: string; label?: string; note?: string }>;
}): string {
  const answersString = data.answers
    .map(
      (a) =>
        `- **Question**: ${a.questionText} (${a.questionCode}) [Category: ${a.category || 'N/A'}]\n  **Answer**: ${a.value}${
          a.label ? ` (${a.label})` : ''
        }${a.note ? `\n  **User Note**: ${a.note}` : ''}`
    )
    .join('\n\n');

  return `Please perform an ergonomic risk analysis for the following worker and assessment:

### Employee Profile & Context
- **Organization**: ${data.organization?.name || 'N/A'}
- **Site**: ${data.site?.name || 'N/A'}
- **Department**: ${data.department?.name || 'N/A'}
- **Job Title**: ${data.employee?.jobTitle || 'N/A'}
- **Gender**: ${data.employee?.gender || 'N/A'}
- **Biometrics**: Height: ${data.employee?.heightCm ? `${data.employee.heightCm} cm` : 'N/A'}, Weight: ${
    data.employee?.weightKg ? `${data.employee.weightKg} kg` : 'N/A'
  }
- **Dominant Hand**: ${data.employee?.dominantHand || 'N/A'}
- **Working Hours/Day**: ${data.employee?.workingHoursPerDay || 'N/A'}
- **Notes**: ${data.employee?.notes || 'None'}

### Assessment Info
- **Assessment Title**: ${data.assessment?.title || 'N/A'}
- **Template ID**: ${data.template?.id || 'N/A'}

### Questionnaire Responses
${answersString}

Perform the calculation of risk scores, compile findings, write recommendations, and return the strict JSON output.`;
}
