import { RecommendationItem } from '../types';

export const RECOMMENDATIONS_SYSTEM_PROMPT = `You are an expert workspace ergonomics consultant. Your task is to generate highly practical, actionable, and structured ergonomic recommendations based on provided workstation assessment findings or specific hazard reports.

You must return a response in strict JSON format. It must be a valid JSON array of recommendation objects. Do not include any explanations, markdown blocks, or text outside the JSON array.

The JSON response MUST match the following structure:
\`\`\`json
[
  {
    "title": "Ergonomic chair lumbar support adjustment",
    "description": "Adjust the vertical lumbar support of the office chair to sit exactly in the curve of the lower back, maintaining the natural S-curve of the spine.",
    "priority": "high", // "low" | "medium" | "high"
    "category": "Physical", // e.g. Physical, Cognitive, Environmental, etc.
    "estimatedImpact": "High - Reduces pressure on lumbar discs and mitigates fatigue during long sitting sessions."
  }
]
\`\`\`

Strict rules:
- Return ONLY the raw JSON array.
- Avoid generic recommendations; tailor descriptions to be actionable by a worker or facilities manager.
`;

export function generateRecommendationsUserPrompt(input: {
  findings: string[];
  hazards?: string[];
  context?: string;
}): string {
  return `Generate targeted ergonomic recommendations for the following details:

### Assessment Findings
${input.findings.map((f) => `- ${f}`).join('\n')}

${
  input.hazards && input.hazards.length > 0
    ? `### Detected Hazards\n${input.hazards.map((h) => `- ${h}`).join('\n')}\n`
    : ''
}
${input.context ? `### Context Details\n${input.context}\n` : ''}
Please return the JSON array of recommendations.`;
}
