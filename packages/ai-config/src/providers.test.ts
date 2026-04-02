import { describe, it, expect } from "vitest";
import {
  AI_PROVIDERS,
  providerIds,
  getProvider,
  getModelsForProvider,
  findModel,
  validateApiKeyFormat,
  aiConfigSchema,
  providerIdSchema,
} from "./providers";

describe("AI_PROVIDERS", () => {
  it("has anthropic, openai, and google providers", () => {
    expect(providerIds).toEqual(["anthropic", "openai", "google"]);
  });

  it("each provider has at least one model", () => {
    for (const id of providerIds) {
      expect(AI_PROVIDERS[id].models.length).toBeGreaterThan(0);
    }
  });

  it("each provider has required fields", () => {
    for (const id of providerIds) {
      const provider = AI_PROVIDERS[id];
      expect(provider.name).toBeTruthy();
      expect(provider.apiKeyPrefix).toBeTruthy();
      expect(provider.apiKeyPlaceholder).toBeTruthy();
      expect(provider.docsUrl).toBeTruthy();
      expect(provider.headerName).toBeTruthy();
    }
  });

  it("each model has id, name, and capability", () => {
    for (const id of providerIds) {
      for (const model of AI_PROVIDERS[id].models) {
        expect(model.id).toBeTruthy();
        expect(model.name).toBeTruthy();
        expect(model.capability).toBeTruthy();
      }
    }
  });
});

describe("getProvider", () => {
  it("returns the correct provider", () => {
    expect(getProvider("anthropic").name).toBe("Anthropic");
    expect(getProvider("openai").name).toBe("OpenAI");
    expect(getProvider("google").name).toBe("Google AI");
  });
});

describe("getModelsForProvider", () => {
  it("returns models for anthropic", () => {
    const models = getModelsForProvider("anthropic");
    expect(models.length).toBeGreaterThanOrEqual(3);
    expect(models[0].id).toBe("claude-opus-4-6");
  });

  it("returns models for openai", () => {
    const models = getModelsForProvider("openai");
    expect(models.some((m) => m.id === "gpt-4o")).toBe(true);
  });
});

describe("findModel", () => {
  it("finds existing model", () => {
    const model = findModel("anthropic", "claude-opus-4-6");
    expect(model).toBeDefined();
    expect(model?.name).toBe("Claude Opus 4.6");
  });

  it("returns undefined for non-existent model", () => {
    expect(findModel("anthropic", "nonexistent")).toBeUndefined();
  });
});

describe("validateApiKeyFormat", () => {
  it("validates anthropic key prefix", () => {
    expect(validateApiKeyFormat("anthropic", "sk-ant-api03-abc123")).toBe(true);
    expect(validateApiKeyFormat("anthropic", "sk-proj-abc123")).toBe(false);
  });

  it("validates openai key prefix", () => {
    expect(validateApiKeyFormat("openai", "sk-proj-abc123")).toBe(true);
    expect(validateApiKeyFormat("openai", "AIza123")).toBe(false);
  });

  it("validates google key prefix", () => {
    expect(validateApiKeyFormat("google", "AIzaSyAbc123")).toBe(true);
    expect(validateApiKeyFormat("google", "sk-abc123")).toBe(false);
  });
});

describe("aiConfigSchema", () => {
  it("validates valid config", () => {
    const result = aiConfigSchema.safeParse({
      providerId: "anthropic",
      modelId: "claude-opus-4-6",
      apiKey: "sk-ant-api03-abc123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing apiKey", () => {
    const result = aiConfigSchema.safeParse({
      providerId: "anthropic",
      modelId: "claude-opus-4-6",
      apiKey: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid provider", () => {
    const result = aiConfigSchema.safeParse({
      providerId: "invalid",
      modelId: "some-model",
      apiKey: "some-key",
    });
    expect(result.success).toBe(false);
  });
});

describe("providerIdSchema", () => {
  it("accepts valid provider ids", () => {
    expect(providerIdSchema.safeParse("anthropic").success).toBe(true);
    expect(providerIdSchema.safeParse("openai").success).toBe(true);
    expect(providerIdSchema.safeParse("google").success).toBe(true);
  });

  it("rejects invalid provider ids", () => {
    expect(providerIdSchema.safeParse("invalid").success).toBe(false);
    expect(providerIdSchema.safeParse("").success).toBe(false);
  });
});
