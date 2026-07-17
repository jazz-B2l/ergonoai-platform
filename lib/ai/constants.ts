export const AI_CONSTANTS = {
  // Security and limits
  MAX_REQUESTS_PER_MINUTE: 30, // rate limiting threshold
  TOKEN_LIMIT_CHAT: 2048,
  TOKEN_LIMIT_ANALYSIS: 4096,

  // Prompt formatting
  SYSTEM_PROMPT_PREFIX: 'You are an enterprise AI workplace ergonomics assistant.',

  // Error Messages
  ERRORS: {
    MISSING_API_KEY: 'Critical Setup Error: GROQ_API_KEY is not configured in the environment.',
    UNAUTHORIZED: 'Security Error: Unauthorized access attempt.',
    RATE_LIMIT_EXCEEDED: 'Rate Limit Warning: You have reached the maximum number of requests. Please try again in a minute.',
    INVALID_JSON_RESPONSE: 'AI Engine Error: The AI service returned an invalid or malformed JSON structure.',
    API_CONNECTION_FAILED: 'Network Error: Failed to connect to the Groq AI service. Please check network and API key settings.',
    TIMEOUT: 'AI Engine Error: Request to Groq timed out. The operation exceeded its allocated execution time.',
    EMPTY_RESPONSE: 'AI Engine Error: Groq returned an empty response.',
    RECORD_NOT_FOUND: 'Database Error: The requested assessment or response records could not be found.',
    TRANSACTION_FAILED: 'Database Error: Failed to save the AI findings and recommendations to Supabase.',
  },
} as const;
