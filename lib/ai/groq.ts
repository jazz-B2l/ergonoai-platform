import Groq from 'groq-sdk';
import { AiProvider, ChatCompletionMessage, AiModelConfig, AiCompletionResponse } from './types';
import { AI_CONSTANTS } from './constants';

export class GroqProvider implements AiProvider {
  public readonly name = 'groq';
  private static instance: GroqProvider | null = null;
  private client: Groq;

  private constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('API KEY VALIDATION ERROR:', AI_CONSTANTS.ERRORS.MISSING_API_KEY);
      throw new Error(AI_CONSTANTS.ERRORS.MISSING_API_KEY);
    }
    this.client = new Groq({ apiKey });
  }

  /**
   * Retrieves the singleton instance of the GroqProvider.
   * Throws an error immediately at startup if the API key is not configured.
   */
  public static getInstance(): GroqProvider {
    if (!GroqProvider.instance) {
      GroqProvider.instance = new GroqProvider();
    }
    return GroqProvider.instance;
  }

  /**
   * Performs chat completion against Groq API.
   * Implements timeout and measures usage metrics.
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
      // Execute chat completion with request level timeout options
      const completionPromise = this.client.chat.completions.create({
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

      const response = await completionPromise;
      const latencyMs = Date.now() - startTime;
      const content = response.choices[0]?.message?.content || '';

      if (!content) {
        throw new Error(AI_CONSTANTS.ERRORS.EMPTY_RESPONSE);
      }

      return {
        content,
        modelUsed: response.model || model,
        promptTokens: response.usage?.prompt_tokens,
        completionTokens: response.usage?.completion_tokens,
        totalTokens: response.usage?.total_tokens,
        latencyMs,
      };
    } catch (error: any) {
      const latencyMs = Date.now() - startTime;
      
      // Determine if error was a timeout
      if (error?.name === 'APIConnectionTimeoutError' || error?.message?.includes('timeout') || error?.message?.includes('Timeout')) {
        throw new Error(`${AI_CONSTANTS.ERRORS.TIMEOUT} (${timeoutMs}ms passed). Latency: ${latencyMs}ms.`);
      }

      // Check for rate limits (HTTP 429)
      if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('Rate limit')) {
        throw new Error(`${AI_CONSTANTS.ERRORS.RATE_LIMIT_EXCEEDED} Details: ${error?.message || error}`);
      }

      throw new Error(`${AI_CONSTANTS.ERRORS.API_CONNECTION_FAILED} Details: ${error?.message || error}`);
    }
  }
}

export const getGroqProvider = (): GroqProvider => GroqProvider.getInstance();
export const getGroqClient = (): Groq => {
  // Returns raw Groq SDK instance if needed for streaming direct
  return GroqProvider.getInstance()['client'];
};
