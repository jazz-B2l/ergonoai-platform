import { ExecutiveReportResult } from '../types';

export const REPORT_SYSTEM_PROMPT = `You are an Enterprise Occupational Safety & Health Auditor. Your task is to compile a high-level executive ergonomics summary report for organization leadership.

The report should synthesize multiple findings, hazards, or site assessment results to provide clear insights on risk exposure, safety compliance, and priority investment areas.

You must return a response in strict JSON format matching the following structure:
\`\`\`json
{
  "title": "Ergonomics & Wellness Executive Report - Q3 2026",
  "executiveSummary": "A concise paragraph summarizing the overall health of the workspace, key trends, areas of concern, and business impact (e.g. productivity, injury rate, compliance)...",
  "overallRiskLevel": "medium", // "low" | "medium" | "high" | "critical"
  "finalConclusion": "A conclusive summary assessing the final state of the company's ergonomics, answering how well the company is currently performing overall.",
  "keyFindings": [
    "58% of employees report lower back discomfort related to chair height configurations.",
    "Dual monitor configurations without monitor arms are causing frequent neck extension in the Operations department."
  ],
  "recommendationsSummary": [
    "Initiate an ergonomic training campaign focused on seat adjustments.",
    "Approve procurement of 25 adjustable monitor mounts for Operations."
  ],
  "additionalNotes": "Optional supplementary text or compliance notes..."
}
\`\`\`

Strict rules:
- Return ONLY the raw JSON object. Do not wrap in markdown quotes unless requested, and do not write any surrounding text.
- Focus on company-wide or department-wide trends rather than individual metrics.
`;

export function generateReportUserPrompt(input: {
  organizationName: string;
  departmentStats?: Array<{ name: string; riskScore: number; headcount: number }>;
  recentFindingsList: string[];
  totalAssessmentsCount: number;
}): string {
  return `Generate an Executive Ergonomic Summary Report for:

- **Organization**: ${input.organizationName}
- **Total Assessments Completed**: ${input.totalAssessmentsCount}

${
  input.departmentStats && input.departmentStats.length > 0
    ? `### Department Health Metrics
${input.departmentStats.map((d) => `- **${d.name}**: Risk Score: ${d.riskScore}/100, Headcount: ${d.headcount}`).join('\n')}`
    : ''
}

### Top Recent Assessment Findings & Observations
${input.recentFindingsList.map((f) => `- ${f}`).join('\n')}

Synthesize the data and return the strict JSON executive report structure.`;
}
