import { AIProviderType } from './types';

export interface RouteTarget {
  provider: AIProviderType;
  model: string;
}

export const AUTO_ROUTING: Record<'chat' | 'assessment' | 'recommendations' | 'report', RouteTarget> = {
  chat: {
    provider: 'gemini',
    model: 'gemini-2.5-flash',
  },
  assessment: {
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
  },
  recommendations: {
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
  },
  report: {
    provider: 'gemini',
    model: 'gemini-2.5-pro',
  },
};

export const PROVIDER_PRIORITY: Exclude<AIProviderType, 'auto'>[] = ['gemini', 'groq'];

export const ROUTING_POLICIES = {
  maxRetries: 2,
  timeoutMs: 30000,
  fallbackOnErrors: ['TIMEOUT_ERROR', '429', 'quota', 'rate limit', 'Network Error', 'Connection failed'],
};
