// Gemini API Client Configuration
// Uses Google's Generative AI SDK for toolkit generation with web search grounding

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set. AI generation will fail.');
}

// Initialize the Gemini client
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Model configurations
const MODEL_CONFIG = {
  // Primary model for generation with web search
  primary: 'gemini-2.0-flash',
  // Fallback model if primary fails
  fallback: 'gemini-1.5-flash',
};

// Generation settings
const GENERATION_CONFIG = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 4096,
};

// Timeout configuration (in milliseconds)
const TIMEOUT_MS = 30000; // 30 seconds per step

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 2,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
};

export interface GeminiResponse {
  text: string;
  success: boolean;
  error?: string;
}

/**
 * Sleep utility for retry backoff
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay
 */
function getBackoffDelay(attempt: number): number {
  const delay = RETRY_CONFIG.baseDelayMs * Math.pow(2, attempt);
  return Math.min(delay, RETRY_CONFIG.maxDelayMs);
}

/**
 * Create a timeout promise
 */
function createTimeoutPromise<T>(ms: number): Promise<T> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timed out after ${ms}ms`));
    }, ms);
  });
}

/**
 * Get the Gemini model instance
 */
function getModel(useWebSearch: boolean = false): GenerativeModel | null {
  if (!genAI) {
    return null;
  }

  const modelConfig: Parameters<GoogleGenerativeAI['getGenerativeModel']>[0] = {
    model: MODEL_CONFIG.primary,
    generationConfig: GENERATION_CONFIG,
  };

  // Add web search grounding for toolkit recommendations
  if (useWebSearch) {
    modelConfig.tools = [
      {
        // @ts-expect-error - Google Search grounding is a valid tool
        googleSearch: {},
      },
    ];
  }

  return genAI.getGenerativeModel(modelConfig);
}

/**
 * Generate content with Gemini API
 * Includes retry logic with exponential backoff and timeout handling
 */
export async function generateContent(
  prompt: string,
  options: {
    useWebSearch?: boolean;
    timeout?: number;
  } = {}
): Promise<GeminiResponse> {
  const { useWebSearch = false, timeout = TIMEOUT_MS } = options;

  const model = getModel(useWebSearch);

  if (!model) {
    return {
      text: '',
      success: false,
      error: 'Gemini API key not configured',
    };
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = getBackoffDelay(attempt - 1);
        console.log(`Retry attempt ${attempt}, waiting ${delay}ms...`);
        await sleep(delay);
      }

      // Race between the API call and timeout
      const result = await Promise.race([
        model.generateContent(prompt),
        createTimeoutPromise<never>(timeout),
      ]);

      const response = result.response;
      const text = response.text();

      if (!text) {
        throw new Error('Empty response from Gemini');
      }

      return {
        text,
        success: true,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Gemini API error (attempt ${attempt + 1}):`, lastError.message);

      // Don't retry on certain errors
      if (
        lastError.message.includes('API key') ||
        lastError.message.includes('quota') ||
        lastError.message.includes('permission')
      ) {
        break;
      }
    }
  }

  return {
    text: '',
    success: false,
    error: lastError?.message || 'Unknown error occurred',
  };
}

/**
 * Parse JSON from Gemini response
 * Handles common formatting issues (markdown code blocks, trailing text)
 */
export function parseGeminiJson<T>(text: string): T | null {
  try {
    // First, try direct parse
    return JSON.parse(text) as T;
  } catch {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim()) as T;
      } catch {
        // Continue to other extraction methods
      }
    }

    // Try to find JSON object or array in the text
    const objectMatch = text.match(/\{[\s\S]*\}/);
    const arrayMatch = text.match(/\[[\s\S]*\]/);

    const match = objectMatch || arrayMatch;
    if (match) {
      try {
        return JSON.parse(match[0]) as T;
      } catch {
        // Failed to parse extracted JSON
      }
    }

    console.error('Failed to parse JSON from Gemini response');
    return null;
  }
}

/**
 * Generate content and parse as JSON
 * Combines generation and parsing with error handling
 */
export async function generateJsonContent<T>(
  prompt: string,
  options: {
    useWebSearch?: boolean;
    timeout?: number;
  } = {}
): Promise<{ data: T | null; success: boolean; error?: string }> {
  const response = await generateContent(prompt, options);

  if (!response.success) {
    return {
      data: null,
      success: false,
      error: response.error,
    };
  }

  const data = parseGeminiJson<T>(response.text);

  if (!data) {
    return {
      data: null,
      success: false,
      error: 'Failed to parse JSON response',
    };
  }

  return {
    data,
    success: true,
  };
}

export { TIMEOUT_MS, RETRY_CONFIG };
