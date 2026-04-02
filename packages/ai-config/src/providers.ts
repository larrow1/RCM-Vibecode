import { z } from "zod";

/**
 * Supported AI model providers and their available models.
 */
export const AI_PROVIDERS = {
  anthropic: {
    name: "Anthropic",
    models: [
      { id: "claude-opus-4-6", name: "Claude Opus 4.6", capability: "most-capable" },
      { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", capability: "balanced" },
      { id: "claude-haiku-4-5-20251001", name: "Claude Haiku 4.5", capability: "fast" },
    ],
    apiKeyPrefix: "sk-ant-",
    apiKeyPlaceholder: "sk-ant-api03-...",
    docsUrl: "https://docs.anthropic.com/en/api",
    headerName: "x-api-key",
  },
  openai: {
    name: "OpenAI",
    models: [
      { id: "gpt-4o", name: "GPT-4o", capability: "most-capable" },
      { id: "gpt-4o-mini", name: "GPT-4o Mini", capability: "fast" },
      { id: "o3", name: "o3", capability: "reasoning" },
      { id: "o4-mini", name: "o4-mini", capability: "reasoning-fast" },
    ],
    apiKeyPrefix: "sk-",
    apiKeyPlaceholder: "sk-proj-...",
    docsUrl: "https://platform.openai.com/docs/api-reference",
    headerName: "Authorization",
  },
  google: {
    name: "Google AI",
    models: [
      { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", capability: "most-capable" },
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", capability: "fast" },
    ],
    apiKeyPrefix: "AI",
    apiKeyPlaceholder: "AIza...",
    docsUrl: "https://ai.google.dev/docs",
    headerName: "x-goog-api-key",
  },
} as const;

export type ProviderId = keyof typeof AI_PROVIDERS;

export type ModelCapability = "most-capable" | "balanced" | "fast" | "reasoning" | "reasoning-fast";

export interface ModelInfo {
  id: string;
  name: string;
  capability: ModelCapability;
}

export interface ProviderInfo {
  name: string;
  models: readonly ModelInfo[];
  apiKeyPrefix: string;
  apiKeyPlaceholder: string;
  docsUrl: string;
  headerName: string;
}

export const providerIds = Object.keys(AI_PROVIDERS) as ProviderId[];

export function getProvider(id: ProviderId): ProviderInfo {
  return AI_PROVIDERS[id];
}

export function getModelsForProvider(id: ProviderId): readonly ModelInfo[] {
  return AI_PROVIDERS[id].models;
}

export function findModel(providerId: ProviderId, modelId: string): ModelInfo | undefined {
  return AI_PROVIDERS[providerId].models.find((m) => m.id === modelId);
}

// --- Validation schemas ---

export const providerIdSchema = z.enum(["anthropic", "openai", "google"]);

export const aiConfigSchema = z.object({
  providerId: providerIdSchema,
  modelId: z.string().min(1, "Model is required"),
  apiKey: z.string().min(1, "API key is required"),
});

export type AIConfig = z.infer<typeof aiConfigSchema>;

export function validateApiKeyFormat(providerId: ProviderId, apiKey: string): boolean {
  const provider = AI_PROVIDERS[providerId];
  return apiKey.startsWith(provider.apiKeyPrefix);
}
