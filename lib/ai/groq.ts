import Groq from 'groq-sdk';
import { AiProvider, ChatCompletionMessage, AiModelConfig, AiCompletionResponse, AiProviderCapabilities } from './types';
import { AI_CONSTANTS } from './constants';

export class GroqProvider implements AiProvider {
  public readonly name = 'groq';
  private static instance: GroqProvider | null = null;
  private client: Groq;

  public readonly capabilities: AiProviderCapabilities = {
    supportsStreaming: true,
    supportsVision: true,
    supportsThinking: false,
    supportsJSON: true,
    supportsFiles: false,
  };

  private constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('API KEY VALIDATION ERROR:', AI_CONSTANTS.ERRORS.MISSING_API_KEY);
      throw new Error(AI_CONSTANTS.ERRORS.MISSING_API_KEY);
    }
    this.client = new Groq({ apiKey });
  }

  public static getInstance(): GroqProvider {
    if (!GroqProvider.instance) {
      GroqProvider.instance = new GroqProvider();
    }
    return GroqProvider.instance;
  }

  /**
   * Health check verification for Groq connectivity.
   */
  async isHealthy(): Promise<boolean> {
    try {
      const response = await this.client.chat.completions.create({
        messages: [{ role: 'user', content: 'respond with single word "OK"' }],
        model: 'llama-3.1-8b-instant',
        max_tokens: 5,
      }, {
        timeout: 5000, // 5 seconds health check timeout
      });
      return !!response.choices[0]?.message?.content;
    } catch (err) {
      console.warn('[GROQ HEALTH CHECK FAILED]:', err);
      return false;
    }
  }

  /**
   * Performs chat completion against Groq API.
   */
  async chatCompletion(
    messages: ChatCompletionMessage[],
    config: AiModelConfig
  ): Promise<AiCompletionResponse> {
    const startTime = Date.now();
    const model = config.modelId;
    const temperature = config.temperature;
    const maxTokens = config.maxTokens;
    const timeoutMs = config.timeoutMs || 30000;

    try {
      const response = await this.client.chat.completions.create({
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        model,
        temperature,
        max_tokens: maxTokens,
      }, {
        timeout: timeoutMs
      });

      const latencyMs = Date.now() - startTime;
      const content = response.choices[0]?.message?.content || '';

      if (!content) {
        throw new Error(AI_CONSTANTS.ERRORS.EMPTY_RESPONSE);
      }

      return {
        content,
        modelUsed: response.model || model,
        providerUsed: this.name,
        promptTokens: response.usage?.prompt_tokens,
        completionTokens: response.usage?.completion_tokens,
        totalTokens: response.usage?.total_tokens,
        latencyMs,
        fallbackOccurred: false,
      };
    } catch (error: any) {
      const latencyMs = Date.now() - startTime;
      
      if (error?.name === 'APIConnectionTimeoutError' || error?.message?.includes('timeout') || error?.message?.includes('Timeout')) {
        throw new Error(`${AI_CONSTANTS.ERRORS.TIMEOUT} (${timeoutMs}ms passed). Latency: ${latencyMs}ms.`);
      }

      if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('Rate limit')) {
        throw new Error(`${AI_CONSTANTS.ERRORS.RATE_LIMIT_EXCEEDED} Details: ${error?.message || error}`);
      }

      throw new Error(`${AI_CONSTANTS.ERRORS.API_CONNECTION_FAILED} Details: ${error?.message || error}`);
    }
  }
}

export const getGroqProvider = (): GroqProvider => GroqProvider.getInstance();
