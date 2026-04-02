import { describe, it, expect, beforeEach } from "vitest";
import {
  setSessionConfig,
  getSessionConfig,
  clearSessionConfig,
  hasSessionConfig,
  getAuthHeaders,
  getBaseUrl,
} from "./session-store";
import type { AIConfig } from "./providers";

const testConfig: AIConfig = {
  providerId: "anthropic",
  modelId: "claude-opus-4-6",
  apiKey: "sk-ant-api03-test123",
};

describe("session store", () => {
  beforeEach(() => {
    clearSessionConfig("test-session");
  });

  it("stores and retrieves config", () => {
    setSessionConfig("test-session", testConfig);
    expect(getSessionConfig("test-session")).toEqual(testConfig);
  });

  it("returns null for unknown session", () => {
    expect(getSessionConfig("unknown")).toBeNull();
  });

  it("clears config", () => {
    setSessionConfig("test-session", testConfig);
    clearSessionConfig("test-session");
    expect(getSessionConfig("test-session")).toBeNull();
  });

  it("checks if session has config", () => {
    expect(hasSessionConfig("test-session")).toBe(false);
    setSessionConfig("test-session", testConfig);
    expect(hasSessionConfig("test-session")).toBe(true);
  });

  it("isolates sessions", () => {
    const config2: AIConfig = { providerId: "openai", modelId: "gpt-4o", apiKey: "sk-proj-abc" };
    setSessionConfig("session-1", testConfig);
    setSessionConfig("session-2", config2);
    expect(getSessionConfig("session-1")?.providerId).toBe("anthropic");
    expect(getSessionConfig("session-2")?.providerId).toBe("openai");
  });
});

describe("getAuthHeaders", () => {
  it("returns correct headers for anthropic", () => {
    const headers = getAuthHeaders(testConfig);
    expect(headers["x-api-key"]).toBe("sk-ant-api03-test123");
    expect(headers["anthropic-version"]).toBe("2023-06-01");
    expect(headers["content-type"]).toBe("application/json");
  });

  it("returns correct headers for openai", () => {
    const headers = getAuthHeaders({ providerId: "openai", modelId: "gpt-4o", apiKey: "sk-proj-abc" });
    expect(headers["Authorization"]).toBe("Bearer sk-proj-abc");
  });

  it("returns correct headers for google", () => {
    const headers = getAuthHeaders({ providerId: "google", modelId: "gemini-2.5-pro", apiKey: "AIzaTest" });
    expect(headers["x-goog-api-key"]).toBe("AIzaTest");
  });
});

describe("getBaseUrl", () => {
  it("returns correct URLs", () => {
    expect(getBaseUrl("anthropic")).toBe("https://api.anthropic.com/v1");
    expect(getBaseUrl("openai")).toBe("https://api.openai.com/v1");
    expect(getBaseUrl("google")).toBe("https://generativelanguage.googleapis.com/v1beta");
  });
});
