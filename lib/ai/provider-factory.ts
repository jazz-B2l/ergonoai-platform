import { AIProviderType, AiProvider } from './types';
import { getGeminiProvider } from './gemini';
import { getGroqProvider } from './groq';

export class ProviderFactory {
  /**
   * Resolves the appropriate provider instance based on type.
   * Supports future provider extensions dynamically (e.g. OpenAI, Claude).
   */
  public static get(provider: Exclude<AIProviderType, 'auto'>): AiProvider {
    switch (provider) {
      case 'gemini':
        return getGeminiProvider();
      case 'groq':
        return getGroqProvider();
      default:
        throw new Error(`Unsupported AI Provider Type: "${provider}"`);
    }
  }
}
