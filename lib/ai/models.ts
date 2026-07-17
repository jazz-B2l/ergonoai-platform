import { AiModelConfig } from './types';

export const GROQ_MODELS = {
  LLAMA_3_3_70B: 'llama-3.3-70b-versatile',
  LLAMA_3_1_8B: 'llama-3.1-8b-instant',
  MIXTRAL_8X7B: 'mixtral-8x7b-32768',
  GEMMA2_9B: 'gemma2-9b-it',
} as const;

export const DEFAULT_CHAT_MODEL = GROQ_MODELS.LLAMA_3_1_8B;
export const DEFAULT_ANALYSIS_MODEL = GROQ_MODELS.LLAMA_3_3_70B;

export const DEFAULT_CHAT_CONFIG: Required<Omit<AiModelConfig, 'modelId'>> = {
  temperature: 0.7,
  maxTokens: 2048,
  timeoutMs: 30000, // 30 seconds
};

export const DEFAULT_ANALYSIS_CONFIG: Required<Omit<AiModelConfig, 'modelId'>> = {
  temperature: 0.1, // low temperature for structured output consistency
  maxTokens: 4096,
  timeoutMs: 60000, // 60 seconds
};

export const MODEL_REGISTRY: Record<string, { description: string; maxContextWindow: number }> = {
  [GROQ_MODELS.LLAMA_3_3_70B]: {
    description: 'Meta Llama 3.3 70B Versatile - high intelligence and reasoning capability',
    maxContextWindow: 128000,
  },
  [GROQ_MODELS.LLAMA_3_1_8B]: {
    description: 'Meta Llama 3.1 8B Instant - high-speed, lightweight model',
    maxContextWindow: 128000,
  },
  [GROQ_MODELS.MIXTRAL_8X7B]: {
    description: 'Mistral Mixtral 8x7B Instruct - great coding and logic capabilities',
    maxContextWindow: 32768,
  },
  [GROQ_MODELS.GEMMA2_9B]: {
    description: 'Google Gemma 2 9B IT - efficient Google-designed instruct model',
    maxContextWindow: 8192,
  },
};
