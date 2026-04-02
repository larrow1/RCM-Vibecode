import type { AIConfig, ProviderId } from "./providers";

/**
 * Session-scoped AI configuration store.
 *
 * Stores API keys and model selection in memory for the current session.
 * Keys are never persisted to disk or database — they live only in the
 * server process memory for the duration of the session.
 *
 * For browser-side storage, use the companion `useAIConfig` hook which
 * stores config in sessionStorage (cleared when tab closes).
 */

const sessionConfigs = new Map<string, AIConfig>();

export function setSessionConfig(sessionId: string, config: AIConfig): void {
  sessionConfigs.set(sessionId, config);
}

export function getSessionConfig(sessionId: string): AIConfig | null {
  return sessionConfigs.get(sessionId) ?? null;
}

export function clearSessionConfig(sessionId: string): void {
  sessionConfigs.delete(sessionId);
}

export function hasSessionConfig(sessionId: string): boolean {
  return sessionConfigs.has(sessionId);
}

/**
 * Build request headers for the configured provider.
 */
export function getAuthHeaders(config: AIConfig): Record<string, string> {
  const { providerId, apiKey } = config;

  switch (providerId) {
    case "anthropic":
      return {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      };
    case "openai":
      return {
        Authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      };
    case "google":
      return {
        "x-goog-api-key": apiKey,
        "content-type": "application/json",
      };
    default:
      throw new Error(`Unknown provider: ${providerId}`);
  }
}

/**
 * Get the base API URL for a provider.
 */
export function getBaseUrl(providerId: ProviderId): string {
  switch (providerId) {
    case "anthropic":
      return "https://api.anthropic.com/v1";
    case "openai":
      return "https://api.openai.com/v1";
    case "google":
      return "https://generativelanguage.googleapis.com/v1beta";
    default:
      throw new Error(`Unknown provider: ${providerId}`);
  }
}
