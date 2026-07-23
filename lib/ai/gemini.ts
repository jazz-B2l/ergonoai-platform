import { GoogleGenAI } from '@google/genai';
import { AiProvider, ChatCompletionMessage, AiModelConfig, AiCompletionResponse, AiProviderCapabilities } from './types';
import { AI_CONSTANTS } from './constants';

export class GeminiProvider implements AiProvider {
  public readonly name = 'gemini';
  private static instance: GeminiProvider | null = null;
  private client: GoogleGenAI;

  public readonly capabilities: AiProviderCapabilities = {
    supportsStreaming: true,
    supportsVision: true,
    supportsThinking: true,
    supportsJSON: true,
    supportsFiles: true,
  };

  private constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('API KEY VALIDATION ERROR:', AI_CONSTANTS.ERRORS.MISSING_API_KEY);
      throw new Error(AI_CONSTANTS.ERRORS.MISSING_API_KEY);
    }
    this.client = new GoogleGenAI({ apiKey });
  }

  /**
   * Retrieves the singleton instance of the GeminiProvider.
   * Throws an error immediately at startup if the API key is not configured.
   */
  public static getInstance(): GeminiProvider {
    if (!GeminiProvider.instance) {
      GeminiProvider.instance = new GeminiProvider();
    }
    return GeminiProvider.instance;
  }

  /**
   * Health check verification for Gemini connectivity.
   */
  async isHealthy(): Promise<boolean> {
    try {
      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: 'respond with single word "OK"' }] }],
        config: { maxOutputTokens: 5 }
      });
      return !!response.text;
    } catch (err) {
      console.warn('[GEMINI HEALTH CHECK FAILED]:', err);
      return false;
    }
  }

  /**
   * Performs chat completion against Google Gemini API.
   */
  async chatCompletion(
    messages: ChatCompletionMessage[],
    config: AiModelConfig
  ): Promise<AiCompletionResponse> {
    const startTime = Date.now();
    const model = config.modelId;
    const temperature = config.temperature ?? 0.7;
    const maxTokens = config.maxTokens ?? 2048;
    const timeoutMs = config.timeoutMs ?? 30000;

    // Extract system instruction from messages if present
    const systemMessage = messages.find(m => m.role === 'system');
    const systemInstruction = systemMessage ? systemMessage.content : undefined;

    // Convert messages to Gemini format (mapping assistant to model, removing system messages)
    const contents = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

    if (contents.length === 0) {
      contents.push({
        role: 'user',
        parts: [{ text: 'Hello' }]
      });
    }

    const executeRequest = async (modelId: string): Promise<any> => {
      return this.client.models.generateContent({
        model: modelId,
        contents,
        config: {
          systemInstruction,
          temperature,
          maxOutputTokens: maxTokens,
        }
      });
    };

    try {
      let responsePromise;
      if (model === 'gemini-2.5-pro') {
        // Fallback dynamically to gemini-2.5-flash if the key does not support/have access to gemini-2.5-pro
        responsePromise = executeRequest('gemini-2.5-pro').catch(err => {
          console.warn(`[GEMINI PRO FALLBACK] Failed to run with gemini-2.5-pro: ${err.message}. Falling back to gemini-2.5-flash.`);
          return executeRequest('gemini-2.5-flash');
        });
      } else {
        responsePromise = executeRequest(model);
      }

      // Enforce timeout using Promise.race
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('TIMEOUT_ERROR')), timeoutMs)
      );

      const response = await Promise.race([responsePromise, timeoutPromise]);
      const latencyMs = Date.now() - startTime;
      const content = response.text || '';

      if (!content) {
        throw new Error(AI_CONSTANTS.ERRORS.EMPTY_RESPONSE);
      }

      const promptTokens = response.usageMetadata?.promptTokenCount;
      const completionTokens = response.usageMetadata?.candidatesTokenCount;
      const totalTokens = response.usageMetadata?.totalTokenCount;

      return {
        content,
        modelUsed: response.model || model,
        providerUsed: this.name,
        promptTokens,
        completionTokens,
        totalTokens,
        latencyMs,
        fallbackOccurred: false,
      };
    } catch (error: any) {
      const latencyMs = Date.now() - startTime;

      if (error?.message === 'TIMEOUT_ERROR' || error?.message?.includes('timeout') || error?.message?.includes('Timeout')) {
        throw new Error(`${AI_CONSTANTS.ERRORS.TIMEOUT} (${timeoutMs}ms passed). Latency: ${latencyMs}ms.`);
      }

      if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('quota') || error?.message?.includes('Quota') || error?.message?.includes('rate limit')) {
        throw new Error(`${AI_CONSTANTS.ERRORS.RATE_LIMIT_EXCEEDED} Details: ${error?.message || error}`);
      }

      throw new Error(`${AI_CONSTANTS.ERRORS.API_CONNECTION_FAILED} Details: ${error?.message || error}`);
    }
  }
}

export const getGeminiProvider = (): GeminiProvider => GeminiProvider.getInstance();
