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
}

export const chatWithModelFallback = async ({
  models,
  messages,
  maxTokens,
}: CompletionWithFallbackOptions) => {
  let lastError: unknown = null;

  for (const model of models) {
    try {
      const response = await openai.chat.completions.create({
        model,
        messages,
        ...(maxTokens ? { max_tokens: maxTokens } : {}),
      });

      const content = response.choices?.[0]?.message?.content?.trim() || '';
      if (content) {
        return { content, model };
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }

  throw new Error('Unable to generate AI response from configured models');
};

export default openai
