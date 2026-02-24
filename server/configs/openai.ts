import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const DEFAULT_PRIMARY_MODEL = 'qwen/qwen3-coder';
const DEFAULT_FALLBACK_MODEL = 'openai/gpt-4.1-mini';

const parsedMaxTokens = Number.parseInt(process.env.AI_MAX_TOKENS || '', 10);
export const AI_MAX_TOKENS = parsedMaxTokens > 0 ? parsedMaxTokens : 4096;

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.AI_API_KEY,
});

const uniqueModels = (models: Array<string | undefined>) =>
  [...new Set(models.map((m) => (m || '').trim()).filter(Boolean))];

export const AI_MODELS = {
  enhance: uniqueModels([
    process.env.AI_MODEL_ENHANCE || process.env.AI_MODEL || DEFAULT_PRIMARY_MODEL,
    process.env.AI_MODEL_ENHANCE_FALLBACK || process.env.AI_MODEL_FALLBACK || DEFAULT_FALLBACK_MODEL,
  ]),
  generate: uniqueModels([
    process.env.AI_MODEL_GENERATE || process.env.AI_MODEL || DEFAULT_PRIMARY_MODEL,
    process.env.AI_MODEL_GENERATE_FALLBACK || process.env.AI_MODEL_FALLBACK || DEFAULT_FALLBACK_MODEL,
  ]),
};

interface CompletionWithFallbackOptions {
  models: string[];
  messages: ChatCompletionMessageParam[];
  maxTokens?: number;
  timeout?: number;
}

const getAffordableTokenLimit = (error: any): number | null => {
  if (error?.status !== 402 && error?.code !== 402) return null;

  const message =
    error?.error?.message ||
    error?.message ||
    '';

  const match = String(message).match(/can only afford\s+(\d+)/i);
  if (!match) return null;

  const parsed = Number.parseInt(match[1], 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export const chatWithModelFallback = async ({
  models,
  messages,
  maxTokens,
  timeout = 60000,
}: CompletionWithFallbackOptions) => {
  let lastError: unknown = null;

  for (const model of models) {
    let requestedMaxTokens = maxTokens;

    try {
      const response = await openai.chat.completions.create({
        model,
        messages,
        ...(requestedMaxTokens ? { max_tokens: requestedMaxTokens } : {}),
      }, {
        timeout,
      });

      const content = response.choices?.[0]?.message?.content?.trim() || '';
      if (content) {
        return { content, model };
      }
      
      // Clear lastError since this model responded successfully (HTTP 200) but with empty content
      lastError = null;
    } catch (error) {
      const affordableTokenLimit = getAffordableTokenLimit(error);
      if (affordableTokenLimit && requestedMaxTokens && affordableTokenLimit < requestedMaxTokens) {
        const adjustedMaxTokens = Math.max(256, affordableTokenLimit - 32);

        try {
          const retryResponse = await openai.chat.completions.create({
            model,
            messages,
            max_tokens: adjustedMaxTokens,
          }, {
            timeout,
          });

          const retryContent = retryResponse.choices?.[0]?.message?.content?.trim() || '';
          if (retryContent) {
            return { content: retryContent, model };
          }
        } catch (retryError) {
          lastError = retryError;
          continue;
        }
      }

      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }

  throw new Error('Unable to generate AI response from configured models');
};

export default openai
