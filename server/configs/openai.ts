import OpenAI from 'openai';

export const AI_MODEL = process.env.AI_MODEL || 'kwaipilot/kat-coder-pro';
const parsedMaxTokens = Number.parseInt(process.env.AI_MAX_TOKENS || '', 10);
export const AI_MAX_TOKENS = parsedMaxTokens > 0 ? parsedMaxTokens : 4096;

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.AI_API_KEY,
});

export default openai
