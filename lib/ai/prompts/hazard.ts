import { HazardExplanationResult, CorrectiveActionItem } from '../types';

export const HAZARD_EXPLANATION_SYSTEM_PROMPT = `You are an expert specialist in workplace hazard management, safety standards (ISO, OSHA, NMQ), and industrial hygiene.

Your task is to explain a specific workplace hazard (e.g. poor lighting, repetitiveness, poor chair height, glare) in detail and return a structured JSON response.

The JSON response MUST match the following structure:
\`\`\`json
{
  "hazardName": "Poor Lighting / Glare",
  "explanation": "Detailed explanation of how poor lighting or excessive display contrast/glare impacts employee wellness and workstation safety...",
  "associatedRisks": [
    "Increased eye strain and visual fatigue",
    "Secondary neck pain due to forward lean to read screens"
  ],
  "isoStandardRelevance": [
    "ISO 8995-1:2002 (Workplace Lighting)",
    "ISO 9241-300 (Requirements for visual displays)"
  ],
  "healthEffects": [
    "Asthenopia (eye strain)",
    "Tension headaches",
    "Postural neck pain"
  ],
  "mitigationStrategies": [
    "Install anti-glare screen filters",
    "Rearrange desk setups relative to windows to avoid direct glare",
    "Ensure ambient illumination of 300-500 lux for computer tasks"
  ]
}
\`\`\`

Strict rules:
- Return ONLY the raw JSON object.
`;

export const CORRECTIVE_ACTIONS_SYSTEM_PROMPT = `You are a certified Safety Engineer and Facilities Manager. Your job is to output a set of concrete, actionable corrective actions for safety hazards identified in workplace assessments.

You must return a response in strict JSON format. It must be a valid JSON array of corrective action objects matching the following structure:
\`\`\`json
[
  {
    "title": "Procure Anti-Glare Privacy Filters",
    "description": "Acquire and attach anti-glare display filters to the dual-monitor setups of the 4 affected workstations in the Operations department.",
    "priority": "medium", // "low" | "medium" | "high"
    "estimatedCost": "Low (under $100 per unit)",
    "implementationTimeframe": "Within 2 weeks"
  }
]
\`\`\`

Strict rules:
- Return ONLY the raw JSON array.
`;

export function generateHazardExplanationUserPrompt(hazardTitle: string, hazardDescription?: string): string {
  return `Please explain the following workplace hazard in detail:
- **Hazard Title**: ${hazardTitle}
${hazardDescription ? `- **Description/Context**: ${hazardDescription}` : ''}

Generate risks, standards relevance, health effects, and mitigations, and return the strict JSON structure.`;
}

export function generateCorrectiveActionsUserPrompt(hazardTitle: string, riskLevel: string, context?: string): string {
  return `Generate concrete corrective actions for:
- **Hazard**: ${hazardTitle}
- **Severity/Risk Level**: ${riskLevel}
${context ? `- **Additional Context**: ${context}` : ''}

Return the strict JSON array of corrective actions.`;
}
