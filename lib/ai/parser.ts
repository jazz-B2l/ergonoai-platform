import { AI_CONSTANTS } from './constants';

/**
 * Safely parses JSON strings returned by AI providers.
 * Strips markdown code fences (e.g. ```json ... ```) and extracts
 * the inner JSON block if conversational preamble/postamble exists.
 */
export function safeParseJson<T>(content: string): T {
  if (!content) {
    throw new Error(AI_CONSTANTS.ERRORS.EMPTY_RESPONSE);
  }

  let cleaned = content.trim();

  // Strip code fences if they surround the content
  if (cleaned.startsWith('```')) {
    cleaned = cleaned
      .replace(/^```(?:json)?\n?/i, '') // Remove starting fence and optional "json" marker
      .replace(/\n?```$/i, '')          // Remove ending fence
      .trim();
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch (directError) {
    // Attempt fallback: locate first opening brace/bracket and last closing brace/bracket
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');

    let start = -1;
    let end = -1;

    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      // Expecting a JSON Object
      start = firstBrace;
      end = cleaned.lastIndexOf('}');
    } else if (firstBracket !== -1) {
      // Expecting a JSON Array
      start = firstBracket;
      end = cleaned.lastIndexOf(']');
    }

    if (start !== -1 && end !== -1 && end > start) {
      try {
        const extracted = cleaned.substring(start, end + 1);
        return JSON.parse(extracted) as T;
      } catch (extractionError) {
        throw new Error(
          `${AI_CONSTANTS.ERRORS.INVALID_JSON_RESPONSE} ` +
          `Original error: ${(directError as Error).message}. Extraction error: ${(extractionError as Error).message}`
        );
      }
    }

    throw new Error(`${AI_CONSTANTS.ERRORS.INVALID_JSON_RESPONSE} Error: ${(directError as Error).message}`);
  }
}
