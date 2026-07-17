export type MessageRole = 'system' | 'user' | 'assistant';

export interface ChatCompletionMessage {
  role: MessageRole;
  content: string;
}

export interface AiModelConfig {
  modelId: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

export interface AiCompletionResponse {
  content: string;
  modelUsed: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  latencyMs: number;
}

export interface AiProvider {
  name: string;
  chatCompletion(
    messages: ChatCompletionMessage[],
    config: AiModelConfig
  ): Promise<AiCompletionResponse>;
}

// Structured Response Types

export interface DetectedRiskItem {
  body_part?: string;
  category?: string;
  finding: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  score?: number;
}

export interface AssessmentAnalysisResult {
  overallRiskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidenceScore: number;
  summary: string;
  recommendations: string[];
  detectedRisks: DetectedRiskItem[];
  bodyPartScores?: Record<string, number>;
  categoryScores?: Record<string, number>;
}

export interface RecommendationItem {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  estimatedImpact?: string;
}

export interface ExecutiveReportResult {
  title: string;
  executiveSummary: string;
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  finalConclusion: string;
  keyFindings: string[];
  recommendationsSummary: string[];
  hazardsDetail?: Array<{
    title: string;
    status: string;
    severity?: string;
    description?: string;
    department?: string;
  }>;
  recommendationsDetail?: Array<{
    title: string;
    status: string;
    priority: string;
    description?: string;
  }>;
  additionalNotes?: string;
}

export interface HazardExplanationResult {
  hazardName: string;
  explanation: string;
  associatedRisks: string[];
  isoStandardRelevance?: string[];
  healthEffects: string[];
  mitigationStrategies: string[];
}

export interface CorrectiveActionItem {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedCost?: string;
  implementationTimeframe?: string;
}

// RAG (Retrieval-Augmented Generation) Interfaces
export interface RagDocument {
  id?: string;
  content: string;
  source: string;
  score?: number;
  metadata?: Record<string, any>;
}

export interface RagQueryOptions {
  limit?: number;
  sources?: string[];
  minScore?: number;
}
